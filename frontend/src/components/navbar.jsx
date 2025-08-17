import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    const role = localStorage.getItem('role');
    
    if (token && !name) {
      // Token exists but user data is missing - force logout
      localStorage.clear();
      window.location.reload();
    } else {
      setIsLoggedIn(!!token);
      setUserName(name || '');
      setUserRole(role || '');
    }
  };

  checkAuth();
}, [location]); // Add location as dependency

    const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('userName');
  window.location.href = '/'; // Full reload clears state
};

    const handleLogoClick = (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            navigate('/');
        } else {
            // Redirect to appropriate dashboard based on role
            switch(userRole) {
                case 'admin':
                    navigate('/admin/Dashboard');
                    break;
                case 'staff':
                    navigate('/staff/Dashboard');
                    break;
                default:
                    navigate('/student/Dashboard');
            }
        }
    };

    const UserDropdown = () => (
        <div className="relative">
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 focus:outline-none cursor-pointer"
            >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-500 font-bold">
                    {userName.charAt(0).toUpperCase()}
                </div>
            </button>

            {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        Welcome, {userName}
                    </div>
                    <button
                        onClick={() => {
                            navigate('/profile');
                            setIsMenuOpen(false);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                        Profile Settings
                    </button>
                    <button
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );

    const MobileUserDropdown = () => (
        <div className="space-y-4">
            <div className="px-4 py-2 text-center text-gray-700 border-b">
                Welcome, {userName}
            </div>
            <button
                onClick={() => {
                    navigate('/profile');
                    setIsMenuOpen(false);
                }}
                className="block w-full px-4 py-2 text-center text-gray-700 hover:bg-gray-100"
            >
                Profile Settings
            </button>
            <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-center text-gray-700 hover:bg-gray-100"
            >
                Logout
            </button>
        </div>
    );

    return (
        <nav className="bg-indigo-500 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 py-4 z-50">
            
            <a href="/" onClick={handleLogoClick} className="flex items-center gap-2">
                <span className="text-white text-2xl md:text-3xl font-bold">CampusCare</span>
            </a>

            {/* Desktop Right */}
            <div className="hidden md:block">
                {isLoggedIn ? (
                    <UserDropdown />
                ) : (
                    <button 
                        onClick={() => navigate('/select-role')}
                        className="px-8 py-2.5 rounded-full bg-white text-black text-lg font-medium transition-all duration-500 hover:bg-indigo-100 cursor-pointer"
                    >
                        Login
                    </button>
                )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
                {isLoggedIn ? (
                    <div 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-500 font-bold cursor-pointer"
                    >
                        {userName.charAt(0).toUpperCase()}
                    </div>
                ) : (
                    <svg 
                        onClick={() => setIsMenuOpen(!isMenuOpen)} 
                        className="h-7 w-7 cursor-pointer text-white" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        viewBox="0 0 24 24"
                    >
                        <line x1="4" y1="6" x2="20" y2="6" />
                        <line x1="4" y1="12" x2="20" y2="12" />
                        <line x1="4" y1="18" x2="20" y2="18" />
                    </svg>
                )}
            </div>

            {/* Mobile Menu */}
            <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {isLoggedIn ? (
                    <MobileUserDropdown />
                ) : (
                    <button 
                        onClick={() => {
                            navigate('/select-role');
                            setIsMenuOpen(false);
                        }}
                        className="px-8 py-2.5 rounded-full bg-indigo-500 text-white text-lg font-medium transition-all duration-500 hover:bg-indigo-600 cursor-pointer"
                    >
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;