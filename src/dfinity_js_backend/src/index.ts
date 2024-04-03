import { query, update, text, Record, StableBTreeMap, Variant, Vec, None, Some, Ok, Err, ic, Principal, Opt, nat64, Duration, Result, bool, Canister } from "azle";
import { v4 as uuidv4 } from "uuid";

// Define variant types for campaign status and messages
const CampaignStatus = Variant({
    Active: text,
    Completed: text,
    Cancelled: text
});

// Define record types for campaign, campaign contribution, and user profile
const Campaign = Record({
    id: text,
    title: text,
    description: text,
    targetAmount: nat64,
    currentAmount: nat64,
    beneficiary: Principal,
    status: CampaignStatus,
    creationDate: nat64,
    endDate: nat64
});

const CampaignContribution = Record({
    campaignId: text,
    contributor: Principal,
    amount: nat64,
    timestamp: nat64
});

const UserProfile = Record({
    principal: Principal,
    name: text,
    balance: nat64
});

// Define variant type for messages
const Message = Variant({
    NotFound: text,
    InvalidPayload: text,
    ContributionFailed: text,
    ContributionCompleted: text
});

// Define stable BTree maps for storing campaigns, contributions, and user profiles
const campaignsStorage = StableBTreeMap(0, text, Campaign);
const contributionsStorage = StableBTreeMap(1, text, Vec(CampaignContribution));
const userProfiles = StableBTreeMap(2, Principal, UserProfile);

