import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PatientScreen from './pages/PatientScreen';
import { Stethoscope } from 'lucide-react';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patient" element={<PatientScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
