import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const CompletedComplaintCard = ({ complaint }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
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
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            complaint.status === 'Completed' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {complaint.status === 'Completed' ? 'Resolved' : 'Rejected'}
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium">
            {complaint.category}
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium">
            {new Date(complaint.status === 'Completed' ? complaint.completedAt : complaint.updatedAt).toLocaleDateString()}
          </span>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
          {complaint.status === 'Completed' ? (
            <>
              {complaint.assignedTo && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Resolved by:</span> {complaint.assignedTo.name}
                </p>
              )}
              {complaint.completedAt && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Completed on:</span> {new Date(complaint.completedAt).toLocaleDateString()}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-red-600/90 font-medium">
              Your complaint has been rejected due to violation of policy.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const CompletedComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/complaints/resolved', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setComplaints(response.data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredComplaints = complaints.filter(complaint => {
    const searchLower = searchTerm.toLowerCase();
    
    // Check all searchable fields
    const matchesSearch = 
      complaint.title.toLowerCase().includes(searchLower) || 
      complaint.description.toLowerCase().includes(searchLower) ||
      (complaint.assignedTo?.name && complaint.assignedTo.name.toLowerCase().includes(searchLower)) ||
      (complaint.assignedTo?.phone && complaint.assignedTo.phone.toString().includes(searchLower));
    const matchesCategory =
      categoryFilter === 'all' || complaint.category === categoryFilter;
    const complaintDate = new Date(complaint.createdAt);
    const now = new Date();
    let matchesDate = true;

    switch (dateFilter) {
      case 'today':
        matchesDate = complaintDate.toDateString() === now.toDateString();
        break;
      case 'yesterday':
        {
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          matchesDate = complaintDate.toDateString() === yesterday.toDateString();
        }
        break;
      case 'week':
        {
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          matchesDate = complaintDate >= weekAgo;
        }
        break;
      case 'month':
        {
          const monthAgo = new Date(now);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          matchesDate = complaintDate >= monthAgo;
        }
        break;
      case 'sixmonths':
        {
          const sixMonthsAgo = new Date(now);
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          matchesDate = complaintDate >= sixMonthsAgo;
        }
        break;
      case 'year':
        {
          const yearAgo = new Date(now);
          yearAgo.setFullYear(yearAgo.getFullYear() - 1);
          matchesDate = complaintDate >= yearAgo;
        }
        break;
      default:
        matchesDate = true;
    }

    return matchesSearch && matchesCategory && matchesDate;
  });

  const categories = ['all', ...new Set(complaints.map(c => c.category))];

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Resolved Complaints
            </h1>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
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

        {filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <span className="text-5xl mb-4">✅</span>
            <h2 className="text-xl font-semibold mb-2">
              No resolved complaints yet
            </h2>
            <button
              onClick={() => navigate('/file-complaint')}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition mt-4"
            >
              File New Complaint
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredComplaints.map((complaint) => (
              <CompletedComplaintCard
                key={complaint._id}
                complaint={complaint}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedComplaints;
