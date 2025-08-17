import React from 'react';
import ActionCard from '../student/ActionCard';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const userName = localStorage.getItem('userName') || 'Admin';
  const navigate = useNavigate();

  const actionCards = [
    {
      title: "Pending Complaints",
      icon: "⏳",
      description: "Review and assign new complaints",
      action: "/admin/pending-complaints",
      color: "bg-orange-100 hover:bg-orange-200",
      textColor: "text-orange-800",
      size: "h-full"
    },
    {
      title: "Assigned Complaints",
      icon: "📋",
      description: "View currently assigned tasks",
      action: "/admin/assigned-complaints",
      color: "bg-blue-100 hover:bg-blue-200",
      textColor: "text-blue-800",
      size: "h-full"
    },
    {
      title: "Awaiting Reviews",
      icon: "🔍",
      description: "Verify completed work by staff",
      action: "/admin/awaiting-reviews",
      color: "bg-yellow-100 hover:bg-yellow-200",
      textColor: "text-yellow-800",
      size: "h-full"
    },
    {
      title: "Completed Complaints",
      icon: "✅",
      description: "View resolved complaints history",
      action: "/admin/completed-complaints",
      color: "bg-green-100 hover:bg-green-200",
      textColor: "text-green-800",
      size: "h-full"
    },
    {
      title: "Rejected Complaints",
      icon: "🚫",
      description: "View all rejected complaints",
      action: "/admin/rejected-complaints",
      color: "bg-red-100 hover:bg-red-200",
      textColor: "text-red-800",
      size: "h-full"
    },
    {
      title: "View Staff",
      icon: "👥",
      description: "Browse all staff members",
      action: "/admin/view-staff",
      color: "bg-purple-100 hover:bg-purple-200",
      textColor: "text-purple-800",
      size: "h-full"
    },
    {
      title: "Add Staff",
      icon: "➕",
      description: "Register new staff members",
      action: "/admin/add-staff",
      color: "bg-indigo-100 hover:bg-indigo-200",
      textColor: "text-indigo-800",
      size: "h-full"
    },
    {
      title: "Profile Settings",
      icon: "⚙️",
      description: "Manage your admin account",
      action: "/profile",
      color: "bg-gray-100 hover:bg-gray-200",
      textColor: "text-gray-800",
      size: "h-full"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-12 px-4">
      {/* Welcome Header */}
      <div className="text-center mb-12 w-full max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-xl text-gray-600 mt-3">
          Welcome, {userName}
        </p>
      </div>

      {/* 3x3 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mb-16">
        {actionCards.map((card, index) => (
          <ActionCard 
            key={index} 
            {...card}
            onClick={() => navigate(card.action)}
          />
        ))}
        {/* Empty card to maintain grid structure */}
        <div className="hidden lg:block"></div>
      </div>
    </div>
  );
};

export default AdminDashboard;