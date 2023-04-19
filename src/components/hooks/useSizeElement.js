import { useEffect, useRef, useState } from 'react';

const getCurrentDimension = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};
const useSizeElement = () => {
  const [screenSize, setScreenSize] = useState(getCurrentDimension());

  console.log(screenSize);

  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension());
    };
    window.addEventListener('resize', updateDimension);

    return () => {
      window.removeEventListener('resize', updateDimension);
    };
  }, [screenSize]);

  return screenSize;
};

export default useSizeElement;
