import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase.config';
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

  const auth = getAuth();

  const uploadFavouriteBooks = async () => {
    const userFavouriteVideosRef = collection(
      db,
      'users',
      auth.currentUser.uid,
      'favourite_videos'
    );

    onSnapshot(userFavouriteVideosRef, async (querySnapshot) => {
      let favourite_videos = [];
      querySnapshot.forEach(async (doc) => {
        favourite_videos.push(doc.data());
      });
      setFavouriteVideos(favourite_videos);
    });
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        uploadFavouriteBooks();
      }
    });

    setSelectedAvatar(userCredentials.avatarDetails);
  }, []);

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
