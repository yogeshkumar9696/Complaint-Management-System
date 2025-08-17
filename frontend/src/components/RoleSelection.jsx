import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'student',
      icon: '🎓',
      title: 'Student',
      description: 'Report complaints and track resolutions',
      color: 'bg-indigo-100 hover:bg-indigo-200',
      textColor: 'text-indigo-800',
      buttonColor: 'bg-indigo-600 hover:bg-indigo-700'
    },
    {
      id: 'staff',
      icon: '🛠️',
      title: 'Staff',
      description: 'Resolve assigned complaints and update status',
      color: 'bg-amber-100 hover:bg-amber-200',
      textColor: 'text-amber-800',
      buttonColor: 'bg-amber-600 hover:bg-amber-700'
    },
    {
      id: 'admin',
      icon: '🔐',
      title: 'Administrator',
      description: 'Manage all complaints and assign to staff',
      color: 'bg-purple-100 hover:bg-purple-200',
      textColor: 'text-purple-800',
      buttonColor: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Welcome to <span className="text-indigo-600">CampusCare</span>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div 
              key={role.id}
              className={`${role.color} rounded-xl p-8 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col items-center`}
              onClick={() => navigate(`/auth?role=${role.id}`)}
            >
              <span className="text-6xl mb-4" role="img" aria-label={role.title}>
                {role.icon}
              </span>
              <h2 className={`text-2xl font-bold mb-2 ${role.textColor}`}>
                {role.title}
              </h2>
              <p className="text-gray-600 text-center mb-6">
                {role.description}
              </p>
              <button 
                className={`${role.buttonColor} text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer`}
              >
                Continue as {role.title}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 text-gray-500">
          <p>Select your role to continue</p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;