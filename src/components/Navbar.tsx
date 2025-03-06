import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Menu, X, LogIn, Crown } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
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
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-white shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/">
                <Heart className={`h-8 w-8 text-blue-600 transition-all duration-300 ${
                  scrolled ? 'scale-90' : 'scale-100'
                }`} />
              </Link>
              <Link to="/" className="ml-2 text-xl font-bold text-gray-800">HealthTrust</Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <button 
                onClick={() => scrollToSection('home')} 
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
                onClick={() => scrollToSection('scan-upload')} 
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent transition-colors duration-200"
              >
                Upload Scan
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
          
            <Link 
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-blue-600 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign in
            </Link>
            <Link 
              to="/premium"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 transition-colors duration-200"
            >
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to Premium
            </Link>
            <Link 
              to="/book-appointment"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Book Appointment
            </Link>
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

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <button 
              onClick={() => scrollToSection('home')}
              className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-blue-500 text-base font-medium text-blue-700 bg-blue-50"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            >
              Find a doctor
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('scan-upload')}
              className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            >
              Upload Scan
            </button>
            <button 
              onClick={() => scrollToSection('wellness')}
              className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            >
              Contact
            </button>
           
            <Link 
              to="/login"
              className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            >
              Sign in
            </Link>
            <div className="mt-4 pl-3 pr-4">
            <Link 
              to="/premium"
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium  text-amber-700 bg-amber-100 hover:bg-amber-200 transition-colors duration-200 mb-4"
            >
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to Premium
            </Link>
              <Link 
                to="/book-appointment"
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;