import React from 'react';

const SplashScreen = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-screen bg-background text-primary gap-8">
      <div className="relative flex flex-col items-center">
        {/* Animated Background Glow */}
        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full animate-pulse w-32 h-32 -m-8 pointer-events-none"></div>
        
        {/* Brand Name */}
        <h1 className="text-5xl font-black text-primary tracking-tight mb-2">ClinQ</h1>
        <p className="text-on-surface-variant font-bold tracking-[0.2em] uppercase text-sm">Empathetic Care Flow</p>
        
        {/* Loading Spinner */}
        <div className="mt-16 flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-xl animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
