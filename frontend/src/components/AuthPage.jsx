import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axios';


const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role') || 'student';
    setRole(roleParam);

    if (roleParam !== 'student') setIsLogin(true); 
  }, [location]);

  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    if (isLogin) {
      const response = await axios.post('/auth/login', {
        email: formData.email,
        password: formData.password,
        role
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', role);
      localStorage.setItem('userName', response.data.user.name);
      
      navigate(
        role === 'admin' ? '/admin/Dashboard' 
        : role === 'staff' ? '/staff/Dashboard' 
        : '/student/Dashboard'
      );
      } else {
        if (formData.password !== formData.confirmPassword) {
          setLoading(false);
          return alert("Passwords don't match!");
        }
        await axios.post('/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        alert('Registration successful! Please login.');
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Authentication failed');
    }
    finally {
    setLoading(false);
  }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {role === 'admin' ? 'Admin Login' 
           : role === 'staff' ? 'Staff Login' 
           : isLogin ? 'Student Login' : 'Student Registration'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field - Only for student registration */}
          {!isLogin && role === 'student' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Confirm Password (only for student registration) */}
          {!isLogin && role === 'student' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white 
    bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer
    ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading 
              ? (isLogin ? 'Logging in...' : 'Registering...') 
              : (isLogin ? 'Login' : 'Register')}
          </button>

          {/* Registration Toggle (only for students) */}
          {role === 'student' && (
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                {isLogin ? 'Need an account? Register here' : 'Already have an account? Login'}
              </button>
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/select-role')}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            ← Back to role selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;