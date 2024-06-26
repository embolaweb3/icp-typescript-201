import { Principal } from "@dfinity/principal";
import { transferICP } from "./ledger";


// Function to register a new user
export async function registerUser(name,initialBalance) {
     return window.canister.marketplace.registerUser(name,initialBalance);
  
}

// Function to create a new campaign
export async function createCampaign(title,description,amount,endDate) {
  return window.canister.marketplace.createCampaign(title,description,amount,endDate);
}

// Function to contribute to a campaign
export async function contributeToCampaign(id,amount) {
  return window.canister.marketplace.contributeToCampaign(id,amount);
}

// Function to retrieve all campaigns
export async function getCampaigns() {
  try {
    return await window.canister.marketplace.getCampaigns();
  } catch (err) {
    // Logout the user if unauthorized
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

// Function to close a campaign
export async function closeCampaign(campaignId) {
  return window.canister.marketplace.closeCampaign(campaignId);
}

// Function to update an existing campaign
export async function updateCampaign(campaignId,title,description,targetAmount,endDate) {
  return window.canister.marketplace.updateCampaign(campaignId,title,description,targetAmount,endDate);
}

// Function to search for campaigns based on keyword
export async function searchCampaigns(keyword) {
  return window.canister.marketplace.searchCampaigns(keyword);
}

// Function to retrieve campaign statistics
export async function getCampaignStatistics(campaignId) {
  return window.canister.marketplace.getCampaignStatistics(campaignId);
}

// Function to retrieve contributions for a specific campaign
export async function getCampaignContributions(campaignId) {
  return window.canister.marketplace.getCampaignContributions(campaignId);
}
