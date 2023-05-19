import { getAuth } from 'firebase/auth';
import { useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import YouTube from 'react-youtube';
import VideoContextProvider from '../../context/VideoContext';
import Header from '../UI/Header';
import useDimension from '../hooks/useDimension';
import useLoadingState from '../hooks/useLoadingState';
import { getDuration } from '../util/videoUtil';

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
  const { height, width } = useDimension();
  let videoId = '';
  let title = '';

  const videoIDfromStorage = JSON.parse(localStorage.getItem('videoID'));

  if (videoIDfromStorage === undefined) {
    videoId = clickedVideo;
    // title = clickedVideo.episodes[0].title;
  } else {
    videoId = videoIDfromStorage;
    // title = videofromStorage.episodes[0].title;
  }
  const [details, setDetails] = useState({
    videoId,
    id: '',
    className: '',
    iframeClassName: '',
    style: {},
    title: '',
    loading: undefined,
    opts: {
      width,
      height,
      fullscreen: true,
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
        ccLoadPolicy: 0,
        controls: 1,
        loop: 1,
        modestbranding: 1,
        mute: 0,
        // playlistType: 'playlist',
        // playlist: videoId,
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
  const [watchTime, setWatchTime] = useState(0);
  const loadingState = useLoadingState();
  const [user] = useAuthState(getAuth());

  useEffect(() => {
    setDetails((prev) => ({ ...prev, opts: { ...prev.opts, width: width, height: height } }));
  }, [width, height]);

  return (
    <>
      {!user && videoId === '' && loadingState}
      {user && videoId !== '' && (
        <div>
          <Header />
          <div className='text-light'>
            {/* <h1>{title}</h1> */}
            <YouTube
              {...details}
              onPause={(e) => setWatchTime(getDuration(e.target.playerInfo.currentTime))}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Viewing;
