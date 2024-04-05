// Import necessary modules and functions
import React, { useState } from 'react';
import { updateCampaign, closeCampaign, contributeToCampaign, getCampaignStatistics } from '../../utils/marketplace';
import swal from 'sweetalert'; // SweetAlert for confirmation dialogs
import { toast } from 'react-toastify'; // React Toastify for notifications

// CampaignCard component definition
export default function CampaignCard({ campaign }) {
  // State variables for managing modals and form inputs
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [showStatisticsModal, setShowStatisticsModal] = useState(false);
  const [campaignStatistics, setCampaignStatistics] = useState(null);
  const [campaignId, setCampaignId] = useState(campaign.id);
  const [title, setTitle] = useState(campaign.title);
  const [description, setDescription] = useState(campaign.description);
  const [targetAmount, setTargetAmount] = useState(campaign.targetAmount);
  const [contributionAmount, setContributionAmount] = useState('');
  const [endDate, setEndDate] = useState(campaign.endDate);
  const [message, setMessage] = useState('');

  // Function to handle updating a campaign
  const handleUpdateCampaign = async () => {
    try {
      const response = await updateCampaign(campaignId, title, description, BigInt(targetAmount), BigInt(endDate));
      if (response.Ok) {
        toast.success('Campaign Updated!', {
          position: toast.POSITION.TOP_RIGHT,
        });
        setShowUpdateModal(false); // Close the modal after successful update
      } else {
        // Handle different error cases
        if(response.Err.InvalidPayload){
          toast.error(`Update failed!, ${response.Err.InvalidPayload} `, {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else if(response.Err.NotFound){
          toast.error(`Update failed!, ${response.Err.NotFound} `, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    } catch (error) {
      toast.error('An error occurs', {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  // Function to handle closing a campaign
  const handleCloseCampaign = async () => {
    // Display a confirmation dialog using SweetAlert
    swal({
      title: "Are you sure?",
      text: "Once closed, you will not be able to reopen this campaign!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (confirmClose) => {
      if (confirmClose) {
        try {
          const response = await closeCampaign(campaignId);
          if (response.Ok) {
            toast.success('Campaign closed!', {
              position: toast.POSITION.TOP_RIGHT,
            });
          } else {
            // Handle different error cases
            if(response.Err.InvalidPayload){
              toast.error(`failed to close campaign!, ${response.Err.InvalidPayload} `, {
                position: toast.POSITION.TOP_RIGHT,
              });
            } else if(response.Err.NotFound){
              toast.error(`failed to close campaign!!, ${response.Err.NotFound} `, {
                position: toast.POSITION.TOP_RIGHT,
              });
            }
          }
        } catch (error) {
          console.log(error);
          toast.error('An error occurs', {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    });
  };

  // Function to handle contributing to a campaign
  const handleContributeToCampaign = async () => {
    try {
      const response = await contributeToCampaign(campaignId, BigInt(contributionAmount));
      if (response.Ok) {
        toast.success(`Contributed ${contributionAmount} ICP successfully!'`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setShowContributeModal(false);
      } else {
        // Handle different error cases
        if(response.Err.InvalidPayload){
          toast.error(`Contribution failed!, ${response.Err.InvalidPayload} `, {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else if(response.Err.NotFound){
          toast.error(`Contribution failed!, ${response.Err.NotFound} `, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    } catch (error) {
      toast.error('An error occurs', {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  // Function to handle showing campaign statistics
  const handleShowStatistics = async () => {
    try {
      const response = await getCampaignStatistics(campaignId);
      setCampaignStatistics(response);
      setShowStatisticsModal(true);
      // Handle different error cases
      if(response.Err.InvalidPayload){
        toast.error(`${response.Err.InvalidPayload} `, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else if(response.Err.NotFound){
        toast.error(`${response.Err.NotFound} `, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Return JSX for rendering the campaign card
  return (
    <div className="border border-primary rounded-md p-4 mb-4">
      <h2 className="text-xl font-semibold mb-2">{campaign.title}</h2>
      <p className="mb-2">{campaign.description}</p>
      <p className="mb-2">Target Amount:  <span className="badge bg-warning text-dark">{Number(campaign.targetAmount)}</span></p>
      <p className="mb-2">Current Amount:  <span className="badge bg-success">{Number(campaign.currentAmount)}</span></p>
      <button onClick={() => setShowUpdateModal(true)} className="btn btn-primary m-2">Update Campaign</button>
      <button onClick={handleCloseCampaign} className="btn btn-danger m-2">Close Campaign</button>
      <button onClick={() => setShowContributeModal(true)} className="btn btn-success m-2">Contribute</button>
      <button onClick={handleShowStatistics} className="btn btn-info m-2">Show Statistics</button>

      // Update Campaign Modal
{showUpdateModal && (
  <div className="modal show" style={{ display: 'block' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Update Campaign</h5>
          <button type="button" className="btn-close" onClick={() => setShowUpdateModal(false)}></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="campaignId">Campaign ID:</label>
            <input type="text" className="form-control" id="campaignId" value={campaignId} onChange={(e) => setCampaignId(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input type="text" className="form-control" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <input type="text" className="form-control" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="targetAmount">Target Amount:</label>
            <input type="text" className="form-control" id="targetAmount" value={Number(targetAmount)} onChange={(e) => setTargetAmount(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">End Date:</label>
            <input type="text" className="form-control" id="endDate" value={new Date(Number(endDate)).toLocaleString()} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <button onClick={handleUpdateCampaign} className="btn btn-primary m-2">Update</button>
          <button onClick={() => setShowUpdateModal(false)} className="btn btn-secondary m-2">Cancel</button>
        </div>
      </div>
    </div>
  </div>
)}

// Contribute Modal
{showContributeModal && (
  <div className="modal show" style={{ display: 'block' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Contribute to Campaign</h5>
          <button type="button" className="btn-close" onClick={() => setShowContributeModal(false)}></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="campaignId">Campaign ID:</label>
            <input type="text" readOnly className="form-control" id="campaignId" value={campaignId} onChange={(e) => setCampaignId(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="targetAmount">Contribution Amount:</label>
            <input type="text" className="form-control" id="Amount" onChange={(e) => setContributionAmount(e.target.value)} />
          </div>
          <button onClick={handleContributeToCampaign} className="btn btn-primary m-2">Contribute</button>
          <button onClick={() => setShowContributeModal(false)} className="btn btn-secondary m-2">Cancel</button>
        </div>
      </div>
    </div>
  </div>
)}

// Statistics Modal
{showStatisticsModal && (
  <div className="modal show" style={{ display: 'block' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Campaign Statistics</h5>
          <button type="button" className="btn-close" onClick={() => setShowStatisticsModal(false)}></button>
        </div>
        <div className="modal-body">
          {campaignStatistics ? (
            <div>
              <p>Total Amount Raised:  <span className="badge bg-success text-dark">{Number(campaignStatistics.totalAmountRaised)}</span></p>
              <p>Number of Contributors:  <span className="badge bg-info text-dark">{Number(campaignStatistics.numberOfContributors)}</span></p>
              <p>Average Contribution:  <span className="badge bg-primary">{Number(campaignStatistics.averageContribution)}</span> </p>
            </div>
          ) : (
            <p>Loading statistics...</p>
          )}
          <button onClick={() => setShowStatisticsModal(false)} className="btn btn-secondary m-2">Close</button>
        </div>
      </div>
    </div>
  </div>
)}

      <div className="text-danger">{message}</div>
    </div>
  );
}
