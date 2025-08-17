import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from './HeroSection';

export default function AuthChecker() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (token) {
      navigate(`/${role}/dashboard`, { replace: true });
    }
  }, [navigate]);

  return <HeroSection />;
}