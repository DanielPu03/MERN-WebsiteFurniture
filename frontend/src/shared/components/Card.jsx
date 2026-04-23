import React from 'react';

const Card = ({ children, className = '', hover = false, ...props }) => {
  const baseStyles = 'bg-white rounded-lg shadow-lg';
  const hoverStyles = hover ? 'hover:shadow-xl transition-shadow duration-300' : '';
  
  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
