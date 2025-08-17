import React from 'react';
import ActionCard from './ActionCard';

const StudentDashboard = () => {
  const userName = localStorage.getItem('userName') || 'Student';

  const actionCards = [
    {
      title: "File New Complaint",
      icon: "📝",
      description: "Submit a new campus issue",
      action: "/file-complaint",
      color: "bg-indigo-100 hover:bg-indigo-200",
      textColor: "text-indigo-800",
      size: "h-full"
    },
    {
      title: "Pending Complaints",
      icon: "⏳",
      description: "View your unresolved issues",
      action: "/complaints/pending",
      color: "bg-amber-100 hover:bg-amber-200",
      textColor: "text-amber-800",
      size: "h-full"
    },
    {
      title: "Resolved Complaints",
      icon: "✅",
      description: "View completed resolutions",
      action: "/complaints/completed",
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
          What would you like to do today?
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

export default StudentDashboard;