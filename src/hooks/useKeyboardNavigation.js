import { useEffect, useRef, useCallback } from 'react';
import { announceToScreenReader } from '../utils/accessibility';

/**
 * Custom Hook for Keyboard Navigation
 * Provides comprehensive keyboard navigation support for complex UI components
 */
export const useKeyboardNavigation = ({
  items = [],
  orientation = 'vertical',
  loop = true,
  onSelect,
  onEscape,
  initialIndex = 0,
  disabled = false
}) => {
  const currentIndexRef = useRef(initialIndex);
  const itemsRef = useRef([]);
  
  // Set item refs
  const setItemRef = useCallback((index) => (element) => {
    if (element) {
      itemsRef.current[index] = element;
    }
  }, []);
  
  // Move focus to specific index
  const focusItem = useCallback((index) => {
    if (itemsRef.current[index] && !disabled) {
      itemsRef.current[index].focus();
      currentIndexRef.current = index;
    }
  }, [disabled]);
  
  // Navigate to next item
  const navigateNext = useCallback(() => {
    const currentIndex = currentIndexRef.current;
    let nextIndex = currentIndex + 1;
    
    if (nextIndex >= items.length) {
      nextIndex = loop ? 0 : currentIndex;
    }
    
    focusItem(nextIndex);
  }, [items.length, loop, focusItem]);
  
  // Navigate to previous item
  const navigatePrevious = useCallback(() => {
    const currentIndex = currentIndexRef.current;
    let prevIndex = currentIndex - 1;
    
    if (prevIndex < 0) {
      prevIndex = loop ? items.length - 1 : 0;
    }
    
    focusItem(prevIndex);
  }, [items.length, loop, focusItem]);
  
  // Navigate to first item
  const navigateFirst = useCallback(() => {
    focusItem(0);
  }, [focusItem]);
  
  // Navigate to last item
  const navigateLast = useCallback(() => {
    focusItem(items.length - 1);
  }, [items.length, focusItem]);
  
  // Handle keyboard events
  const handleKeyDown = useCallback((e) => {
    if (disabled) return;
    
    const isVertical = orientation === 'vertical';
    const nextKeys = isVertical ? ['ArrowDown'] : ['ArrowRight'];
    const prevKeys = isVertical ? ['ArrowUp'] : ['ArrowLeft'];
    
    if (nextKeys.includes(e.key)) {
      e.preventDefault();
      navigateNext();
    } else if (prevKeys.includes(e.key)) {
      e.preventDefault();
      navigatePrevious();
    } else switch (e.key) {
        
      case 'Home':
        e.preventDefault();
        navigateFirst();
        break;
        
      case 'End':
        e.preventDefault();
        navigateLast();
        break;
        
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (onSelect) {
          onSelect(currentIndexRef.current);
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        if (onEscape) {
          onEscape();
        }
        break;
        
      default:
        // Handle alphanumeric shortcuts
        if (e.key.length === 1 && /[a-zA-Z0-9]/.test(e.key)) {
          const matchingIndex = items.findIndex(item => 
            item?.toString().toLowerCase().startsWith(e.key.toLowerCase())
          );
          if (matchingIndex !== -1) {
            focusItem(matchingIndex);
          }
        }
        break;
    }
  }, [disabled, orientation, navigateNext, navigatePrevious, navigateFirst, navigateLast, onSelect, onEscape, items]);
  
  return {
    currentIndex: currentIndexRef.current,
    setItemRef,
    focusItem,
    handleKeyDown,
    navigateNext,
    navigatePrevious,
    navigateFirst,
    navigateLast
  };
};

/**
 * Hook for Focus Management
 * Manages focus states and provides utilities for focus handling
 */
export const useFocusManagement = () => {
  const previousFocusRef = useRef(null);
  
  // Store current focus
  const storeFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement;
  }, []);
  
  // Restore previous focus
  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
      previousFocusRef.current.focus();
    }
  }, []);
  
  // Focus first focusable element in container
  const focusFirst = useCallback((container) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
      return true;
    }
    return false;
  }, []);
  
  // Focus last focusable element in container
  const focusLast = useCallback((container) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
      return true;
    }
    return false;
  }, []);
  
  return {
    storeFocus,
    restoreFocus,
    focusFirst,
    focusLast
  };
};

/**
 * Hook for Roving Tabindex
 * Implements roving tabindex pattern for accessible widget navigation
 */
export const useRovingTabindex = ({
  items = [],
  defaultActiveIndex = 0,
  orientation = 'horizontal'
}) => {
  const activeIndexRef = useRef(defaultActiveIndex);
  
  // Get tabindex for item at index
  const getTabIndex = useCallback((index) => {
    return index === activeIndexRef.current ? 0 : -1;
  }, []);
  
  // Get ARIA selected for item at index
  const getAriaSelected = useCallback((index) => {
    return index === activeIndexRef.current;
  }, []);
  
  // Set active index
  const setActiveIndex = useCallback((index) => {
    if (index >= 0 && index < items.length) {
      activeIndexRef.current = index;
    }
  }, [items.length]);
  
  // Handle key navigation
  const handleKeyDown = useCallback((e, currentIndex) => {
    let newIndex = currentIndex;
    
    switch (e.key) {
      case orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown':
        e.preventDefault();
        newIndex = currentIndex + 1 >= items.length ? 0 : currentIndex + 1;
        break;
        
      case orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp':
        e.preventDefault();
        newIndex = currentIndex - 1 < 0 ? items.length - 1 : currentIndex - 1;
        break;
        
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
        
      case 'End':
        e.preventDefault();
        newIndex = items.length - 1;
        break;
        
      default:
        return;
    }
    
    setActiveIndex(newIndex);
    
    // Focus the new active item
    const activeElement = e.currentTarget.parentElement.children[newIndex];
    if (activeElement) {
      activeElement.focus();
    }
  }, [items.length, orientation, setActiveIndex]);
  
  return {
    activeIndex: activeIndexRef.current,
    getTabIndex,
    getAriaSelected,
    setActiveIndex,
    handleKeyDown
  };
};

