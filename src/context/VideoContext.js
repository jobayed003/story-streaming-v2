import { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchVideos } from '../components/util/videoUtil';

const VideoContextProvider = createContext({
  seriesVideos: [],
  series: {},

  setSeriesVideos: () => {},
  setSeriesDetails: () => {},
});

const initialEpisode = {
  description: '',
  duration: 0,
  episode: 0,
  title: '',
  url: '',
  season: 1,
};

export const VideoContext = ({ children }) => {
  const [seriesVideos, setSeriesVideos] = useState([]);
  const [updated, setUpdated] = useState(false);

  const [seriesDetails, setSeriesDetails] = useState({
    description: '',
    episodes: [initialEpisode],
    genre: '',
    title: '',
    type: 'movies',
  });

  const musicsAndPodcast = seriesVideos.filter(
    (vid) => vid.type === 'musics' || vid.type === 'podcast'
  );
  const tvShows = seriesVideos.filter((vid) => vid.type === 'tv-shows');
  const movies = seriesVideos.filter((vid) => vid.type === 'movies');
  const documentary = seriesVideos.filter((vid) => vid.type === 'documentary');

  useEffect(() => {
    const getVideos = async () => {
      try {
        setSeriesVideos(await fetchVideos());
      } catch {
        toast.error('Something Went Wrong!');
      }
    };
    getVideos();
  }, [updated]);

  const contextValue = {
    seriesDetails,
    seriesVideos,
    musicsAndPodcast,
    tvShows,
    movies,
    documentary,

    setUpdated,
    setSeriesDetails,
  };

  return (
    <VideoContextProvider.Provider value={contextValue}>{children}</VideoContextProvider.Provider>
  );
};

export default VideoContextProvider;
