import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-toastify';

const AdminCompletedComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch completed complaints
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/admin/completed-complaints', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setComplaints(res.data);
        setLoading(false);
      } catch (err) {
        toast.error('Failed to load complaints');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // Filter complaints based on search, category, and completedAt date
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
    const complaintDate = new Date(complaint.completedAt);
    const now = new Date();
    let matchesDate = true;

    switch (dateFilter) {
      case 'today':
        matchesDate = complaintDate.toDateString() === now.toDateString();
        break;
      case 'yesterday': {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        matchesDate = complaintDate.toDateString() === yesterday.toDateString();
        break;
      }
      case 'week': {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        matchesDate = complaintDate >= weekAgo;
        break;
      }
      case 'month': {
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        matchesDate = complaintDate >= monthAgo;
        break;
      }
      case 'sixmonths': {
        const sixMonthsAgo = new Date(now);
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        matchesDate = complaintDate >= sixMonthsAgo;
        break;
      }
      case 'year': {
        const yearAgo = new Date(now);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        matchesDate = complaintDate >= yearAgo;
        break;
      }
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Completed Complaints (Admin)</h1>
            <p className="text-gray-600">
              {filteredComplaints.length}{' '}
              {filteredComplaints.length === 1 ? 'complaint' : 'complaints'} resolved
            </p>
          </div>
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search complaints..."
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range (Completed At)</label>
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
            <h2 className="text-xl font-semibold mb-2">No completed complaints</h2>
            <p className="text-gray-500">No complaints have been completed yet.</p>
          </div>
        )}

        {/* Complaints Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredComplaints.map((complaint) => (
            <div key={complaint._id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">{complaint.title}</h3>
                    <p className="text-gray-600 mb-3">{complaint.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-2">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Completed
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium">{complaint.category}</span>
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium">
                    {complaint.completedAt ? new Date(complaint.completedAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>

                {/* Student Contact */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Student:</span> {complaint.createdBy?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Student Contact:</span> {complaint.studentContact || 'N/A'}
                  </p>
                </div>

                {/* Resolved By */}
                {complaint.assignedTo && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Resolved By:</span> {complaint.assignedTo.name || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Department:</span> {complaint.assignedTo.department || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Staff Contact:</span> {complaint.assignedTo.phone || 'N/A'}
                    </p>
                  </div>
                )}

                {/* Attached image of complaint */}
                {complaint.attachments.url && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Complaint image:</p>
                    <img
                      src={complaint.attachments.url}
                      alt="Complaint attachment"
                      className="h-32 w-32 object-cover rounded-lg border cursor-pointer"
                      onClick={() => setSelectedImage(complaint.attachments.url)}
                    />
                  </div>
                )}

                {/* Attached Proof */}
                {complaint.resolutionProof && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Resolution Proof:</p>
                    <img
                      src={complaint.resolutionProof}
                      alt="Resolution proof"
                      className="h-32 w-32 object-cover rounded-lg border cursor-pointer"
                      onClick={() => setSelectedImage(complaint.resolutionProof)}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Image Fullscreen Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl max-h-full">
              <img src={selectedImage} alt="Enlarged view" className="max-w-full max-h-screen" />
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

export default AdminCompletedComplaints;
