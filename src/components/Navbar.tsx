import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Menu, X, LogIn, Crown, User } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loggedin, setLoggedin] = useState(false);
  const [isPremium, setIsPremium] = useState(false); // New state for premium status
  const [signtext, setSigntext] = useState('Sign in');

  useEffect(() => {
    if (sessionStorage.getItem('refresh_token') || localStorage.getItem('refresh_token')) {
      setLoggedin(true);
      setSigntext(loggedin ? 'Log out' : 'Sign in');
    }

    const storedUser = sessionStorage.getItem('userData');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setIsPremium(parsedUser.premium_status || false); // Check if the user is premium
    }

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loggedin]);

  const handleAvatarClick = () => {
    const storedUser = sessionStorage.getItem('userData');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/login');
    }
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleSignButton = () => {
    const hasToken = sessionStorage.getItem('refresh_token') || localStorage.getItem('refresh_token');

    if (hasToken) {
      sessionStorage.clear();
      localStorage.clear();
      navigate('/');
      window.location.reload();
    } else {
      navigate('/login');
    }
  };

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white shadow-sm'
      } mb-6`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/">
                <Heart
                  className={`h-8 w-8 text-blue-600 transition-all duration-300 ${
                    scrolled ? 'scale-90' : 'scale-100'
                  }`}
                />
              </Link>
              <Link to="/" className="ml-2 text-xl font-bold text-gray-800">
                HealthTrust
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-blue-500 transition-colors duration-200"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent transition-colors duration-200"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('wellness')}
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent transition-colors duration-200"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent transition-colors duration-200"
              >
                Contact
              </button>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => handleSignButton()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-blue-600 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <LogIn className="mr-2 h-4 w-4" />
              {signtext}
            </button>
            {!isPremium && ( // Conditionally render the Upgrade to Premium button
              <Link
                to="/premium"
                onClick={(e) => {
                  const storedUser = sessionStorage.getItem('userData');
                  if (!storedUser) {
                    e.preventDefault();
                    navigate('/login');
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 transition-colors duration-200"
              >
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Premium
              </Link>
            )}
            <Link
              to="/book-appointment"
              onClick={(e) => {
                const storedUser = sessionStorage.getItem('userData');
                if (!storedUser) {
                  e.preventDefault();
                  navigate('/login');
                }
              }}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Book Appointment
            </Link>
            <div className="relative">
              <button
                onClick={handleAvatarClick}
                className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors duration-200 focus:outline-none"
              >
                <User className="h-6 w-6 text-blue-600" />
              </button>
            </div>
          </div>
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu logic remains unchanged */}
    </nav>
  );
};

export default Navbar;