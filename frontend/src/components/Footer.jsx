import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About CampusCare</h3>
            <p className="text-gray-300 leading-relaxed">
              Bridging communication between students and administration for a 
              better, more connected campus experience. Our mission is to ensure 
              every voice is heard and every concern addressed.
            </p>
          </div>

          {/* Column 2: Stay Connected */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
            <p className="text-gray-300 mb-4">
              Follow us on social media and never miss important updates.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-700 rounded-full hover:bg-blue-600 transition">
                <FaFacebookF />
              </a>
              <a href="#" className="p-2 bg-gray-700 rounded-full hover:bg-blue-400 transition">
                <FaTwitter />
              </a>
              <a href="#" className="p-2 bg-gray-700 rounded-full hover:bg-pink-500 transition">
                <FaInstagram />
              </a>
              <a href="#" className="p-2 bg-gray-700 rounded-full hover:bg-blue-700 transition">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="text-gray-300 not-italic space-y-1">
              <p>Email: support@campuscare.edu</p>
              <p>Phone: (123) 456-7890</p>
              <p>Admin Block, Room 205</p>
            </address>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} CampusCare — Empowering Students, 
            Connecting Campuses.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
