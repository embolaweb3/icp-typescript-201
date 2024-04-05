import React, { useEffect, useState } from 'react';
import CampaignList from './CampaignList';
import { getCampaigns } from '../../utils/marketplace';

// Campaigns component definition
export default function Campaigns() {
  // State variable to store fetched campaigns
  const [campaigns, setCampaigns] = useState([]);

  // useEffect hook to fetch campaigns on component mount
  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const fetchedCampaigns = await getCampaigns();
        setCampaigns(fetchedCampaigns);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    }

    fetchCampaigns();
  }, []);

  // Return JSX for rendering the Campaigns component
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Campaigns</h1>
      <CampaignList campaigns={campaigns} />
    </div>
  );
}
