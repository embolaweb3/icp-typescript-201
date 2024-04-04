import React, { useState } from 'react';
import { registerUser } from '../../utils/marketplace';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RegisterUserForm() {
  const [userData, setUserData] = useState({ name: '', initialBalance: '' });

  const handleRegisterUser = async () => {
    try {
       const response = await registerUser(userData.name, BigInt(userData.initialBalance));
       if(response.Ok){
        toast.success('Registered!',{
          position: toast.POSITION.TOP_RIGHT,
        });
       }
       else{
          toast.error(`Registration failed!, ${response.Err.InvalidPayload} `,{
            position: toast.POSITION.TOP_RIGHT,
          });
       }
        
    } catch (error) {
      toast.error(error.Err,{
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  };

  return (
    <div className='row justify-content-center'>
      <div className='col-md-6 p-3 shadow'>
      <h2 className="text-xl font-semibold mb-2">Create / Update Account</h2>
        <input 
          type="text" 
          placeholder="Name" 
          className="form-control mb-2" 
          value={userData.name} 
          onChange={(e) => setUserData({ ...userData, name: e.target.value })} 
        />
        <input 
          type="number" 
          placeholder="Initial Balance" 
          className="form-control mb-2" 
          value={userData.initialBalance} 
          onChange={(e) => setUserData({ ...userData, initialBalance: parseInt(e.target.value) })} 
        />
        <button onClick={handleRegisterUser} className="btn btn-primary mr-2">Submit</button>
      </div>
      
    </div>
  );
}
