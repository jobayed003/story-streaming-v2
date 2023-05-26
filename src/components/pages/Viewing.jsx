import { getAuth } from 'firebase/auth';
import { useContext, useEffect, useState } from 'react';
import { Button, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import { MdOutlineReportProblem } from 'react-icons/md';
import YouTube from 'react-youtube';
import VideoContextProvider from '../../context/VideoContext';
import Header from '../UI/Header';
import useDimension from '../hooks/useDimension';
import useLoadingState from '../hooks/useLoadingState';
import { getDuration } from '../util/videoUtil';
import './Viewing.css';

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
  let videoDetails = {};

  const videofromStorage = JSON.parse(localStorage.getItem('video'));

  if (videofromStorage === undefined) {
    videoDetails = clickedVideo;
  } else {
    videoDetails = videofromStorage;
  }
  const [details, setDetails] = useState({
    videoId: videoDetails.id,
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
  const [reports, setReports] = useState({
    isVideoWrong: false,
    isLinkBroken: false,
    isAudioNotSynced: false,
    isSubtitleNotSynced: false,
    isSkipTimeWrong: false,
    other: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const loadingState = useLoadingState();
  const [user] = useAuthState(getAuth());

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = ({ target }) => {
    if (target.type === 'checkbox') {
      setReports({ ...reports, [target.name]: target.checked });
    } else if (target.type === 'textarea') {
      setReports({ ...reports, other: target.value });
    }
  };

  const handleReportSubmit = () => {
    setIsLoading(true);

    setTimeout(() => {
      handleClose();
      setIsLoading(false);
    }, 2000);
  };

  useEffect(() => {
    setDetails((prev) => ({ ...prev, opts: { ...prev.opts, width: width, height: height } }));
  }, [width, height]);

  return (
    <>
      {!user && videoDetails.id === '' && loadingState}
      {user && videoDetails.id !== '' && (
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
            <p className={`d-flex align-items-center button m-0 gap-1`}>
              <MdOutlineReportProblem />
              <span className='mt-1'>Report</span>
            </p>
          </div>

          <Modal show={show} onHide={handleClose} centered>
            <Modal.Body
              className='p-4 rounded'
              style={{ backgroundColor: 'var(--gray-color)', overflow: 'hidden' }}
            >
              <div className='d-flex flex-column gap-2'>
                <h3>Report an Issue</h3>
                <span style={{ fontSize: '.9rem', color: 'var(--footer-text-color)' }}>
                  Please let us know what's wrong so we can fix it as soon as possible.
                </span>

                <div
                  className='d-flex flex-column'
                  style={{ fontSize: '.9rem', color: 'var(--footer-text-color)' }}
                >
                  <h5 style={{ color: 'var(--text-color)', alignSelf: 'start' }}>
                    {videoDetails.seriesTitle}
                  </h5>
                  <span>Season {videoDetails.season}</span>
                  <span>Episode {videoDetails.episode}</span>

                  <div
                    className='my-4 customFormLabel'
                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
                  >
                    <div>
                      <Form.Label>Video:</Form.Label>
                      <Form.Check
                        onChange={handleChange}
                        label='Wrong Video'
                        type='checkbox'
                        name='isVideoWrong'
                        id={'inline-checkbox-1'}
                      />
                      <Form.Check
                        onChange={handleChange}
                        label='Broken Link'
                        type='checkbox'
                        id={'inline-checkbox-2'}
                        name='isLinkBroken'
                      />
                    </div>

                    <div>
                      <Form.Label>Audio:</Form.Label>
                      <Form.Check
                        onChange={handleChange}
                        label='Not Synced'
                        type='checkbox'
                        name='isAudioNotSynced'
                        id={'inline-checkbox-3'}
                      />
                    </div>
                    <div>
                      <Form.Label>Subtitle:</Form.Label>
                      <Form.Check
                        onChange={handleChange}
                        label='Not Synced'
                        type='checkbox'
                        name='isSubtitleNotSynced'
                        id={'inline-checkbox-4'}
                      />
                    </div>
                    <div>
                      <Form.Label>Skip time:</Form.Label>
                      <Form.Check
                        onChange={handleChange}
                        label='Wrong'
                        type='checkbox'
                        name='isSkipTimeWrong'
                        id={'inline-checkbox-5'}
                      />
                    </div>
                  </div>

                  <Form.Label style={{ fontSize: '1rem', color: '#fff' }}>Other:</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={3}
                    onChange={handleChange}
                    id={'other'}
                    style={{ backgroundColor: '#292929', color: '#888' }}
                    className={`textArea`}
                  />
                </div>
                <Button
                  className='mt-3'
                  style={{
                    background: 'var(--button-color)',
                    border: 'none',
                    height: '2.5rem',
                  }}
                  onClick={handleReportSubmit}
                >
                  {isLoading ? (
                    <div className='d-flex justify-content-center'>
                      <div>Sending...</div>
                    </div>
                  ) : (
                    'Send report'
                  )}
                </Button>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      )}
    </>
  );
};

export default Viewing;
