import React from 'react';

const Spinner = ({ size = 12, color = 'border-red-600', className = '' }) => {
  const dim = `h-${size} w-${size}`;
  return (
    <div className={`inline-block animate-spin rounded-full ${dim} border-2 border-b-0 ${color} border-solid ${className}`}></div>
  );
};

export default Spinner;