// Export Canister object with various functions
export default Canister({
    
    // Function to register a new user with a given name and initial balance
    registerUser: update([text, nat64], Result(text, Message), (name, initialBalance) => {
        const userPrincipal = ic.caller();
    
        // Check if user already exists
        if (userProfiles.get(userPrincipal)) {
            return Err({ InvalidPayload: "User is already registered" });
        }
    
        // Register the user
        const userProfile = {
            principal: userPrincipal,
            name: name,
            balance: initialBalance
        };
    
        userProfiles.insert(userPrincipal, userProfile);
        return Ok(`User ${name} registered successfully with principal ${userPrincipal.toText()} and initial balance ${initialBalance}`);
    }),
    
    // Function to create a new campaign with given details
    createCampaign: update([text, text, nat64, nat64], Result(text, Message), async (title, description, targetAmount, endDate) => {
        const campaignId = uuidv4();
        const beneficiary = ic.caller(); // The creator of the campaign is automatically set as the beneficiary
        const creationDate = ic.time();
        const status = {Active : "ACTIVE" }

        const campaign = {
            id: campaignId,
            title: title,
            description: description,
            targetAmount: targetAmount,
            currentAmount: 0n,
            beneficiary: beneficiary,
            status: status,
            creationDate: creationDate,
            endDate: endDate
        };

        campaignsStorage.insert(campaignId, campaign);
        return Ok(campaignId);
    }),

    // Function to allow a user to contribute to a campaign
    contributeToCampaign: update([text, nat64], Result(text, Message), async (campaignId, amount) => {
        const userOpt = userProfiles.get(ic.caller());
        if ("None" in userOpt) {
            return Err({ NotFound: `User not found` });
        }
    
        const campaignOpt = campaignsStorage.get(campaignId);
        if ("None" in campaignOpt) {
            return Err({ NotFound: `Campaign not found` });
        }
    
        const campaign = campaignOpt.Some;
    
        if (campaign.status.Active !== "ACTIVE") {
            return Err({ InvalidPayload: `Campaign ${campaignId} is not active` });
        }
    
        const user = userOpt.Some;
        if (user.balance < amount) {
            return Err({ InvalidPayload: `Insufficient balance` });
        }
    
        // Update campaign's current amount
        campaign.currentAmount += amount;
        campaignsStorage.insert(campaignId, campaign);
    
        // Record the contribution
        let contributions = [];
        const contributionsOpt = contributionsStorage.get(campaignId);
        if ("Some" in contributionsOpt) {
            contributions = contributionsOpt.Some;
        }
    
        const contribution = {
            campaignId: campaignId,
            contributor: ic.caller(),
            amount: amount,
            timestamp: ic.time()
        };
    
        contributions.push(contribution);
        contributionsStorage.insert(campaignId, contributions);
    
        // Deduct contribution amount from user's balance
        user.balance -= amount;
        userProfiles.insert(ic.caller(), user);
    
        return Ok(`Contribution of ${amount} ICP to campaign ${campaignId} successful.`);
    }),
        
    // Function to retrieve all campaigns
    getCampaigns: query([], Vec(Campaign), () => {
        return campaignsStorage.values();
    }),

    // Function to retrieve contributions for a specific campaign
    getCampaignContributions: query([text], Vec(CampaignContribution), (campaignId) => {
        return contributionsStorage.get(campaignId).Some;
    }),

    // Function to close a campaign
	closeCampaign: update([text], Result(text, Message), async (campaignId) => {
        const campaignOpt = campaignsStorage.get(campaignId);
        if ("None" in campaignOpt) {
            return Err({ NotFound: `Campaign not found` });
        }

        const campaign = campaignOpt.Some;

        if (campaign.status.Active !== "ACTIVE") {
            return Err({ InvalidPayload: `Campaign ${campaignId} is already closed` });
        }

        if (campaign.currentAmount >= campaign.targetAmount) {
            campaign.status = {Active : "NOT-ACTIVE" }
        } else {
            campaign.status = {Cancelled : "CANCELLED" }
        }

        campaignsStorage.insert(campaignId, campaign);

        // Refund contributions if the campaign is cancelled
        if (campaign.status.Cancelled == "CANCELLED") {
            const contributions = contributionsStorage.get(campaignId).Some;
            for (const contribution of contributions) {
                const userOpt = userProfiles.get(contribution.contributor);
                if ("Some" in userOpt) {
                    const user = userOpt.Some;
                    user.balance += contribution.amount;
                    userProfiles.insert(contribution.contributor, user);
                }
            }
           contributionsStorage.insert(campaignId, []);
        }

        return Ok(`Campaign ${campaignId} closed successfully.`);
    }),

    // Function to update an existing campaign
    updateCampaign: update([text, text,text, nat64, nat64], Result(text, Message), async (campaignId, title, description, targetAmount, endDate) => {
        const campaignOpt = campaignsStorage.get(campaignId);
        if ("None" in campaignOpt) {
            return Err({ NotFound: `Campaign not found` });
        }

        const campaign = campaignOpt.Some;

        if (campaign.status.Active !== "ACTIVE") {
            return Err({ InvalidPayload: `Cannot update completed campaign ${campaignId}` });
        }

        campaign.title = title;
        campaign.description = description;
        campaign.targetAmount = targetAmount;
        campaign.endDate = endDate;

        campaignsStorage.insert(campaignId, campaign);

        return Ok(`Campaign ${campaignId} updated successfully.`);
    }),

    // Function to search for campaigns based on keyword
    searchCampaigns: query([text], Vec(Campaign), (keyword) => {
        const campaigns = campaignsStorage.values();
        return campaigns.filter(campaign =>
            campaign.title.includes(keyword) ||
            campaign.description.includes(keyword) ||
            campaign.beneficiary.toText().includes(keyword)
        );
    }),

    // Function to retrieve campaign statistics
    getCampaignStatistics: query([text], Record({
        totalAmountRaised: nat64,
        numberOfContributors: nat64,
        averageContribution: nat64
    }), (campaignId) => {
        const contributions = contributionsStorage.get(campaignId);
        if("None" in contributions){

        }
        const totalAmountRaised = contributions.Some.reduce((total, contribution) => total + contribution.amount, 0n);
        const numberOfContributors = contributions.Some.length;
        const averageContribution = numberOfContributors === 0 ? 0n : totalAmountRaised / BigInt(numberOfContributors);

        return {
            totalAmountRaised,
            numberOfContributors,
            averageContribution
        };
    }),

});
// a workaround to make uuid package work with Azle
globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
        let array = new Uint8Array(32);

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }

        return array;
    }
};
