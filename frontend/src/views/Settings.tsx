import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Settings()  {
  const [showNameForm, setShowNameForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [passwords, setPasswords] = useState({ current: '', new: '' });
const [logoutErr,setLogoutErr]=useState(false)
  const nav = useNavigate();

  const handleLogout = async () => {
    try {
            // I belive that a logout route should be a get one
      await axios.get('http://localhost4242/api/v1/users/logout', { withCredentials: true });
      nav('/login');
    } catch (err) {
      console.error('Logout failed:', err);
            setLogoutErr(true)
    }
  };

  const handleNameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(
        'http://localhost:4242/api/v1/users/settings/username',
        { username: newName },
        { withCredentials: true }
      );
      setNewName('');
      setShowNameForm(false);
    } catch (err) {
      console.error('Failed to update name:', err);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(
        'http://localhost:4242/api/v1/users/settings/password',
        { currentPassword: passwords.current, newPassword: passwords.new },
        { withCredentials: true }
      );
      setPasswords({ current: '', new: '' });
      setShowPasswordForm(false);
    } catch (err) {
      console.error('Failed to change password:', err);
    }
  };

  return (
    <div className="p-6 bg-green-50 min-h-screen text-green-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
                {logoutErr && <div className='text-red-900'>logout error</div>}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="space-y-4">
        {/* Change Name */}
        <div>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => setShowNameForm(true)}
          >
            Change Name
          </button>
          {showNameForm && (
            <form
              onSubmit={handleNameChange}
              className="mt-3 bg-white shadow p-4 rounded space-y-3"
            >
              <input
                type="text"
                placeholder="New Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                className="w-full border p-2 rounded"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="bg-gray-300 px-3 py-1 rounded"
                  onClick={() => setShowNameForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Change Password */}
        <div>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => setShowPasswordForm(true)}
          >
            Change Password
          </button>
          {showPasswordForm && (
            <form
              onSubmit={handlePasswordChange}
              className="mt-3 bg-white shadow p-4 rounded space-y-3"
            >
              <input
                type="password"
                placeholder="Current Password"
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({ ...passwords, current: e.target.value })
                }
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwords.new}
                onChange={(e) =>
                  setPasswords({ ...passwords, new: e.target.value })
                }
                required
                className="w-full border p-2 rounded"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="bg-gray-300 px-3 py-1 rounded"
                  onClick={() => setShowPasswordForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
