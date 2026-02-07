import React from 'react';

// Globalni formatter za bosansku valutu (1.234,56 KM)
export const formatKM = (val: number) => {
  return new Intl.NumberFormat('bs-BA', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(val) + " KM";
};

// React komponenta za prikaz valute
export const CurrencyDisplay: React.FC<{ value: number; className?: string }> = ({ value, className }) => {
  const formatted = new Intl.NumberFormat('bs-BA', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(value);
  return <span className={`font-mono whitespace-nowrap ${className}`}>{formatted} KM</span>;
};