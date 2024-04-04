import React, { useState } from 'react';
import { updateCampaign, closeCampaign } from '../../utils/marketplace';

export default function CampaignCard({ campaign }) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdateCampaign = async () => {
    try {
      const response = await updateCampaign(campaign.id);
      setMessage(response);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleCloseCampaign = async () => {
    try {
      const response = await closeCampaign(campaign.id);
      setMessage(response);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="border border-gray-300 rounded-md p-4 mb-4">
      <h2 className="text-xl font-semibold mb-2">{campaign.title}</h2>
      <p className="mb-2">{campaign.description}</p>
      <p className="mb-2">Target Amount: {campaign.targetAmount}</p>
      <p className="mb-2">Current Amount: {campaign.currentAmount}</p>
      <button onClick={() => setShowUpdateModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">Update Campaign</button>
      <button onClick={() => setShowCloseModal(true)} className="bg-red-500 text-white px-4 py-2 rounded-md">Close Campaign</button>

      {/* Update Campaign Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-8 rounded-md z-50">
            <h3 className="text-xl font-semibold mb-4">Update Campaign</h3>
            {/* Input fields for updating campaign */}
            <button onClick={handleUpdateCampaign} className="bg-blue-500 text-white px-4 py-2 rounded-md">Update</button>
            <button onClick={() => setShowUpdateModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md ml-2">Cancel</button>
          </div>
        </div>
      )}

      {/* Close Campaign Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-8 rounded-md z-50">
            <h3 className="text-xl font-semibold mb-4">Close Campaign</h3>
            <p>Are you sure you want to close this campaign?</p>
            <button onClick={handleCloseCampaign} className="bg-red-500 text-white px-4 py-2 rounded-md">Close</button>
            <button onClick={() => setShowCloseModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md ml-2">Cancel</button>
          </div>
        </div>
      )}

      <div className="text-red-600">{message}</div>
    </div>
  );
}
