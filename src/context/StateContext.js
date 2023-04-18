import { createContext, useEffect, useState } from 'react';

const StateContextProvider = createContext({
  selectedAvatar: {},
  setSelectedAvatar: () => {},
});

export const StateContext = ({ children }) => {
  const [selectedAvatar, setSelectedAvatar] = useState({});

  const contextValue = {
    selectedAvatar,
    setSelectedAvatar,
  };

  return (
    <StateContextProvider.Provider value={contextValue}>{children}</StateContextProvider.Provider>
  );
};

export default StateContextProvider;
