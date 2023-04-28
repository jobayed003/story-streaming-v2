import { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchVideos } from '../components/util/videoUtil';

const VideoContextProvider = createContext({
  seriesVideos: [],
  videoUrls: [],
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
};

export const VideoContext = ({ children }) => {
  const [seriesVideos, setSeriesVideos] = useState([]);

  const [seriesDetails, setSeriesDetails] = useState({
    description: '',
    episodes: [initialEpisode],
    genre: '',
    title: '',
    type: 'series',
  });

  const getVideoUrls = (videos) => {
    let videoUrl = [];

    videos.forEach((el) => {
      videoUrl.push(el.episodes[0].url);
      // el.episodes.forEach((item) => videoUrl.push(item.url));
    });

    return videoUrl;
  };

  useEffect(() => {
    (async () => {
      try {
        setSeriesVideos(await fetchVideos());
      } catch {
        toast.error('Something Went Wrong!');
      }
    })();
  }, []);

  const contextValue = {
    seriesDetails,
    seriesVideos,
    getVideoUrls,

    setSeriesDetails,
  };

  return (
    <VideoContextProvider.Provider value={contextValue}>{children}</VideoContextProvider.Provider>
  );
};

export default VideoContextProvider;
