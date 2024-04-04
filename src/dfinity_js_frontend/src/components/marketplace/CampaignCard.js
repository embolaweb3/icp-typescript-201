import React, { useState } from 'react';
import { updateCampaign, closeCampaign } from '../../utils/marketplace';
import swal from 'sweetalert';
import { toast } from 'react-toastify';

export default function CampaignCard({ campaign }) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [campaignId, setCampaignId] = useState(campaign.id);
  const [title, setTitle] = useState(campaign.title);
  const [description, setDescription] = useState(campaign.description);
  const [targetAmount, setTargetAmount] = useState(campaign.targetAmount);
  const [endDate, setEndDate] = useState(campaign.endDate);
  const [message, setMessage] = useState('');

  const handleUpdateCampaign = async () => {
    try {
      const response = await updateCampaign(campaignId, title, description, BigInt(targetAmount), BigInt(endDate));
      if(response.Ok){
        toast.success('Campaign Updated!',{
          position: toast.POSITION.TOP_RIGHT,
        });
       }
       else{
          toast.error(`Update failed!, ${response.Err.InvalidPayload} `,{
            position: toast.POSITION.TOP_RIGHT,
          });
       }
      setShowUpdateModal(false); // Close the modal after successful update
    } catch (error) {
      toast.error('An error occurs',{
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleCloseCampaign = async () => {
    // Display a confirmation dialog using SweetAlert
    swal({
      title: "Are you sure?",
      text: "Once closed, you will not be able to reopen this campaign!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then(async (confirmClose) => {
      if (confirmClose) {
        try {
          const response = await closeCampaign(BigInt(campaign.id));
          console.log(response)
          setMessage(response.Ok);
          swal('Success', response.Ok, 'success');
        } catch (error) {
          console.log(response)
          // setMessage(error.message);
          // swal('Error', error.message, 'error');
        }
      }
    });
  };

  return (
    <div className="border border-primary rounded-md p-4 mb-4">
      <h2 className="text-xl font-semibold mb-2">{campaign.title}</h2>
      <p className="mb-2">{campaign.description}</p>
      <p className="mb-2">Target Amount: {Number(campaign.targetAmount)}</p>
      <p className="mb-2">Current Amount: {Number(campaign.currentAmount)}</p>
      <button onClick={() => setShowUpdateModal(true)} className="btn btn-primary m-2">Update Campaign</button>
      <button onClick={handleCloseCampaign} className="btn btn-danger m-2">Close Campaign</button>

      {/* Update Campaign Modal */}
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

      <div className="text-danger">{message}</div>
    </div>
  );
}
