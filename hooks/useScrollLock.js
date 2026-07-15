import { useEffect } from 'react';

/**
 * A custom hook that locks body scrolling when active.
 * @param {boolean} isLocked - Whether the scroll should be locked.
 */
export const useScrollLock = (isLocked) => {
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLocked]);
};
