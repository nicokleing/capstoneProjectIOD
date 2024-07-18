// src/pages/ChangePassword.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        '/api/users/profile/password',
        { password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Password updated successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to update password');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Change Password</button>
    </form>
  );
};

export default ChangePassword;
