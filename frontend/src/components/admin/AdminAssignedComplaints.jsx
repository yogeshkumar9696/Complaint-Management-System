import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-toastify';

const AdminAssignedComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [staffMembers, setStaffMembers] = useState({});
  const [selectedDept, setSelectedDept] = useState({});
  const [selectedStaff, setSelectedStaff] = useState({});
  const [activeAssignment, setActiveAssignment] = useState(null);

  // Fetch assigned complaints and departments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [complaintsRes, deptsRes] = await Promise.all([
          axios.get('/admin/assigned-complaints', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get('/staff/departments', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);
        
        setComplaints(complaintsRes.data);
        setDepartments(deptsRes.data);
        setLoading(false);
      } catch (err) {
        toast.error('Failed to load data');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // Handle staff reassignment
  const handleReassign = async (complaintId) => {
    if (!selectedStaff[complaintId]) {
      toast.error('Please select a staff member');
      return;
    }

    try {
      const response = await axios.patch(`/admin/assign/${complaintId}`, 
        { staffId: selectedStaff[complaintId] },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      if (response.data.success) {
        toast.success(response.data.message);
        
        // Update the complaint in state
        setComplaints(prev => prev.map(c => 
          c._id === complaintId ? response.data.complaint : c
        ));
        
        // Cleanup selections for this complaint
        setSelectedDept(prev => ({ ...prev, [complaintId]: '' }));
        setSelectedStaff(prev => ({ ...prev, [complaintId]: '' }));
        setStaffMembers(prev => ({ ...prev, [complaintId]: [] }));
        setActiveAssignment(null);
      } else {
        toast.error(response.data.error || 'Reassignment failed');
      }
    } catch (err) {
      console.error('Reassignment error:', err);
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error('Reassignment failed. Please try again.');
      }
    }
  };

  // Filter complaints by search term, date and category
  const filteredComplaints = complaints.filter(complaint => {
    const searchLower = searchTerm.toLowerCase();
    
    // Check all searchable fields
    const matchesSearch = 
      complaint.title.toLowerCase().includes(searchLower) || 
      complaint.description.toLowerCase().includes(searchLower) ||
      (complaint.createdBy?.name && complaint.createdBy.name.toLowerCase().includes(searchLower)) ||
      (complaint.studentContact && complaint.studentContact.toString().includes(searchLower)) ||
      (complaint.assignedTo?.name && complaint.assignedTo.name.toLowerCase().includes(searchLower)) ||
      (complaint.assignedTo?.phone && complaint.assignedTo.phone.toString().includes(searchLower));

    const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter;
    const complaintDate = new Date(complaint.updatedAt);
    const now = new Date();
    let matchesDate = true;
    
    switch(dateFilter) {
      case 'today':
        matchesDate = complaintDate.toDateString() === now.toDateString();
        break;
      case 'yesterday':
        { const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        matchesDate = complaintDate.toDateString() === yesterday.toDateString();
        break; }
      case 'week':
        { const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        matchesDate = complaintDate >= weekAgo;
        break; }
      case 'month':
        { const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        matchesDate = complaintDate >= monthAgo;
        break; }
      case 'sixmonths':
        { const sixMonthsAgo = new Date(now);
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        matchesDate = complaintDate >= sixMonthsAgo;
        break; }
      case 'year':
        { const yearAgo = new Date(now);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        matchesDate = complaintDate >= yearAgo;
        break; }
      default:
        matchesDate = true;
    }
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  const categories = ['all', ...new Set(complaints.map(c => c.category))];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Assigned Complaints (Admin)</h1>
            <p className="text-gray-600">
              {filteredComplaints.length} {filteredComplaints.length === 1 ? 'complaint' : 'complaints'} currently assigned
            </p>
          </div>
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by title, student, staff, or department..."
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
              <option value="month">Last Month</option>
              <option value="sixmonths">Last 6 Months</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {!loading && filteredComplaints.length === 0 && (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <span className="text-5xl mb-4">📭</span>
            <h2 className="text-xl font-semibold mb-2">
              {searchTerm || categoryFilter !== 'all' || dateFilter !== 'all' 
                ? 'No matching complaints' 
                : 'No assigned complaints'}
            </h2>
            <p className="text-gray-500">
              {searchTerm || categoryFilter !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'All complaints have been resolved or pending assignment.'}
            </p>
          </div>
        )}

        {/* Complaints Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredComplaints.map((complaint) => (
            <div key={complaint._id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {complaint.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {complaint.description}
                    </p>
                  </div>
                  <span className="text-3xl">
                    {complaint.category === 'Electrical' ? '⚡' : 
                     complaint.category === 'Plumbing' ? '🚿' :
                     complaint.category === 'Carpentry' ? '🛠️' :
                     complaint.category === 'IT' ? '💻' : '📌'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 mt-2">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Assigned
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium">
                    {complaint.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Student Contact Info */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Student:</span> {complaint.createdBy?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Contact:</span> {complaint.studentContact || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Assigned Staff:</span> {complaint.assignedTo?.name || 'N/A'} ({complaint.assignedTo?.phone || 'N/A'})
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Staff Department:</span> {complaint.assignedTo?.department || 'N/A'}
                  </p>
                </div>

                {/* Attached Image */}
                {complaint.attachments.url && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Attached Image:</p>
                    <img 
                      src={complaint.attachments.url} 
                      alt="Complaint attachment" 
                      className="h-32 w-32 object-cover rounded-lg border cursor-pointer"
                      onClick={() => setSelectedImage(complaint.attachments.url)}
                    />
                  </div>
                )}

                {/* Reassignment Section */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <select
                        value={selectedDept[complaint._id] || ''}
                        onChange={(e) => {
                          const dept = e.target.value;
                          setSelectedDept(prev => ({ ...prev, [complaint._id]: dept }));
                          setSelectedStaff(prev => ({ ...prev, [complaint._id]: '' }));
                          setActiveAssignment(complaint._id);

                          if (dept) {
                            axios.get(`/staff/department/${dept}`, {
                              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                            })
                            .then(res => {
                              setStaffMembers(prev => ({ ...prev, [complaint._id]: res.data }));
                            })
                            .catch(err => {
                              console.error(err);
                              toast.error('Failed to load staff');
                            });
                          } else {
                            setStaffMembers(prev => ({ ...prev, [complaint._id]: [] }));
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Staff Member</label>
                      <select
                        value={selectedStaff[complaint._id] || ''}
                        onChange={(e) => setSelectedStaff(prev => ({ ...prev, [complaint._id]: e.target.value }))}
                        disabled={!selectedDept[complaint._id]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50"
                      >
                        <option value="">Select Staff</option>
                        {(staffMembers[complaint._id] || []).filter(staff => staff.isActive).map(staff => (
                          <option key={staff._id} value={staff._id}>
                            {staff.name} ({staff.phone})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        onClick={() => handleReassign(complaint._id)}
                        disabled={!selectedStaff[complaint._id]}
                        className={`px-4 py-2 rounded-md text-white ${
                          selectedStaff[complaint._id]
                            ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Reassign
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Image Fullscreen Modal */}
        {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl max-h-full">
            <img 
                src={selectedImage} 
                alt="Enlarged view" 
                className="max-w-full max-h-screen"
            />
            <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 cursor-pointer"
            >
                ✕
            </button>
            </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default AdminAssignedComplaints;