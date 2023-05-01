import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase.config';
import AuthProvider from './AuthContext';
import VideoContextProvider from './VideoContext';

const StateContextProvider = createContext({
  selectedAvatar: {},
  setSelectedAvatar: () => {},
});

export const StateContext = ({ children }) => {
  const [clickedVideo, setClickedVideo] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState({});
  const [favouriteVideos, setFavouriteVideos] = useState([]);

  const { userCredentials } = useContext(AuthProvider);
  const { seriesVideos } = useContext(VideoContextProvider);

  const auth = getAuth();

  // Checking if favourite video is also available in series
  const videosUniqueId = seriesVideos.map((vid) => vid.id);
  const favVideosUniqueID = favouriteVideos.map((vid) => vid.id);

  const VideoNotAvailableID = favVideosUniqueID.filter(
    (el) => !videosUniqueId.some((el1) => el === el1)
  );
  // const result = favVideosUniqueID.find((elem) => !videosUniqueId.includes(elem));
  // console.log(result);
  VideoNotAvailableID.forEach(async (id) => {
    const favouriteVidRef = doc(db, `users/${userCredentials.uid}/favourite_videos/${id}`);
    await deleteDoc(favouriteVidRef);
  });

  // Fetching Favourite Videos
  const fetchingFavouriteVideos = async () => {
    const userFavouriteVideosRef = query(
      collection(db, 'users', auth.currentUser.uid, 'favourite_videos'),
      orderBy('timestamp', 'asc')
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
        fetchingFavouriteVideos();
      }
    });

    setSelectedAvatar(userCredentials.avatarDetails);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCredentials.avatarDetails]);

  // console.log(selectedAvatar);

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
