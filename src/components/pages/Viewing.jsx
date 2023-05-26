import { getAuth } from 'firebase/auth';
import { useContext, useEffect, useState } from 'react';
import { Button, Container, Modal } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import YouTube from 'react-youtube';
import VideoContextProvider from '../../context/VideoContext';
import Header from '../UI/Header';
import useDimension from '../hooks/useDimension';
import useLoadingState from '../hooks/useLoadingState';
import { getDuration } from '../util/videoUtil';
import classes from './Viewing.module.css';

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
  const [show, setShow] = useState(false);

  const loadingState = useLoadingState();
  const [user] = useAuthState(getAuth());

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

          <div className='d-flex justify-content-center p-4 cursor-pointer' onClick={handleShow}>
            <p className={`${classes.button}`}>Report issue</p>
          </div>

          <Modal show={show} onHide={handleClose} centered>
            <Modal.Body className='rounded ' style={{ backgroundColor: 'var(--gray-color)' }}>
              <h4>Report issues</h4>
              <p>
                Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac
                facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac,
                vestibulum at eros.
              </p>
            </Modal.Body>
          </Modal>
        </div>
      )}
    </>
  );
};

export default Viewing;
