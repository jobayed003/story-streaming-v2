import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase.config';
import AuthProvider from './AuthContext';
import VideoContextProvider from './VideoContext';

const StateContextProvider = createContext({
  selectedAvatar: {},
  setSelectedAvatar: () => {},
});

export const StateContext = ({ children }) => {
  const [clickedVideo, setClickedVideo] = useState();
  const [selectedAvatar, setSelectedAvatar] = useState({});
  const [favouriteVideos, setFavouriteVideos] = useState([]);

  const { userCredentials } = useContext(AuthProvider);
  const { videos } = useContext(VideoContextProvider);

  const auth = getAuth();

  // Checking if favourite video is also available in series
  const videosUniqueId = videos.map((vid) => vid.uniqueId);
  const favVideosUniqueID = favouriteVideos.map((vid) => vid.uniqueId);

  const VideoNotAvailableID = favVideosUniqueID.filter(
    (el) => !videosUniqueId.some((el1) => el === el1)
  );

  // const result = favVideosUniqueID.find((elem) => !videosUniqueId.includes(elem));
  // console.log(result);

  VideoNotAvailableID.forEach(async (id) => {
    const favouriteVidRef = doc(db, `users/${userCredentials.uid}/favourite_videos/${id}`);
    await deleteDoc(favouriteVidRef);
  });

  // Uploading Favourite Videos
  const uploadFavouriteVideos = async () => {
    const userFavouriteVideosRef = collection(
      db,
      'users',
      auth.currentUser.uid,
      'favourite_videos'
    );

    onSnapshot(userFavouriteVideosRef, async (querySnapshot) => {
      let favourite_videos = [];
      querySnapshot.forEach(async (doc) => {
        favourite_videos.push({ ...doc.data(), docId: doc.id });
      });

      setFavouriteVideos(favourite_videos);
    });
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        uploadFavouriteVideos();
      }
    });
    // console.log(userCredentials.avatarDetails

    setSelectedAvatar(userCredentials.avatarDetails);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCredentials.avatarDetails]);

  const contextValue = {
    clickedVideo,
    favouriteVideos,
    selectedAvatar,

    setClickedVideo,
    setSelectedAvatar,
  };

  return (
    <StateContextProvider.Provider value={contextValue}>{children}</StateContextProvider.Provider>
  );
};

export default StateContextProvider;
