import React from 'react';

const HandymanLogo = ({ size = 120, primaryColor = "#1B4B5A", secondaryColor = "#E6A15C" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Handyman App Logo"
    >
      {/* Hammer Handle */}
      <rect 
        x="65" y="90" 
        width="15" height="80" 
        rx="4" 
        transform="rotate(-45 65 90)" 
        fill={secondaryColor} 
      />
      
      {/* Hammer Head */}
      <path
        d="M55 45C55 40 60 35 70 35H100V65H90C80 65 75 75 75 85L55 80V45Z"
        fill={primaryColor}
      />

      {/* Wrench Handle */}
      <rect 
        x="135" y="80" 
        width="15" height="85" 
        rx="4" 
        transform="rotate(45 135 80)" 
        fill={primaryColor} 
      />

      {/* Wrench Head */}
      <circle cx="145" cy="55" r="25" fill={primaryColor} />
      {/* Wrench Cutout */}
      <path
        d="M135 35L145 45L155 35"
        stroke="white"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <rect x="141" y="42" width="8" height="15" fill="white" />
    </svg>
  );
};

export default HandymanLogo;