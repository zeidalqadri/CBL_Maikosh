import React, { useEffect, useRef } from 'react';
import { trapFocus, announceToScreenReader } from '../../utils/accessibility';

/**
 * Accessible Modal Component
 * WCAG 2.1 AA compliant modal with proper focus management and ARIA attributes
 */
const AccessibleModal = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  className = '',
  closeOnBackdrop = true,
  closeOnEscape = true,
  size = 'medium',
  role = 'dialog'
}) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);
  const titleId = `modal-title-${Math.random().toString(36).substr(2, 9)}`;
  const descriptionId = description ? `modal-description-${Math.random().toString(36).substr(2, 9)}` : undefined;
  
  const sizes = {
    small: 'max-w-sm',
    medium: 'max-w-md',
    large: 'max-w-lg',
    xlarge: 'max-w-4xl',
    fullscreen: 'max-w-full h-full'
  };
  
  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousFocusRef.current = document.activeElement;
      
      // Focus the modal
      if (modalRef.current) {
        modalRef.current.focus();
        
        // Set up focus trap
        const cleanup = trapFocus(modalRef.current);
        
        // Announce modal opening
        announceToScreenReader(`${title || 'Modal'} dialog opened`, 'assertive');
        
        return () => {
          cleanup();
          // Restore focus to previously focused element
          if (previousFocusRef.current) {
            previousFocusRef.current.focus();
          }
          announceToScreenReader(`${title || 'Modal'} dialog closed`);
        };
      }
    }
  }, [isOpen, title]);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose]);
  
  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
        aria-hidden="true"
      >
        {/* Modal */}
        <div
          ref={modalRef}
          className={`
            bg-white rounded-lg shadow-xl w-full ${sizes[size]}
            max-h-[90vh] overflow-y-auto
            focus:outline-none
            ${className}
          `}
          role={role}
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={descriptionId}
          tabIndex={-1}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 
                id={titleId}
                className="text-xl font-semibold text-gray-900"
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-basketball-orange focus:ring-offset-2 rounded"
                aria-label="Close modal"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>
          )}
          
          {/* Content */}
          <div className="p-6">
            {description && (
              <p id={descriptionId} className="sr-only">
                {description}
              </p>
            )}
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default AccessibleModal;