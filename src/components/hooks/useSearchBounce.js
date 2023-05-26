import { useEffect, useState } from 'react';

const useSearchDebounce = (delay = 350) => {
  const [search, setSearch] = useState(null);
  const [searchQuery, setSearchQuery] = useState(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const delayFn = setTimeout(() => setSearch(searchQuery), delay);
    return () => clearTimeout(delayFn);
  }, [searchQuery, delay]);

  return [search, setSearchQuery, index, setIndex];
};

export default useSearchDebounce;
