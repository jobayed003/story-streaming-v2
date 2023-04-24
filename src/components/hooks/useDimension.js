import { useEffect, useState } from 'react';

const getCurrentDimension = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};
const useDimension = () => {
  const [screenSize, setScreenSize] = useState(getCurrentDimension());

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

export default useDimension;
