import React, { useState } from 'react';
import { createCampaign } from '../../utils/marketplace';
import { toast } from 'react-toastify';

// CreateCampaignForm component definition
export default function CreateCampaignForm() {
  // State variables to manage form data and messages
  const [campaignData, setCampaignData] = useState({ title: '', description: '', targetAmount: '', endDate: '' });
  const [message, setMessage] = useState('');

  // Function to handle changes in form input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert endDate to timestamp if it's being updated
    const updatedValue = name === 'endDate' ? htmlDateToTimestamp(value) : value;
    setCampaignData(prevData => ({
      ...prevData,
      [name]: updatedValue
    }));
  };

  // Function to handle campaign creation
  const handleCreateCampaign = async () => {
    try {
      const response = await createCampaign(
        campaignData.title, campaignData.description,
        BigInt(campaignData.targetAmount), BigInt(campaignData.endDate));
      if (response.Ok) {
        toast.success(`Campaign created successfully!`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.error(`Campaign creation failed! `, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error(`An error occurs `, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  // Function to convert HTML date format to timestamp
  const htmlDateToTimestamp = (htmlDate) => {
    const [year, month, day] = htmlDate.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is zero-based, so subtract 1
    return date.getTime();
  };

  // Return JSX for rendering the CreateCampaignForm component
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
