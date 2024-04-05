import React from 'react';

import CampaignCard from './CampaignCard';

// CampaignList component definition
export default function CampaignList({ campaigns }) {
  // Return JSX for rendering the list of campaigns
  return (
    <div>
        <div className='row justify-content-center align-items-center'>
            {campaigns.map(campaign => (
                    <div className='col-md-4 shadow p-3' key={campaign.id}>
                        <CampaignCard key={campaign.id} campaign={campaign} />
                    </div>
            ))}
        </div>
    </div>
  );
}
