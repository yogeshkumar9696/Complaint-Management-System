import React from 'react';
import { useNavigate } from 'react-router-dom';

const ActionCard = ({ title, icon, description, action, color, textColor, size }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(action)}
      className={`${color} ${textColor} ${size} rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 cursor-pointer flex flex-col items-center justify-center text-center`}
    >
      <span className="text-5xl mb-5" role="img" aria-label={title}>
        {icon}
      </span>
      <h2 className={`text-2xl font-bold mb-3`}>
        {title}
      </h2>
      <p className="text-lg mb-4">
        {description}
      </p>
      <div className={`mt-2 px-5 py-1.5 rounded-full ${textColor.replace('800', '600')} bg-opacity-20 text-sm font-medium`}>
        Tap to access
      </div>
    </div>
  );
};

export default ActionCard;