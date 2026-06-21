import React, { useState, useEffect } from 'react';
import { useQueue } from '../context/QueueContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { 
    loading, 
    activeQueue, 
    currentlyCalledToken, 
    waitingCount, 
    averageConsultationTime,
    completedToday,
    joinQueue, 
    callNext, 
    completeToken, 
    skipToken,
    resetQueue
  } = useQueue();

  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

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

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { hour: '2-digit', minute: '2-digit', hour12: true };
      setCurrentTime(now.toLocaleTimeString([], options));
    };
    const timer = setInterval(updateTime, 10000);
    updateTime();
    return () => clearInterval(timer);
  }, []);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    if (!patientName.trim()) return;
    
    setIsSubmitting(true);
    try {
      await joinQueue(patientName, phone);
      setPatientName('');
      setPhone('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCallNext = async () => {
    try {
      setError('');
      await callNext();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to call next patient');
    }
  };

  const handleResetQueue = () => {
    setShowResetConfirm(true);
  };

  const confirmResetQueue = async () => {
    setShowResetConfirm(false);
    try {
      setError('');
      await resetQueue();
    } catch (err) {
      if (err instanceof TypeError) {
        setError('Frontend Error: Please hard refresh the page (Ctrl+F5). Context not updated.');
      } else if (err.message === 'Network Error') {
        setError('Network Error: The backend server is not running.');
      } else {
        setError(`Backend Error: ${err.response?.data?.error || err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen overflow-hidden bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface antialiased flex flex-col min-h-screen lg:h-screen lg:overflow-hidden w-full relative">
      
      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-surface-container-high rounded-[28px] max-w-sm w-full p-6 shadow-xl border border-outline-variant/30 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-error">
              <span className="material-symbols-outlined text-[28px]">warning</span>
              <h3 className="text-xl font-bold">Reset Queue?</h3>
            </div>
            <p className="text-body-md text-on-surface-variant">
              Are you sure you want to reset the queue? All active tokens will be skipped and the token counter will restart from #1.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button 
                onClick={() => setShowResetConfirm(false)}
                className="px-6 py-2.5 rounded-full text-sm font-bold text-primary hover:bg-primary/10 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmResetQueue}
                className="px-6 py-2.5 rounded-full text-sm font-bold bg-error text-on-error hover:bg-error/90 transition-colors shadow-sm"
              >
                Reset Queue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Canvas */}
      <main className="flex-1 w-full px-margin-mobile lg:px-margin-desktop pb-lg flex flex-col lg:overflow-hidden">
        
        {/* TopAppBar */}
        <header className="flex justify-between items-center w-full h-16 sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant shadow-sm mb-lg">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-extrabold text-primary tracking-tight">ClinQ</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center bg-surface-container-low rounded-full px-4 py-1.5 border border-outline-variant">
              <span className="material-symbols-outlined text-outline mr-2 text-[20px]">search</span>
              <input className="bg-transparent border-none focus:outline-none text-body-md w-48 text-on-surface placeholder:text-outline" placeholder="Search patients..." type="text"/>
            </div>
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

        <div className="flex-1 flex flex-col lg:min-h-0 space-y-gutter">
          
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-headline-lg font-headline-lg text-on-background">Reception Dashboard</h2>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-tertiary-container text-on-tertiary-container text-[11px] font-bold rounded-full border border-tertiary/30">LIVE</span>
              </div>
              <p className="text-body-md text-on-surface-variant mt-1">Manage your clinic's flow with empathetic precision.</p>
            </div>
            <div className="flex gap-3">
              <div className="text-right">
                <p className="text-label-sm text-on-surface-variant uppercase tracking-widest">Local Time</p>
                <p className="text-title-md text-primary font-bold">{currentTime}</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg flex items-center justify-between border border-error/20">
              <span className="text-body-md">{error}</span>
              <button onClick={() => setError('')}><span className="material-symbols-outlined">close</span></button>
            </div>
          )}

          {/* Metrics Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {/* Current Token */}
            <div className="bento-card bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-label-sm text-on-surface-variant">Current Token</span>
                <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
                </div>
              </div>
              <p className="text-headline-lg font-bold text-primary">
                {currentlyCalledToken ? `#${currentlyCalledToken.tokenNumber}` : 'None'}
              </p>
            </div>

            {/* Patients Waiting */}
            <div className="bento-card bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-label-sm text-on-surface-variant">Patients Waiting</span>
                <div className="w-8 h-8 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[20px]">group</span>
                </div>
              </div>
              <p className="text-headline-lg font-bold text-on-background">{waitingCount}</p>
            </div>

            {/* Avg Wait Time */}
            <div className="bento-card bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-label-sm text-on-surface-variant">Avg Wait Time</span>
                <div className="w-8 h-8 rounded-full bg-tertiary/20 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-[20px]">timer</span>
                </div>
              </div>
              <p className="text-headline-lg font-bold text-on-background">
                {Math.round(averageConsultationTime / 60)}<span className="text-body-lg font-normal text-on-surface-variant ml-1">m</span>
              </p>
            </div>

            {/* Completed Today */}
            <div className="bento-card bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-label-sm text-on-surface-variant">Completed Today</span>
                <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                </div>
              </div>
              <p className="text-headline-lg font-bold text-on-background">{completedToday || activeQueue.filter(t => t.status === 'COMPLETED').length}</p>
            </div>
          </div>

          {/* Main Layout: Form and Queue */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter flex-1 lg:min-h-0 pb-4">
            
            {/* Left Column: Registration */}
            <div className="lg:col-span-4 space-y-gutter">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm">
                <h3 className="text-title-md text-on-background mb-4">Registration</h3>
                <form className="space-y-4" onSubmit={handleAddPatient}>
                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-1">Patient Name</label>
                    <input 
                      className="w-full h-12 rounded-lg bg-surface-container border border-outline-variant text-on-surface focus:outline-none focus:border-primary px-4 text-body-md" 
                      placeholder="e.g., John Doe" 
                      type="text"
                      value={patientName}
                      onChange={e => setPatientName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-1">Phone Number <span className="text-outline font-normal">(Optional)</span></label>
                    <input 
                      className="w-full h-12 rounded-lg bg-surface-container border border-outline-variant text-on-surface focus:outline-none focus:border-primary px-4 text-body-md" 
                      placeholder="+1 (555) 000-0000" 
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="pt-2">
                    <button 
                      type="submit"
                      disabled={isSubmitting || !patientName.trim()}
                      className="w-full h-12 bg-primary text-on-primary font-bold rounded-lg shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <><span className="material-symbols-outlined animate-spin">sync</span> Processing...</>
                      ) : (
                        <><span className="material-symbols-outlined">confirmation_number</span> Generate Token</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column: Queue Management */}
            <div className="lg:col-span-8 lg:h-full flex flex-col lg:min-h-0">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col flex-1 min-h-[400px] lg:min-h-0">
                <div className="p-md border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
                  <h3 className="text-title-md text-on-background">Live Queue</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleResetQueue}
                      className="px-4 py-2 bg-error-container text-on-error-container rounded-lg text-label-sm font-bold hover:opacity-90 transition-all"
                    >
                      Reset Queue
                    </button>
                    <button 
                      onClick={handleCallNext}
                      disabled={waitingCount === 0}
                      className="px-4 py-2 bg-primary-container text-on-primary-container rounded-lg text-label-sm font-bold hover:opacity-90 disabled:opacity-50 transition-all"
                    >
                      Call Next
                    </button>
                  </div>
                </div>

                {/* Queue Table */}
                <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-surface-container-low border-b border-outline-variant">
                      <tr>
                        <th className="px-md py-4 text-label-sm text-on-surface-variant uppercase">Token</th>
                        <th className="px-md py-4 text-label-sm text-on-surface-variant uppercase">Patient Name</th>
                        <th className="px-md py-4 text-label-sm text-on-surface-variant uppercase">Status</th>
                        <th className="px-md py-4 text-label-sm text-on-surface-variant uppercase">Arrival</th>
                        <th className="px-md py-4 text-label-sm text-on-surface-variant uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      
                      {/* Active Token Row */}
                      {currentlyCalledToken && (
                        <tr className="bg-primary/5 transition-colors group h-16">
                          <td className="px-md py-3">
                            <span className="font-bold text-primary text-body-md">
                              <span className="inline-block w-2 h-2 bg-tertiary rounded-full animate-pulse mr-2"></span>
                              #{currentlyCalledToken.tokenNumber}
                            </span>
                          </td>
                          <td className="px-md py-3">
                            <p className="font-bold text-on-background text-body-md">{currentlyCalledToken.patientName}</p>
                          </td>
                          <td className="px-md py-3">
                            <span className="px-3 py-1 bg-primary-container/20 text-primary border border-primary/20 rounded-full text-label-sm">Called</span>
                          </td>
                          <td className="px-md py-3 text-body-md text-on-surface-variant">
                            {new Date(currentlyCalledToken.joinedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </td>
                          <td className="px-md py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => completeToken(currentlyCalledToken._id)}
                                className="p-2 text-tertiary hover:bg-tertiary/10 rounded-lg transition-colors" 
                                title="Complete"
                              >
                                <span className="material-symbols-outlined">check_circle</span>
                              </button>
                              <button 
                                onClick={() => skipToken(currentlyCalledToken._id)}
                                className="p-2 text-outline hover:bg-surface-variant rounded-lg transition-colors" 
                                title="Skip"
                              >
                                <span className="material-symbols-outlined">block</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}

                      {/* Waiting Rows */}
                      {activeQueue.filter(t => t.status === 'WAITING').map((token) => (
                        <tr key={token._id} className="hover:bg-surface-container-low transition-colors h-16">
                          <td className="px-md py-3">
                            <span className="font-bold text-on-surface-variant text-body-md">#{token.tokenNumber}</span>
                          </td>
                          <td className="px-md py-3">
                            <p className="font-bold text-on-background text-body-md">{token.patientName}</p>
                          </td>
                          <td className="px-md py-3">
                            <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full text-label-sm">Waiting</span>
                          </td>
                          <td className="px-md py-3 text-body-md text-on-surface-variant">
                            {new Date(token.joinedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </td>
                          <td className="px-md py-3 text-right">
                            {/* Empty actions for waiting to match spacing */}
                          </td>
                        </tr>
                      ))}

                      {activeQueue.filter(t => t.status === 'WAITING').length === 0 && !currentlyCalledToken && (
                        <tr>
                          <td colSpan="5" className="px-md py-12 text-center text-on-surface-variant text-body-md">
                            Queue is empty. Add a patient to generate a token.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
