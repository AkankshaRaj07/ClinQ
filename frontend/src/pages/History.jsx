import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const History = () => {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  const [stats, setStats] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = async (date) => {
    try {
      setLoading(true);
      setError('');
      
      const [historyRes, statsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/history?date=${date}`),
        axios.get(`http://localhost:5000/api/history/stats?date=${date}`)
      ]);
      
      setPatients(historyRes.data.patients);
      setStats(statsRes.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(selectedDate);
  }, [selectedDate]);

  const filteredPatients = statusFilter === 'ALL' 
    ? patients 
    : patients.filter(p => p.status === statusFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'WAITING': return 'bg-surface-variant text-on-surface-variant border-outline-variant/30';
      case 'CALLED': return 'bg-tertiary-container text-on-tertiary-container border-tertiary-container/30';
      case 'COMPLETED': return 'bg-secondary-container text-on-secondary-container border-secondary-container/30';
      case 'SKIPPED': return 'bg-error-container text-on-error-container border-error-container/30';
      case 'RECALLED': return 'bg-primary-container text-on-primary-container border-primary-container/30';
      default: return 'bg-surface-variant text-on-surface-variant';
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="bg-background text-on-surface antialiased flex flex-col h-screen overflow-hidden w-full relative">
      <main className="flex-1 w-full px-margin-mobile lg:px-margin-desktop pb-lg flex flex-col overflow-hidden">
        <Navbar />

        <div className="flex-1 flex flex-col space-y-gutter mt-lg w-full min-h-0 overflow-hidden">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight">Historical Records</h2>
              <p className="text-on-surface-variant mt-1 text-body-lg">Review past queue performance and patient volume.</p>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-label-sm uppercase tracking-wider font-bold text-on-surface-variant ml-2">Select Date</label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-surface-container-low border border-outline-variant text-on-surface rounded-full px-6 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-xl font-medium border border-error-container/30">
              Error fetching history: {error}
            </div>
          )}

          {/* Stats Summary */}
          {stats && !loading && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'Patients Served', value: stats.totalPatients, icon: 'groups' },
                { label: 'Completed', value: stats.completedPatients, icon: 'check_circle', color: 'text-secondary' },
                { label: 'Skipped', value: stats.skippedPatients, icon: 'cancel', color: 'text-error' },
                { label: 'Avg Duration', value: `${stats.averageConsultationTime}m`, icon: 'timer' },
                { label: 'Longest Consult', value: `${stats.longestConsultation}m`, icon: 'hourglass_bottom' },
              ].map((stat, i) => (
                <div key={i} className="bento-card bg-surface-container-low rounded-[24px] p-5 border border-outline-variant/30 flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-on-surface-variant mb-2">
                    <span className={`material-symbols-outlined text-[20px] ${stat.color || ''}`}>{stat.icon}</span>
                    <span className="text-label-md uppercase tracking-wider font-bold">{stat.label}</span>
                  </div>
                  <span className="text-3xl font-black text-on-surface tracking-tight">{stat.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Main Content Area */}
          <div className="bg-surface-container-lowest rounded-[32px] p-6 lg:p-8 border border-outline-variant/30 shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden mb-lg">
            
            {/* Filter Tabs */}
            <div className="flex overflow-x-auto gap-2 pb-4 mb-4 border-b border-outline-variant/30 hide-scrollbar">
              {['ALL', 'COMPLETED', 'SKIPPED', 'RECALLED', 'WAITING', 'CALLED'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                    statusFilter === status 
                      ? 'bg-on-surface text-surface' 
                      : 'bg-surface-container-high text-on-surface hover:bg-surface-variant'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto rounded-xl border border-outline-variant/20 relative">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-surface-container-lowest/80 backdrop-blur-sm z-10">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent animate-spin rounded-xl" style={{ transform: 'rotate(45deg)' }}></div>
                </div>
              ) : null}
              
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead className="bg-surface-container-low sticky top-0 z-20">
                  <tr>
                    <th className="py-4 px-6 text-label-md font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/30">Token</th>
                    <th className="py-4 px-6 text-label-md font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/30">Patient Name</th>
                    <th className="py-4 px-6 text-label-md font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/30">Status</th>
                    <th className="py-4 px-6 text-label-md font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/30">Duration</th>
                    <th className="py-4 px-6 text-label-md font-extrabold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/30">Arrival Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-[48px] opacity-20 mb-4">history</span>
                        <p className="font-bold">No patients found for this criteria.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map((patient) => (
                      <tr key={patient._id} className="border-b border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors">
                        <td className="py-4 px-6 font-bold text-on-surface whitespace-nowrap">
                          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                            {patient.tokenNumber}
                          </div>
                        </td>
                        <td className="py-4 px-6 font-bold text-on-surface whitespace-nowrap">{patient.patientName}</td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(patient.status)}`}>
                            {patient.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-medium text-on-surface-variant whitespace-nowrap">
                          {formatDuration(patient.consultationDuration)}
                        </td>
                        <td className="py-4 px-6 font-medium text-on-surface-variant whitespace-nowrap">
                          {new Date(patient.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default History;
