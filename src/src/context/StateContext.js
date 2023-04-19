import { createContext, useContext, useEffect, useState } from 'react';
import AuthProvider from './AuthContext';

const StateContextProvider = createContext({
  selectedAvatar: {},
  setSelectedAvatar: () => {},
});

export const StateContext = ({ children }) => {
  const [clickedVideo, setClickedVideo] = useState();
  const [selectedAvatar, setSelectedAvatar] = useState({});
  const [favouriteVideos, setFavouriteVideos] = useState([]);
  const { userCredentials } = useContext(AuthProvider);

  useEffect(() => {
    setSelectedAvatar(userCredentials.avatarDetails);
  }, [userCredentials]);

  const contextValue = {
    clickedVideo,
    favouriteVideos,
    selectedAvatar,
    setFavouriteVideos,
    setClickedVideo,
    setSelectedAvatar,
  };

  return (
    <StateContextProvider.Provider value={contextValue}>{children}</StateContextProvider.Provider>
  );
};

export default StateContextProvider;
