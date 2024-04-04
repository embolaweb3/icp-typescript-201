import React, { useState } from 'react';
import { createCampaign } from '../../utils/marketplace';

export default function CreateCampaignForm() {
  const [campaignData, setCampaignData] = useState({ title: '', description: '', targetAmount: '', endDate: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert endDate to timestamp if it's being updated
    const updatedValue = name === 'endDate' ? htmlDateToTimestamp(value) : value;
    setCampaignData(prevData => ({
      ...prevData,
      [name]: updatedValue
    }));
  };

  const handleCreateCampaign = async () => {
    try {
        console.log(0,campaignData)
      const response = await createCampaign(
        campaignData.title,campaignData.description,
        BigInt(campaignData.targetAmount),BigInt(campaignData.endDate));
      console.log(1,response);
    } catch (error) {
      console.log(2,error);
    }
  };

  const htmlDateToTimestamp = (htmlDate) => {
    const [year, month, day] = htmlDate.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is zero-based, so subtract 1
    return date.getTime();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Create Campaign</h2>
      {/* Input fields for campaign data */}
      <input 
        type="text" 
        name="title" 
        value={campaignData.title} 
        onChange={handleChange} 
        placeholder="Title" 
        className="form-control mb-2" 
      />
      <textarea 
        name="description" 
        value={campaignData.description} 
        onChange={handleChange} 
        placeholder="Description" 
        className="form-control mb-2" 
      />
      <input 
        type="number" 
        name="targetAmount" 
        value={campaignData.targetAmount} 
        onChange={handleChange} 
        placeholder="Target Amount" 
        className="form-control mb-2" 
      />
      <input 
        type="date" 
        name="endDate" 
       
        onChange={handleChange} 
        placeholder="End Date"
        className="form-control mb-2" 
      />
      <button onClick={handleCreateCampaign} className="btn btn-primary mr-2">Create</button>
      <div className="text-danger">{message}</div>
    </div>
  );
}
