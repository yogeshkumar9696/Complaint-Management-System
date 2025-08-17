import React from 'react';
import ActionCard from '../student/ActionCard';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
  const userName = localStorage.getItem('userName') || 'Staff';
  const navigate = useNavigate();

  const actionCards = [
    {
      title: "Assigned Tasks",
      icon: "📋",
      description: "View tasks assigned to you",
      action: "/staff/assigned-tasks",
      color: "bg-blue-100 hover:bg-blue-200",
      textColor: "text-blue-800",
      size: "h-full"
    },
    {
      title: "Awaiting Review",
      icon: "🔍",
      description: "Tasks pending admin verification",
      action: "/staff/awaiting-review",
      color: "bg-yellow-100 hover:bg-yellow-200",
      textColor: "text-yellow-800",
      size: "h-full"
    },
    {
      title: "Completed Tasks",
      icon: "✅",
      description: "View your completed work",
      action: "/staff/completed-tasks",
      color: "bg-green-100 hover:bg-green-200",
      textColor: "text-green-800",
      size: "h-full"
    },
    {
      title: "Profile Settings",
      icon: "👤",
      description: "Manage your account",
      action: "/profile",
      color: "bg-purple-100 hover:bg-purple-200",
      textColor: "text-purple-800",
      size: "h-full"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-12 px-4">
      {/* Welcome Header */}
      <div className="text-center mb-12 w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome, {userName}!
        </h1>
        <p className="text-xl text-gray-600 mt-3">
          What would you like to work on today?
        </p>
      </div>

      {/* 2x2 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-16">
        {actionCards.map((card, index) => (
          <ActionCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default StaffDashboard;