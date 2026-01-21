
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navigation: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const navItems = [
    { label: 'TOP', path: '/' },
    { label: 'TOPICS', path: '/topics' },
    { label: 'NEWS', path: '/news' },
    { label: 'CONTACT', path: '/contact' },
  ];

  if (isAdmin) {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md bg-black/40 border-b border-white/5">
            <Link to="/admin" className="text-xl font-bold tracking-tighter">Gakuto Ito <span className="text-blue-500 font-light">CMS</span></Link>
            <div className="flex space-x-8 text-xs font-medium tracking-widest uppercase">
                <Link to="/admin" className="hover:text-blue-400 transition-colors">Dashboard</Link>
                <Link to="/" className="hover:text-blue-400 transition-colors">View Site</Link>
            </div>
        </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-8 flex justify-between items-center pointer-events-none">
      <Link to="/" className="pointer-events-auto text-xl font-bold tracking-tighter group uppercase whitespace-nowrap">
        Gakuto Ito<span className="text-blue-500 group-hover:text-blue-400 transition-colors duration-500 italic lowercase ml-1 font-light tracking-normal">'s Portfolio.</span>
      </Link>
      
      <div className="hidden md:flex space-x-12 text-[10px] font-bold tracking-[0.3em] uppercase pointer-events-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`relative group overflow-hidden ${
              location.pathname === item.path ? 'text-blue-400' : 'text-slate-400'
            }`}
          >
            <span className="inline-block transition-transform duration-500 group-hover:-translate-y-full">
              {item.label}
            </span>
            <span className="absolute left-0 inline-block transition-transform duration-500 translate-y-full group-hover:translate-y-0 text-white">
              {item.label}
            </span>
          </Link>
        ))}
        <Link to="/admin/login" className="text-slate-600 hover:text-white transition-colors">Admin</Link>
      </div>
      
      {/* Mobile Trigger Placeholder */}
      <button className="md:hidden pointer-events-auto p-2">
        <div className="w-6 h-0.5 bg-white mb-1.5"></div>
        <div className="w-6 h-0.5 bg-white"></div>
      </button>
    </nav>
  );
};

export default Navigation;
