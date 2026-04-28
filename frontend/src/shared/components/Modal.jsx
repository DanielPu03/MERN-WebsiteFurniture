import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, footer, size = 'md', className = '' }) => {
  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 pt-10">
      <div className={`bg-white rounded-lg shadow-xl w-full ${sizeStyles[size]} max-h-[80vh] flex flex-col relative ${className}`}>
        {/* Close button - always visible */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 text-white hover:text-gray-200 bg-purple-700 rounded-full p-1.5 transition-colors shadow-md"
        >
          <X className="w-5 h-5" />
        </button>
        {/* Header */}
        {title && (
          <div className="bg-purple-600 text-white px-4 py-3 pr-10 rounded-t-lg flex-shrink-0">
            <h2 className="text-lg font-bold">{title}</h2>
          </div>
        )}

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 min-h-0">
          {children}
        </div>

        {/* Footer (sticky) */}
        {footer && (
          <div className="px-4 py-3 border-t border-gray-200 bg-white flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
