import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, Menu, X, LogIn, Crown, User, Bell, Shield } from 'lucide-react';
import api from '../utils/api/api';

interface Notification {
  id: number;
  notification_type: string;
  message: string;
  created_at: string;
  is_read: boolean;
  user: number;
}

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loggedin, setLoggedin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [signtext, setSigntext] = useState('Sign in');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('refresh_token') || localStorage.getItem('refresh_token')) {
      setLoggedin(true);
      setSigntext('Log out');
    }

    const storedUser = sessionStorage.getItem('userData');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setIsPremium(parsedUser.premium_status || false);
      setIsAdmin(parsedUser.role === 'admin');
    }

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    const fetchNotifications = async () => {
      try {
        const response = await api.get<{ notifications: Notification[] }>('users/notifications/');
        const notifications = response.data.notifications || [];
        setNotifications(notifications);
        const unread = notifications.filter((notification) => !notification.is_read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (loggedin) {
      fetchNotifications();
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loggedin]);

  const toggleNotificationMenu = () => {
    setIsNotificationOpen(!isNotificationOpen);
    navigate('/NotificationPage');
  };

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
            {location.pathname === '/' && ( // Render only on the HomePage
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
            )}
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => handleSignButton()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-blue-600 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <LogIn className="mr-2 h-4 w-4" />
              {signtext}
            </button>
            {!isAdmin && !isPremium && ( // Hide for admin users
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
            {!isAdmin && ( // Hide for admin users
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
            )}
            {loggedin && (
              <div className="relative">
                <button
                  onClick={toggleNotificationMenu}
                  className="relative h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors duration-200 focus:outline-none"
                >
                  <Bell className="h-6 w-6 text-blue-600" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {isNotificationOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                    style={{ zIndex: 9999 }}
                  >
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                      <ul className="mt-2 space-y-2">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <li key={notification.id} className="text-sm text-gray-600">
                              {notification.message}
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-gray-500">No notifications</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="relative">
              <button
                onClick={handleAvatarClick}
                className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors duration-200 focus:outline-none"
              >
                {isAdmin ? (
                  <Shield className="h-6 w-6 text-blue-600" />
                ) : (
                  <User className="h-6 w-6 text-blue-600" />
                )}
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
    </nav>
  );
};

export default Navbar;