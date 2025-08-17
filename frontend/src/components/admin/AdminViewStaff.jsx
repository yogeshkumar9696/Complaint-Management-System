import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-toastify';

const AdminViewStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departments, setDepartments] = useState([]);
  const [toggleId, setToggleId] = useState(null);

  // Fetch staff data
  const fetchStaff = async () => {
    try {
      const res = await axios.get('/staff', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStaffList(res.data.staff || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch departments for filter
  const fetchDepartments = async () => {
    try {
      const res = await axios.get('/staff/departments', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDepartments(['all', ...res.data]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchDepartments();
  }, []);

  // Toggle staff active status
  const toggleStaffStatus = async () => {
    try {
      const staff = staffList.find(s => s._id === toggleId);
      
      // Check if staff has active complaints and we're trying to deactivate
      if (!staff.isActive || (staff.isActive && staff.activeComplaintCount === 0)) {
        await axios.patch(`/staff/${toggleId}/status`, {
          isActive: !staff.isActive
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        setStaffList(prev => prev.map(s => 
          s._id === toggleId ? { ...s, isActive: !s.isActive } : s
        ));
        
        toast.success(`Staff ${staff.isActive ? 'deactivated' : 'activated'} successfully`, { 
          position: 'bottom-right' 
        });
      } else {
        toast.error('Cannot deactivate staff with active complaints', {
          position: 'bottom-right'
        });
      }
    } catch (err) {
      toast.error('Failed to update staff status', { position: 'bottom-right' });
      console.error(err);
    }
    setToggleId(null);
  };

  // Filtered staff list
  const filteredStaff = staffList.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept =
      departmentFilter === 'all' || s.department === departmentFilter;
      
    const matchesStatus =
      statusFilter === 'all' || 
      (statusFilter === 'active' && s.isActive) || 
      (statusFilter === 'inactive' && !s.isActive);

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Staff Management</h1>
            <p className="text-gray-600">
              {filteredStaff.length} {filteredStaff.length === 1 ? 'staff member' : 'staff members'} found
            </p>
          </div>
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search staff..."
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>
          
          {/*Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {/* Table */}
        {!loading && filteredStaff.length > 0 && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100 text-left font-semibold text-gray-700">
                  <th className="px-6 py-3">S.No</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Active Complaints</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((staff, index) => (
                  <tr key={staff._id} className="border-t border-gray-200">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{staff.name}</td>
                    <td className="px-6 py-4">{staff.email}</td>
                    <td className="px-6 py-4">{staff.phone}</td>
                    <td className="px-6 py-4">{staff.department}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        staff.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {staff.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {staff.activeComplaintCount}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setToggleId(staff._id)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition cursor-pointer ${
                          staff.isActive
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                      >
                        {staff.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredStaff.length === 0 && (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <span className="text-5xl mb-4">📋</span>
            <h2 className="text-xl font-semibold mb-2">No staff found</h2>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Toggle status confirmation modal */}
        {toggleId && (
          <>
            <div className="fixed inset-0 bg-black/30 z-40"></div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md mx-4 border border-gray-200">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                    <svg
                      className="h-6 w-6 text-yellow-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {staffList.find(s => s._id === toggleId)?.isActive ? 'Deactivate' : 'Activate'} Staff
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    {staffList.find(s => s._id === toggleId)?.isActive
                      ? 'Are you sure you want to deactivate this staff member?'
                      : 'Are you sure you want to activate this staff member?'}
                  </p>
                </div>
                <div className="mt-5 flex justify-center gap-3">
                  <button
                    onClick={() => setToggleId(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={toggleStaffStatus}
                    className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors cursor-pointer ${
                      staffList.find(s => s._id === toggleId)?.isActive
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminViewStaff;