import React, { useState, useEffect } from 'react';
import { useQueue } from '../context/QueueContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PatientScreen = () => {
  const { currentlyCalledToken, activeQueue, averageConsultationTime, waitingCount } = useQueue();
  const [searchToken, setSearchToken] = useState('');
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [searchError, setSearchError] = useState('');

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

  // Handle tracking lookup
  const handleTrack = async (e) => {
    e.preventDefault();
    if (!searchToken) return;
    
    try {
      setSearchError('');
      const response = await axios.get(`http://localhost:5000/api/queue/token/${searchToken}`);
      setTrackingInfo(response.data);
    } catch (err) {
      setTrackingInfo(null);
      setSearchError(err.response?.data?.error || 'Token not found');
    }
  };

  useEffect(() => {
    if (trackingInfo && (trackingInfo.status === 'WAITING' || trackingInfo.status === 'RECALLED')) {
      const exists = activeQueue.some(t => t.tokenNumber === trackingInfo.tokenNumber);
      
      if (exists) {
        let peopleAhead = 0;
        if (trackingInfo.status === 'RECALLED') {
           peopleAhead = activeQueue.filter(t => t.status === 'RECALLED' && t.tokenNumber < trackingInfo.tokenNumber).length;
        } else {
           const recalledAhead = activeQueue.filter(t => t.status === 'RECALLED').length;
           const waitingAhead = activeQueue.filter(t => t.status === 'WAITING' && t.tokenNumber < trackingInfo.tokenNumber).length;
           peopleAhead = recalledAhead + waitingAhead;
        }

        setTrackingInfo({
          ...trackingInfo,
          peopleAhead: peopleAhead,
          estimatedWaitTime: (peopleAhead + (currentlyCalledToken ? 1 : 0)) * averageConsultationTime
        });
      } else {
        handleTrack({ preventDefault: () => {} });
      }
    }
  }, [activeQueue, averageConsultationTime, currentlyCalledToken]);

  // Derived state for Journey
  const getJourneyStep = () => {
    if (!trackingInfo) return 0;
    if (trackingInfo.status === 'CALLED') return 3;
    if (trackingInfo.status === 'WAITING' || trackingInfo.status === 'RECALLED') return 2;
    return 1;
  }
  const journeyStep = getJourneyStep();

  // Derived state for recently called
  const recentlyCalled = activeQueue.filter(t => t.status === 'CALLED' || t.status === 'COMPLETED').slice(-3).reverse();

  return (
    <div className="bg-background text-on-surface antialiased flex flex-col min-h-screen lg:h-screen lg:overflow-hidden w-full relative">
      {/* Main Content Canvas */}
      <main className="flex-1 w-full px-4 lg:px-8 pb-4 lg:pb-8 flex flex-col lg:overflow-hidden">
        
        {/* TopAppBar */}
        <header className="flex justify-between items-center w-full h-16 sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant shadow-sm mb-lg shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-extrabold text-primary tracking-tight">ClinQ</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:block text-right">
              <p className="text-label-sm font-bold text-primary">Your Status</p>
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest">LIVE TRACKER</p>
            </div>
            <Link to="/" className="hidden sm:block text-on-surface-variant hover:text-primary transition-colors text-label-sm uppercase tracking-wider font-bold mr-2">
              Reception View
            </Link>
            <Link to="/" className="sm:hidden text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-low">
              <span className="material-symbols-outlined">dashboard</span>
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
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-full relative">
                <span className="material-symbols-outlined">notifications</span>
                <div className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></div>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 w-full min-h-0 flex flex-col lg:grid lg:grid-cols-12 gap-5 lg:gap-8">
        
        {/* Left Column (Desktop) */}
        <div className="flex flex-col gap-4 lg:gap-5 lg:col-span-5 xl:col-span-5 lg:h-full lg:min-h-0">
          {/* Now Serving Banner */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 text-center shadow-sm relative overflow-hidden mt-2 lg:mt-0 flex-1 flex flex-col justify-center min-h-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
              <span className="material-symbols-outlined text-[150px] lg:text-[250px]">campaign</span>
            </div>
            <p className="text-xs lg:text-sm font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-2 lg:mb-4">Now Serving</p>
            <div className="inline-block bg-secondary/10 px-8 lg:px-12 py-3 lg:py-4 rounded-[32px] mb-4 lg:mb-6">
              <h2 className="text-[72px] lg:text-[100px] font-black text-secondary leading-none tracking-tighter">
                {currentlyCalledToken ? `${currentlyCalledToken.tokenNumber}` : '--'}
              </h2>
            </div>
            <p className="text-lg lg:text-2xl text-secondary font-bold mb-2">
              Consultation Room 1
            </p>
            <div className="flex items-center justify-center gap-1 mt-1 text-secondary font-semibold text-sm lg:text-base">
              <span className="material-symbols-outlined text-[16px] lg:text-[20px]">storefront</span>
              Proceed to Counter 1
            </div>
            <div className="mt-8 inline-flex items-center justify-center gap-1.5 bg-surface-container px-4 py-2 rounded-full border border-outline-variant mx-auto">
              <span className="w-2.5 h-2.5 bg-secondary rounded-full animate-pulse"></span>
              <span className="text-[10px] lg:text-xs font-bold text-secondary uppercase tracking-widest">UPDATED LIVE</span>
            </div>
          </div>

          {/* Aesthetic Imagery Component */}
          <section className="mt-2 mb-4 lg:mb-0 shrink-0">
            <div className="rounded-2xl overflow-hidden h-40 lg:h-48 relative shadow-sm border border-outline-variant/30">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent z-10"></div>
              <img alt="Tranquil waiting area" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVySGOTL9Zo2xawIzJjcC7u389uswE2nZbdQa5htjR7Z1t3uoEOSuJQEM1RgEN8VH8IFupPyiq4F0FJUrnacN1TE1LKuewKIMdDuB-OE2WgJjg_1ELdAJjtytqyJIKnvBGwRKjIGAyPhJaAELGti3Wc0wc0lu16fRfJ6QuFOS4UHklRG1yE-pzCrp5_O1RsM42FN1IaLbnWCMN1Wr8TpCUCTZiryp3lAYu3SW6EQdAn4lwNqGiRjC34Ojzvw2vIrkoH-oikopXufq9"/>
              <div className="absolute bottom-5 left-5 lg:bottom-6 lg:left-6 z-20 text-white">
                <p className="font-bold text-lg lg:text-xl mb-0.5">We'll notify you soon</p>
                <p className="text-white/90 text-sm lg:text-base font-medium">Enjoy our free clinic Wi-Fi while you wait.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (Desktop) */}
        <div className="flex flex-col gap-4 lg:gap-5 lg:col-span-7 xl:col-span-7 lg:h-full lg:min-h-0">
          {/* Tracker Form (If not tracking yet) */}
          {!trackingInfo && (
             <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 lg:p-8 shadow-sm">
               <h3 className="font-bold text-on-surface-variant mb-4 lg:mb-6 uppercase tracking-wider flex items-center gap-2 text-sm lg:text-base">
                  <span className="material-symbols-outlined text-primary">my_location</span> Track Your Token
               </h3>
               <form onSubmit={handleTrack} className="flex gap-2 lg:gap-3">
                  <input 
                    type="number" 
                    value={searchToken}
                    onChange={e => setSearchToken(e.target.value)}
                    className="flex-1 min-w-0 bg-surface-container border border-outline-variant rounded-xl h-14 lg:h-16 px-4 lg:px-6 text-base lg:text-lg text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline"
                    placeholder="Enter Token Number"
                  />
                  <button type="submit" className="shrink-0 h-14 lg:h-16 px-6 lg:px-8 bg-primary text-on-primary font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 text-base lg:text-lg">
                    <span className="material-symbols-outlined">search</span> <span className="hidden sm:inline-block">Track</span>
                  </button>
               </form>
               {searchError && <p className="text-error text-sm lg:text-base mt-4 font-medium">{searchError}</p>}
             </section>
          )}

          {/* Your Token Tracker */}
          {trackingInfo && (
            <section className="grid grid-cols-1 gap-4">
              <div className="bg-primary-container text-white rounded-2xl p-4 lg:p-6 shadow-md relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-white/80 font-semibold text-sm lg:text-base">Your Token</p>
                    <h2 className="text-[48px] lg:text-[60px] font-black leading-none">{trackingInfo.tokenNumber}</h2>
                  </div>
                  <div className="text-right">
                    <div className="bg-white/20 backdrop-blur-md rounded-xl p-2 lg:p-3 inline-block mb-2">
                      <p className="text-white font-bold text-2xl lg:text-3xl px-1">{trackingInfo.status === 'CALLED' ? 'NOW' : `${Math.round(trackingInfo.estimatedWaitTime / 60)} min`}</p>
                    </div>
                    <p className="text-white/80 text-sm lg:text-base font-semibold">Est. Wait</p>
                    <p className="text-[10px] lg:text-xs text-white/60 mt-1 leading-tight font-medium">Based on recent<br/>consultations</p>
                  </div>
                </div>
                
                <div className="mt-4 lg:mt-5 pt-3 lg:pt-4 border-t border-white/20 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px] lg:text-[20px]">person_search</span>
                    </div>
                    <p className="text-sm lg:text-base">
                      {trackingInfo.status === 'CALLED' ? (
                        <span className="font-bold text-tertiary-fixed text-base lg:text-lg">It's your turn!</span>
                      ) : (
                        <><span className="font-bold text-base lg:text-lg">{trackingInfo.peopleAhead} Patients</span> ahead of you</>
                      )}
                    </p>
                  </div>
                  <button onClick={() => { setTrackingInfo(null); setSearchToken(''); }} className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                      <span className="material-symbols-outlined text-[18px] lg:text-[20px]">close</span>
                  </button>
                </div>

                {/* Decorative element */}
                <div className="absolute -bottom-10 -left-10 w-40 h-40 lg:w-64 lg:h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
              </div>
            </section>
          )}

          {/* Queue Progress Bar */}
          {trackingInfo && (
            <section className="bg-surface-container-lowest rounded-2xl p-4 lg:p-5 border border-outline-variant shadow-sm">
              <h3 className="font-bold text-sm text-on-surface-variant mb-4 uppercase tracking-wider">Your Journey</h3>
              <div className="relative flex justify-between items-start pt-1 lg:px-6">
                {/* Track Line */}
                <div className="absolute top-4 lg:top-5 left-0 lg:left-6 w-full lg:w-[calc(100%-3rem)] h-[2px] bg-outline-variant">
                  <div className="h-full bg-secondary transition-all duration-1000 ease-in-out" style={{ width: journeyStep >= 3 ? '100%' : journeyStep === 2 ? '50%' : '0%' }}></div>
                </div>
                
                {/* Steps */}
                <div className="relative flex flex-col items-center gap-1.5 lg:gap-2 z-10">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-secondary flex items-center justify-center text-white ring-4 ring-surface-container-lowest">
                    <span className="material-symbols-outlined text-[16px] lg:text-[18px]">check</span>
                  </div>
                  <span className="text-xs font-semibold text-on-surface-variant">Arrival</span>
                </div>
                
                <div className="relative flex flex-col items-center gap-1.5 lg:gap-2 z-10">
                  <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center ring-4 ring-surface-container-lowest transition-colors ${journeyStep >= 2 ? 'bg-secondary text-white' : 'bg-surface-container text-outline-variant'} ${journeyStep === 2 ? 'animate-pulse' : ''}`}>
                    <span className="material-symbols-outlined text-[16px] lg:text-[18px]">hourglass_empty</span>
                  </div>
                  <span className={`text-xs ${journeyStep >= 2 ? 'text-secondary font-bold' : 'text-on-surface-variant font-semibold'}`}>Waiting</span>
                </div>
                
                <div className="relative flex flex-col items-center gap-1.5 lg:gap-2 z-10">
                  <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center ring-4 ring-surface-container-lowest transition-colors ${journeyStep >= 3 ? 'bg-secondary text-white animate-pulse' : 'bg-surface-container text-outline-variant'}`}>
                    <span className="material-symbols-outlined text-[16px] lg:text-[18px]">medical_services</span>
                  </div>
                  <span className={`text-xs ${journeyStep >= 3 ? 'text-secondary font-bold' : 'text-on-surface-variant font-semibold'}`}>Doctor</span>
                </div>
              </div>
            </section>
          )}

          {/* Live Updates: Recent Tokens */}
          <section className="space-y-3 mt-2 flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center px-1 shrink-0">
              <h3 className="font-bold text-sm lg:text-base text-on-surface-variant uppercase tracking-wider">Recently Called</h3>
              <span className="text-[10px] lg:text-xs bg-secondary/10 text-secondary px-2.5 py-1 rounded-full font-bold animate-pulse flex items-center">
                <span className="inline-block w-1.5 h-1.5 bg-secondary rounded-full mr-1.5"></span>
                LIVE UPDATE
              </span>
            </div>
            
            <div className="space-y-2 overflow-y-auto min-h-0 pr-1">
              {recentlyCalled.length > 0 ? recentlyCalled.map((token, index) => (
                <div key={token._id} className={`flex items-center justify-between p-3 lg:p-4 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm transition-opacity hover:border-secondary/30 ${index === 1 ? 'opacity-80' : index === 2 ? 'opacity-60' : ''}`}>
                  <div className="flex items-center gap-3 lg:gap-4">
                    <span className="text-lg lg:text-xl text-on-surface font-black">{token.tokenNumber}</span>
                    <div className="w-[1px] h-4 lg:h-5 bg-outline-variant"></div>
                    <span className="text-xs lg:text-sm font-medium text-on-surface-variant">Consultation Room 1</span>
                  </div>
                  <span className="text-[11px] lg:text-xs font-bold text-on-surface-variant bg-surface-container px-2 py-1 rounded capitalize">{token.status.toLowerCase()}</span>
                </div>
              )) : (
                <div className="text-center p-6 lg:p-8 text-on-surface-variant text-sm lg:text-base border border-outline-variant border-dashed rounded-2xl bg-surface-container-lowest/50 font-medium">No recently called tokens</div>
              )}
            </div>
          </section>
        </div>
        </div>
      </main>
      
      <footer className="p-4 lg:p-2 text-center mt-auto shrink-0 bg-background">
        <p className="text-xs font-medium text-on-surface-variant opacity-60">ClinQ Hospital Management System © 2024</p>
      </footer>
    </div>
  );
};

export default PatientScreen;
