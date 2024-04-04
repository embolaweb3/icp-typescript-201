import { Principal } from "@dfinity/principal";
import { transferICP } from "./ledger";


// Function to register a new user
export async function registerUser(name,initialBalance) {
     return window.canister.marketplace.registerUser(name,initialBalance);
  
}

// Function to create a new campaign
export async function createCampaign(campaignInfo) {
  return window.canister.marketplace.createCampaign(campaignInfo);
}

// Function to contribute to a campaign
export async function contributeToCampaign(data) {
  return window.canister.marketplace.contributeToCampaign(data);
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
export async function updateCampaign(campaignId) {
  return window.canister.marketplace.updateCampaign(campaignId);
}

// Function to search for campaigns based on keyword
export async function searchCampaigns(keyword) {
  return window.canister.marketplace.searchCampaigns(keyword);
}

// Function to retrieve campaign statistics
export async function getCampaignStatistics() {
  return window.canister.marketplace.getCampaignStatistics();
}

// Function to retrieve contributions for a specific campaign
export async function getCampaignContributions(campaignId) {
  return window.canister.marketplace.getCampaignContributions(campaignId);
}
