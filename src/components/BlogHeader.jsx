import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BlogHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <img
                className="h-14 w-auto transition-transform duration-300 group-hover:scale-105"
                src="/weshare-logo.png"
                alt="WeShare Logo"
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {[
              { path: '/vorteile', label: 'Vorteile' },
              { path: '/features', label: 'Features' },
              { path: '/unternehmen', label: 'Unternehmen' },
              { path: '/preise', label: 'Preise' },
              { path: '/faq', label: 'FAQ' },
              { path: '/blog', label: 'Blog' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="relative text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm font-medium group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Login Button */}
          <div className="flex items-center">
            <Link
              to="/anmelden"
              className="ml-8 inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:shadow-md hover:scale-105"
            >
              Anmelden
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BlogHeader; 