import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase.config';
import AuthProvider from './AuthContext';
import VideoContextProvider from './VideoContext';

const StateContextProvider = createContext({
  selectedAvatar: {},
  setSelectedAvatar: () => {},
  filterVideos: () => {},
});

export const StateContext = ({ children }) => {
  const [clickedVideo, setClickedVideo] = useState('');
  const [searchedText, setSearchedText] = useState('');

  const [selectedAvatar, setSelectedAvatar] = useState({});
  const [favouriteVideos, setFavouriteVideos] = useState([]);
  const [searchedVideos, setSearchedVideos] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const [scrollId, setScrollId] = useState('');

  const { userCredentials } = useContext(AuthProvider);
  const { seriesVideos } = useContext(VideoContextProvider);

  const auth = getAuth();

  // Checking if favourite video is also available in series
  const allVidId = seriesVideos.map((vid) => vid.id);
  const favVideosId = favouriteVideos.map((vid) => vid.id);

  const VideoNotAvailableID = favVideosId.filter((el) => !allVidId.some((el1) => el === el1));
  // const result = favVideosId.find((elem) => !allVidId.includes(elem));
  // console.log(result);

  VideoNotAvailableID.forEach(async (id) => {
    const favouriteVidRef = doc(db, `users/${userCredentials.uid}/favourite_videos/${id}`);
    await deleteDoc(favouriteVidRef);
  });

  // Fetching Favourite Videos
  const fetchFavouriteVideos = async () => {
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

  const filterVideos = () => {
    const replaceAll = /\b(?:-| |,)\b/gi;
    const text = searchedText.toLowerCase().replace(replaceAll, '').trim();

    const regex = new RegExp(text, 'i');
    return seriesVideos.filter(
      (vid) =>
        regex.test(vid.title.replace(replaceAll, '').trim()) ||
        regex.test(vid.type.replace(replaceAll, '').trim()) ||
        regex.test(vid.genre.replace(replaceAll, '').trim()) ||
        regex.test(vid.description.replace(replaceAll, '').trim())
    );
  };

  useEffect(() => {
    clearTimeout(searchTimeout);

    setSearchTimeout(
      setTimeout(() => {
        setSearchedVideos(filterVideos());
      }, 100)
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchedText]);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        fetchFavouriteVideos();
      }
    });

    setSelectedAvatar(userCredentials.avatarDetails);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCredentials.avatarDetails]);

  const contextValue = {
    clickedVideo,
    favouriteVideos,
    selectedAvatar,
    scrollId,
    searchedVideos,
    searchedText,

    setClickedVideo,
    setScrollId,
    setSelectedAvatar,
    setSearchedText,
    filterVideos,
  };

  return (
    <StateContextProvider.Provider value={contextValue}>{children}</StateContextProvider.Provider>
  );
};

export default StateContextProvider;
