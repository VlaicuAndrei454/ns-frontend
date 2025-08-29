import React from "react";

import CARD_2 from "../../assets/images/card2.png";
import { LuTrendingUpDown, LuWallet } from 'react-icons/lu';
import HeroIllustration from '../../assets/images/HeroIllustration.svg';
import AccentPattern from '../../assets/images/AccentPattern.svg';

const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Left panel (form area) */}
      <div className="w-screen h-screen md:w-3/5 px-12 pt-8 pb-12 flex flex-col justify-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">NeatSpend</h2>
        {children}
      </div>

      {/* Right “hero” panel */}
      <div className="hidden md:flex w-2/5 h-screen relative overflow-hidden">
        {/* Gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-200" />

        {/* Subtle pattern overlay */}
        <img
          src={AccentPattern}
          alt="Accent pattern"
          className="absolute inset-0 w-full h-full opacity-20"
        />

        {/* Hero illustration */}
        <img
          src={HeroIllustration}
          alt="Fintech hero"
          className="relative z-10 w-3/4 h-auto mx-auto mt-20 animate-float"
        />

        {/* Floating data cards */}
        <div className="absolute top-1/4 right-5 space-y-6 z-20">
          <StatsInfoCard
            icon={<LuTrendingUpDown />}
            label="Monthly Growth"
            value="12%"
            color="bg-green-600"
          />
          <StatsInfoCard
            icon={<LuWallet />}
            label="Wallet Balance"
            value="18,240"
            color="bg-green-500"
          />
        </div>

        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-16 w-56 h-56 bg-green-300 rounded-full mix-blend-multiply opacity-60 animate-pulse" />
        <div className="absolute -bottom-12 -left-20 w-72 h-72 bg-green-400 rounded-full mix-blend-screen opacity-50" />
      </div>
    </div>
  );
};


const StatsInfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex gap-6 bg-white p-4 rounded-xl shadow-md shadow-purple-400/10 border border-gray-200/50 z-10">
      <div
        className={`w-12 h-12 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}
      >
        {icon}
      </div>
      <div>
        <h6 className="text-xs text-gray-500 mb-1">{label}</h6>
        <span className="text-[20px]">${value}</span>
      </div>
    </div>
  );
};

export default AuthLayout;
