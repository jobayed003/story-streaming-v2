import { useContext, useState } from 'react';
import YouTube from 'react-youtube';
import VideoContextProvider from '../context/VideoContext';

function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

function getHeight() {
  return (
    Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.documentElement.clientHeight
    ) - 100
  );
}

const Viewing = () => {
  const { clickedVideo } = useContext(VideoContextProvider);

  let videoId = '';
  let title = '';

  const videofromStorage = JSON.parse(localStorage.getItem('video'));

  if (videofromStorage === undefined) {
    videoId = clickedVideo.episodes[0].id;
    title = clickedVideo.episodes[0].title;
  } else {
    videoId = videofromStorage.episodes[0].id;
    title = videofromStorage.episodes[0].title;
  }

  const [details, setDetails] = useState({
    videoId,
    id: '',
    className: '',
    iframeClassName: '',
    style: {},
    title: 'hello WOrld',
    loading: undefined,
    opts: {
      height: getHeight(),
      width: getWidth(),
      fullscreen: true,
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
        ccLoadPolicy: 0,
        controls: 1,
        loop: 1,
        modestbranding: 1,
        mute: 0,
        playlistType: 'playlist',
        playlist: videoId,
        rel: 0,
      },
    },
    onReady: () => {},
    onPlay: () => {},
    onPause: () => {},
    onEnd: () => {},
    onError: () => {},
    onStateChange: () => {},
    onPlaybackRateChange: () => {},
    onPlaybackQualityChange: () => {},
  });
  return (
    <div style={{ height: getHeight() }} className='text-light'>
      <h1>{title}</h1>
      <YouTube {...details} />
    </div>
  );
};

export default Viewing;
