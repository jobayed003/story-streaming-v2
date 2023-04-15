import { useEffect, useRef, useState } from 'react';

// Hook
const useOutsideHover = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mouseover', listener);
    document.addEventListener('mouseout', listener);
    return () => {
      document.removeEventListener('mouseover', listener);
      document.removeEventListener('mouseout', listener);
    };
  }, [ref, handler]);
};

export default useOutsideHover;
