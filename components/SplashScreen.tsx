import React from 'react';
import AnimatedBackground from './AnimatedBackground';

const SplashScreen: React.FC = () => {
  return (
    <div className="splash-screen">
      <AnimatedBackground />
      <div className="flex flex-col items-center justify-center text-center z-10">
        <div className="splash-logo w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl mb-6">
            <span className="text-white text-5xl font-bold">FL</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-100">FarsiLingo</h1>
        <p className="text-lg text-slate-300 mt-2">...در حال بارگذاری</p>
      </div>
    </div>
  );
};

export default SplashScreen;