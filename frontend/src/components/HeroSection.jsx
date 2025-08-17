import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center px-16 py-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Left side - Text content */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-5xl font-bold text-indigo-500 leading-tight">
            Online Complaint Portal
          </h1>
          <p className="text-xl text-gray-600">
            A streamlined platform for the entire campus community to report issues 
            and receive timely resolutions. Every voice counts.
          </p>
         <button 
          onClick={() => navigate('/select-role')}
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          File a Complaint
        </button>
        </div>

        {/* Right side - Image placeholder */}
        <div className="md:w-1/2 flex justify-center">
          <div className="w-full h-96 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
            <img 
              src="./public/home.png" 
              alt="CampusCare Portal" 
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;