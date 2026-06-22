import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

import SplashScreen from './components/SplashScreen';
import { QueueProvider } from './context/QueueContext';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const PatientScreen = lazy(() => import('./pages/PatientScreen'));
const History = lazy(() => import('./pages/History'));
const LandingPage = lazy(() => import('./pages/LandingPage'));

const AnimatedRoute = ({ children }) => {
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col"
    >
      {children}
    </motion.div>
  );
};

function App() {
  return (
    <Router>
      <QueueProvider>
        <Suspense fallback={<SplashScreen />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<AnimatedRoute><Dashboard /></AnimatedRoute>} />
            <Route path="/history" element={<AnimatedRoute><History /></AnimatedRoute>} />
            <Route path="/patient" element={<AnimatedRoute><PatientScreen /></AnimatedRoute>} />
          </Routes>
        </Suspense>
      </QueueProvider>
    </Router>
  );
}

export default App;
