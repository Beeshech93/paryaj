'use client';

import React from 'react';

export const WhatsAppWidget: React.FC = () => {
  return (
    <a
      href="https://wa.me/?text=Hola,%20necesito%20soporte%20en%20la%20plataforma"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-40 group flex items-center gap-2.5 transition-transform hover:scale-105"
      title="Soporte por WhatsApp 24/7"
    >
      <div className="relative w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl shadow-[#25D366]/40 hover:bg-[#20ba59] transition-colors">
        {/* Radar Pulse ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping" />
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current relative z-10" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.59 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.83 7.38C8.64 7.38 8.44 7.39 8.27 7.74C8.1 8.09 7.6 8.56 7.6 9.53C7.6 10.5 8.31 11.44 8.41 11.57C8.51 11.71 9.77 13.65 11.72 14.49C13.34 15.19 13.67 15.05 14.02 15.02C14.37 14.98 15.14 14.56 15.3 14.11C15.46 13.66 15.46 13.27 15.41 13.19C15.36 13.11 15.23 13.06 15.04 12.96C14.85 12.86 13.91 12.4 13.73 12.33C13.56 12.27 13.43 12.24 13.3 12.43C13.16 12.63 12.79 13.06 12.67 13.19C12.56 13.32 12.44 13.34 12.25 13.24C12.06 13.14 11.25 12.88 10.29 12.03C9.54 11.36 9.03 10.54 8.89 10.29C8.74 10.05 8.87 9.92 8.97 9.82C9.06 9.73 9.17 9.59 9.27 9.47C9.37 9.35 9.4 9.25 9.47 9.12C9.53 8.99 9.5 8.87 9.45 8.77C9.4 8.67 8.98 7.64 8.83 7.38Z" />
        </svg>
      </div>
      <span className="hidden sm:inline-block bg-[#121920] border border-slate-700 text-xs font-bold text-white px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        ¿Dudas? Chatea en WhatsApp
      </span>
    </a>
  );
};
