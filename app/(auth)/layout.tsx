'use client'

import React from 'react';
import { Pizza, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header for mobile */}
      <div className={`lg:hidden w-full ${isDark ? 'bg-orange-500/70' : 'bg-orange-500/90'} py-6 relative`}>
        <div className="container mx-auto px-4 text-center">
          <Pizza className="w-10 h-10 mx-auto text-white" />
          <h1 className="text-xl font-bold text-white mt-2">MARMARA SPRA</h1>
        </div>
      </div>

      {/* Theme toggle button - visible on all screens */}
      <button
        onClick={() => setIsDark(!isDark)}
        className={`fixed top-4 right-4 p-2 rounded-full z-50 transition-colors
          ${isDark ? 'bg-gray-800 text-orange-500 hover:bg-gray-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Main content */}
      <div className={`flex-1 flex items-center justify-center p-4 lg:p-0 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Right side decorative panel */}
      <div className={`hidden lg:flex lg:w-[45%] relative overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Professional gradient overlay */}
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-br from-gray-900 via-orange-500/5 to-gray-900' 
            : 'bg-gradient-to-br from-gray-50 via-orange-500/10 to-gray-50'
        }`} />
        
        {/* Pizza pattern background */}
        <div className="absolute inset-0">
          <div className={`absolute inset-0 ${isDark ? 'opacity-3' : 'opacity-5'}`}>
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0c16.569 0 30 13.431 30 30 0 16.569-13.431 30-30 30C13.431 60 0 46.569 0 30 0 13.431 13.431 0 30 0zm0 5C16.193 5 5 16.193 5 30s11.193 25 25 25 25-11.193 25-25S43.807 5 30 5zm-7 25a3 3 0 110-6 3 3 0 010 6zm7-10a3 3 0 110-6 3 3 0 010 6zm7 10a3 3 0 110-6 3 3 0 010 6z' fill='%23000000' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }} />
          </div>
        </div>
        
        {/* Content overlay with glass effect */}
        <div className={`relative w-full flex flex-col items-center justify-center p-12 ${isDark ? 'text-orange-500' : 'text-gray-900'}`}>
          <div className="absolute inset-0 backdrop-blur-sm" />
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo container with subtle shadow */}
            <div className={`${
              isDark 
                ? 'bg-gradient-to-br from-orange-500/20 to-orange-500/10' 
                : 'bg-gradient-to-br from-orange-500 to-orange-400/80'
            } p-8 rounded-2xl shadow-2xl mb-8 backdrop-blur-md`}>
              <Pizza className={`w-20 h-20 ${isDark ? 'text-orange-500' : 'text-white'}`} />
            </div>
            
            {/* Text content */}
            <h2 className="text-5xl font-bold mb-6 text-center bg-clip-text">MARMARA SPRA</h2>
            <div className={`w-24 h-1 ${isDark ? 'bg-gradient-to-r from-orange-500/0 via-orange-500/50 to-orange-500/0' : 'bg-gradient-to-r from-orange-500/0 via-orange-500 to-orange-500/0'} mb-6`} />
            <p className={`text-xl text-center max-w-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
              Savourez l&apos;authenticité de nos délices méditerranéens
            </p>
          </div>
          
          {/* Professional accent elements */}
          <div className={`absolute top-0 right-0 w-96 h-96 ${
            isDark 
              ? 'bg-gradient-to-br from-orange-500/5 to-transparent' 
              : 'bg-gradient-to-br from-orange-500/20 to-transparent'
          } rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`} />
          <div className={`absolute bottom-0 left-0 w-96 h-96 ${
            isDark 
              ? 'bg-gradient-to-tl from-orange-500/5 to-transparent' 
              : 'bg-gradient-to-tl from-orange-500/20 to-transparent'
          } rounded-full blur-3xl translate-y-1/2 -translate-x-1/2`} />
        </div>

        {/* Professional bottom accent */}
        <div className={`absolute bottom-0 left-0 right-0 h-32 ${
          isDark 
            ? 'bg-gradient-to-t from-gray-900 via-orange-500/5 to-transparent' 
            : 'bg-gradient-to-t from-gray-50 via-orange-500/10 to-transparent'
        }`} />
      </div>
    </div>
  );
}