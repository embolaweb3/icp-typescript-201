import React, { useEffect, useState } from 'react';
import CampaignList from './CampaignList';
import { getCampaigns } from '../../utils/marketplace';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);

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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Campaigns</h1>
      <CampaignList campaigns={campaigns} />
    </div>
  );
}
