import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { toast } from 'react-toastify';

const ProfileSettings = () => {
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await axios.get('/auth/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          timeout: 5000
        });

        if (isMounted) {
          setProfile({
            name: res.data.name || '',
            email: res.data.email || '',
            rollNo: res.data.rollNo || ''
          });
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
          toast.error(err.response?.data?.error || 'Failed to load profile');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const profileResponse = await axios.put('/auth/profile', profile, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (password.new && password.new.trim() !== '') {
        if (password.new !== password.confirm) {
          throw new Error("Passwords don't match");
        }
        if (!password.current) {
          throw new Error("Current password is required to change password");
        }

        await axios.put('/auth/password', {
          currentPassword: password.current,
          newPassword: password.new
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }

      toast.success('Changes saved successfully!');
      localStorage.setItem('userName', profile.name);
      window.dispatchEvent(new Event('storageUpdate'));

      setPassword({ current: '', new: '', confirm: '' });
    } catch (err) {
      console.error('Update error:', err);
      toast.error(err.response?.data?.error || err.message || 'Update failed');
    }
  };

  if (isLoading) return <div className="text-center py-8 text-gray-500">Loading profile...</div>;

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Profile Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Info */}
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>
        </div>

        {/* Password Change */}
        <div className="pt-5 border-t border-gray-200">
          <h2 className="font-semibold text-lg text-gray-800 mb-4">Change Password</h2>
          <div className="space-y-4">
            <input
              type="password"
              value={password.current}
              onChange={(e) => setPassword({ ...password, current: e.target.value })}
              placeholder="Current Password"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <input
              type="password"
              value={password.new}
              onChange={(e) => setPassword({ ...password, new: e.target.value })}
              placeholder="New Password"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <input
              type="password"
              value={password.confirm}
              onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
              placeholder="Confirm New Password"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700 hover:shadow-md transition-all duration-200 font-medium cursor-pointer"
        >
          Save All Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
