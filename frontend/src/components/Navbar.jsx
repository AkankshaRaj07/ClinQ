import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'History', path: '/history' },
    { name: 'Analytics', path: '/analytics', disabled: true }
  ];

  return (
    <header className="flex justify-between items-center w-full h-16 sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant shadow-sm mb-lg">
      <div className="flex items-center gap-8">
        <h1 className="text-2xl font-extrabold text-primary tracking-tight">ClinQ</h1>
        
        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => {
            const isActive = location.pathname === link.path;
            if (link.disabled) {
              return (
                <span key={link.name} className="px-4 py-2 text-sm font-bold text-outline-variant cursor-not-allowed">
                  {link.name}
                </span>
              );
            }
            return (
              <Link 
                key={link.name} 
                to={link.path}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                  isActive 
                    ? 'bg-primary-container text-on-primary-container' 
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/patient" className="hidden sm:block text-on-surface-variant hover:text-primary transition-colors text-label-sm uppercase tracking-wider font-bold mr-2">
          Patient View
        </Link>
        <Link to="/patient" className="sm:hidden text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-low">
          <span className="material-symbols-outlined">tv</span>
        </Link>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="p-2 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-full flex items-center justify-center"
            title="Toggle Theme"
          >
            <span className="material-symbols-outlined">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-full">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
