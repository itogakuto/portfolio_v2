
import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CMSProvider, useCMS } from './store/CMSContext';

// Components
import Navigation from './components/Navigation';
import BackgroundScene from './components/BackgroundScene';

// Pages
import Home from './pages/Home';
import Topics from './pages/Topics';
import TopicDetail from './pages/TopicDetail';
import News from './pages/News';
import Contact from './pages/Contact';
import Login from './pages/Admin/Login';
import Dashboard from './pages/Admin/Dashboard';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useCMS();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading Data...</div>;
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" />;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/topics" element={<Topics />} />
        <Route path="/topics/:slug" element={<TopicDetail />} />
        <Route path="/news" element={<News />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <CMSProvider>
      <Router>
        <div className="relative z-0 selection:bg-blue-500/30">
          <BackgroundScene />
          <Navigation />
          <main>
            <Suspense fallback={
                <div className="fixed inset-0 flex items-center justify-center bg-[#020617] z-[999]">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-0.5 bg-blue-500 animate-pulse mb-4"></div>
                        <span className="text-[10px] tracking-[0.5em] uppercase font-bold opacity-50">Synchronizing</span>
                    </div>
                </div>
            }>
              <AnimatedRoutes />
            </Suspense>
          </main>
          
          <footer className="py-12 px-6 md:px-24 border-t border-white/5 text-[9px] font-bold tracking-[0.2em] uppercase text-slate-600 flex justify-between items-center">
            <span>&copy;2026 Gakuto Ito</span>
            <div className="flex space-x-6">
                <a 
                  href="https://github.com/itogakuto" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-blue-400 transition-colors"
                >
                  GitHub
                </a>
            </div>
          </footer>
        </div>
      </Router>
    </CMSProvider>
  );
};

export default App;
