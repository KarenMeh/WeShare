import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const BlogHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const location = useLocation();

  // Check for tablet viewport
  useEffect(() => {
    const checkTablet = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth <= 1023);
    };
    
    checkTablet();
    window.addEventListener('resize', checkTablet);
    return () => window.removeEventListener('resize', checkTablet);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : '';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const nav = document.querySelector('.nav-right');
      const menuBtn = document.querySelector('.mobile-menu-btn');
      if (nav && !nav.contains(event.target) && !menuBtn?.contains(event.target)) {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = '';
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { path: '/vorteile', label: 'Vorteile' },
    { path: '/features', label: 'Features' },
    { path: '/unternehmen', label: 'Unternehmen' },
    { path: '/preise', label: 'Preise' },
    { path: '/faq', label: 'FAQ' },
    { path: '/blog', label: 'Blog' },
  ];

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-5 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-3.5 md:py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg">
              <img
                className="h-10 sm:h-11 md:h-12 lg:h-14 w-auto transition-transform duration-300 group-hover:scale-105"
                src="/weshare-logo.png"
                alt="WeShare Logo"
              />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className={`block w-5 sm:w-6 h-0.5 bg-gray-600 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-5 sm:w-6 h-0.5 bg-gray-600 my-1.5 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-5 sm:w-6 h-0.5 bg-gray-600 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>

          {/* Navigation */}
          <nav className={`nav-right fixed md:static top-0 right-0 h-screen md:h-auto w-[280px] sm:w-[320px] md:w-auto bg-white md:bg-transparent transform transition-transform duration-300 ease-in-out md:transform-none md:transition-none ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
          } shadow-lg md:shadow-none z-40`}>
            <div className={`flex flex-col md:flex-row items-start md:items-center h-full md:h-auto pt-20 md:pt-0 px-4 sm:px-6 md:px-0 ${
              isTablet ? 'md:gap-1.5' : 'md:gap-2.5 lg:gap-4 xl:gap-6'
            }`}>
              <ul className={`flex flex-col md:flex-row space-y-3 sm:space-y-4 md:space-y-0 ${
                isTablet ? 'md:space-x-1.5' : 'md:space-x-2.5 lg:space-x-4 xl:space-x-6'
              } w-full md:w-auto md:flex-wrap md:justify-end`}>
                {navItems.map((item) => (
                  <li key={item.path} className="w-full md:w-auto md:flex-shrink-0">
                    <Link
                      to={item.path}
                      className={`block text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm sm:text-[15px] md:text-base font-medium py-2 md:py-1.5 ${
                        isTablet ? 'px-1.5' : 'px-1 md:px-2'
                      } rounded-md md:rounded-none hover:bg-gray-50 md:hover:bg-transparent relative group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 md:focus:ring-offset-0 md:focus:ring-0 ${
                        location.pathname === item.path ? 'text-blue-600 md:after:absolute md:after:bottom-0 md:after:left-0 md:after:w-full md:after:h-0.5 md:after:bg-blue-600' : ''
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full md:block hidden"></span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Login Button */}
              <div className={`mt-4 sm:mt-6 md:mt-0 ${
                isTablet ? 'md:ml-1.5' : 'md:ml-2 lg:ml-3 xl:ml-4'
              } w-full md:w-auto flex-shrink-0`}>
                <Link
                  to="/anmelden"
                  className={`block w-full md:w-auto text-center ${
                    isTablet ? 'px-4' : 'px-4 sm:px-5 md:px-5 lg:px-6'
                  } py-2 sm:py-2.5 border border-transparent rounded-full shadow-sm text-sm sm:text-[15px] md:text-base font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all duration-300 hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Anmelden
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Tablet-specific styles */}
      <style jsx>{`
        @media (min-width: 768px) and (max-width: 1023px) {
          .nav-right {
            padding-right: 0.5rem;
            max-width: calc(100% - 120px);
          }
          
          .nav-right ul {
            flex-wrap: nowrap;
            justify-content: flex-end;
            gap: 0.375rem;
          }
          
          .nav-right li {
            flex-shrink: 0;
          }
          
          .nav-right a {
            white-space: nowrap;
            font-size: 0.9375rem;
            line-height: 1.25rem;
            padding: 0.375rem 0.5rem;
          }
          
          .nav-right .btn-login {
            margin-left: 0.75rem;
            padding: 0.375rem 1rem;
            font-size: 0.9375rem;
          }

          /* Adjust for smaller tablets */
          @media (max-width: 820px) {
            .nav-right {
              max-width: calc(100% - 100px);
            }
            
            .nav-right a {
              padding: 0.375rem 0.375rem;
              font-size: 0.875rem;
            }
            
            .nav-right .btn-login {
              padding: 0.375rem 0.875rem;
              font-size: 0.875rem;
            }
          }
        }
      `}</style>
    </header>
  );
};

export default BlogHeader; 