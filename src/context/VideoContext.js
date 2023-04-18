import { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchData } from '../youtubeUtils';

const VideoContextProvider = createContext({
  videos: [],
  videoUrls: [],
  seriesDetails: [],
  series: {},
});

const initialEpisode = {
  description: '',
  duration: 0,
  episode: 0,
  title: '',
  url: '',
};

export const VideoContext = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const [videoUrls, setVideoUrls] = useState([]);
  const [updated, setUpdated] = useState(false);

  const [series, setSeries] = useState({
    description: '',
    episodes: [initialEpisode],
    genre: '',
    title: '',
  });

  useEffect(() => {
    let videoUrl = [];

    (async () => {
      try {
        const data = await fetchData('series');
        setVideos(data);

        data.forEach((el) => {
          el.episodes.map((item) => videoUrl.push(item.url));
        });
        setVideoUrls(videoUrl);
      } catch {
        toast.error('Something Went Wrong!');
      }
    })();
  }, [updated, series]);

  const contextValue = {
    videos,
    videoUrls,
    updated,
    setUpdated,
    series,
    setSeries,
  };

  return (
    <VideoContextProvider.Provider value={contextValue}>{children}</VideoContextProvider.Provider>
  );
};

export default VideoContextProvider;