/**
 * Hook for Skip Links
 * Manages skip link functionality for better keyboard navigation
 */
export const useSkipLinks = () => {
  const skipLinksRef = useRef([]);
  
  // Register a skip link
  const registerSkipLink = useCallback((id, label, target) => {
    const skipLink = {
      id,
      label,
      target,
      element: null
    };
    
    skipLinksRef.current.push(skipLink);
    
    return () => {
      skipLinksRef.current = skipLinksRef.current.filter(link => link.id !== id);
    };
  }, []);
  
  // Create skip links container
  const createSkipLinksContainer = useCallback(() => {
    if (typeof document === 'undefined') return;
    
    let container = document.getElementById('skip-links');
    if (!container) {
      container = document.createElement('div');
      container.id = 'skip-links';
      container.className = 'skip-links-container';
      container.setAttribute('aria-label', 'Skip navigation links');
      
      // Insert at the beginning of the body
      document.body.insertBefore(container, document.body.firstChild);
    }
    
    // Clear existing links
    container.innerHTML = '';
    
    // Add skip links
    skipLinksRef.current.forEach(({ id, label, target }) => {
      const link = document.createElement('a');
      link.href = `#${target}`;
      link.textContent = label;
      link.className = 'skip-link';
      link.id = id;
      
      // Style the skip link - hidden by default, only visible on focus
      link.style.cssText = `
        position: absolute;
        top: -9999px;
        left: -9999px;
        background: #000;
        color: #fff;
        padding: 8px 12px;
        text-decoration: none;
        z-index: 10000;
        border-radius: 4px;
        transition: all 0.2s ease;
        font-size: 14px;
        font-weight: 500;
        clip: rect(0 0 0 0);
        clip-path: inset(50%);
        height: 1px;
        overflow: hidden;
        white-space: nowrap;
        width: 1px;
      `;
      
      // Show on focus - make visible and accessible
      link.addEventListener('focus', () => {
        link.style.position = 'absolute';
        link.style.top = '6px';
        link.style.left = '6px';
        link.style.clip = 'auto';
        link.style.clipPath = 'none';
        link.style.height = 'auto';
        link.style.overflow = 'visible';
        link.style.width = 'auto';
      });
      
      // Hide on blur - return to hidden state
      link.addEventListener('blur', () => {
        link.style.position = 'absolute';
        link.style.top = '-9999px';
        link.style.left = '-9999px';
        link.style.clip = 'rect(0 0 0 0)';
        link.style.clipPath = 'inset(50%)';
        link.style.height = '1px';
        link.style.overflow = 'hidden';
        link.style.width = '1px';
      });
      
      container.appendChild(link);
    });
    
    return container;
  }, []);
  
  // Update skip links when they change
  useEffect(() => {
    const container = createSkipLinksContainer();
    return () => {
      if (container && container.parentElement) {
        container.parentElement.removeChild(container);
      }
    };
  }, [createSkipLinksContainer]);
  
  return {
    registerSkipLink
  };
};

/**
 * Hook for Keyboard Shortcuts
 * Manages global keyboard shortcuts with accessibility considerations
 */
export const useKeyboardShortcuts = (shortcuts = {}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if we're in an input field
      const activeElement = document.activeElement;
      const isInInput = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.isContentEditable
      );
      
      // Skip shortcuts when typing in inputs (unless explicitly allowed)
      if (isInInput && !e.ctrlKey && !e.altKey && !e.metaKey) {
        return;
      }
      
      const key = e.key.toLowerCase();
      const modifiers = {
        ctrl: e.ctrlKey,
        shift: e.shiftKey,
        alt: e.altKey,
        meta: e.metaKey
      };
      
      // Find matching shortcut
      const shortcut = Object.values(shortcuts).find(shortcut => {
        const shortcutKey = shortcut.key.toLowerCase();
        const shortcutModifiers = shortcut.modifiers || {};
        
        return key === shortcutKey &&
               !!modifiers.ctrl === !!shortcutModifiers.ctrl &&
               !!modifiers.shift === !!shortcutModifiers.shift &&
               !!modifiers.alt === !!shortcutModifiers.alt &&
               !!modifiers.meta === !!shortcutModifiers.meta;
      });
      
      if (shortcut) {
        e.preventDefault();
        shortcut.action();
        
        // Announce shortcut to screen readers
        if (shortcut.announcement) {
          announceToScreenReader(shortcut.announcement);
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
};