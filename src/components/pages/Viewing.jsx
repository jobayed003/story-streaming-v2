import EmojiPicker from 'emoji-picker-react';
import { getAuth } from 'firebase/auth';
import { collection, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import moment from 'moment/moment';
import { useContext, useEffect, useRef, useState } from 'react';
import { Button, Container, Form, Image, InputGroup, Modal } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaSmile, FaTimes } from 'react-icons/fa';
import { MdOutlineReportProblem } from 'react-icons/md';
import { useLocation } from 'react-router-dom';
import YouTube from 'react-youtube';
import AuthProvider from '../../context/AuthContext';
import VideoContextProvider from '../../context/VideoContext';
import { db } from '../../firebase.config';
import Header from '../UI/Header';
import useDimension from '../hooks/useDimension';
import { useIsVisible } from '../hooks/useIsVisible';
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

  const loadingState = useLoadingState();
  const [user] = useAuthState(getAuth());

  const handleShow = () => setShow(true);

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
            <YouTube
              {...details}
              onPause={(e) => setWatchTime(getDuration(e.target.playerInfo.currentTime))}
            />
          </div>

          <div className='d-flex justify-content-center p-4 cursor-pointer'>
            <p className={`d-flex align-items-center button m-0 gap-1`} onClick={handleShow}>
              <MdOutlineReportProblem />
              <span className='mt-1'>Report</span>
            </p>
          </div>
          <Report show={show} setShow={setShow} videoDetails={videoDetails} />
          <Chat episode={videoDetails.episode} />
        </div>
      )}
    </>
  );
};

export default Viewing;

const Report = ({ show, setShow, videoDetails }) => {
  const [reports, setReports] = useState({
    isVideoWrong: false,
    isLinkBroken: false,
    isAudioNotSynced: false,
    isSubtitleNotSynced: false,
    isSkipTimeWrong: false,
    other: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleClose = () => setShow(false);

  const handleChange = ({ target }) => {
    if (target.type === 'checkbox') {
      setReports({ ...reports, [target.name]: target.checked });
    } else if (target.type === 'textarea') {
      setReports({ ...reports, other: target.value });
    }
  };

  const handleReportSubmit = () => {
    const isNotEmpty = Object.values(reports).some((value) => value === true);
    if (!isNotEmpty) {
      setIsError(true);
      return;
    }
    setIsLoading(true);
    setIsError(false);
    setTimeout(() => {
      handleClose();
      setIsLoading(false);
    }, 2000);
  };

  return (
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
          {isError && (
            <div
              className='p-2 rounded d-flex justify-content-between align-items-center gap-3'
              style={{ background: '#F0a6ad', color: '#722F43' }}
            >
              <p className='m-0'>Report data must not be empty!</p>
              <FaTimes onClick={() => setIsError(false)} cursor={'pointer'} />
            </div>
          )}
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
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem' }}
            >
              <div>
                <Form.Label>Video:</Form.Label>
                <Form.Check
                  onChange={handleChange}
                  label='Wrong Video'
                  type='checkbox'
                  checked={reports.isVideoWrong}
                  name='isVideoWrong'
                  id={'inline-checkbox-1'}
                />
                <Form.Check
                  onChange={handleChange}
                  label='Broken Link'
                  type='checkbox'
                  id={'inline-checkbox-2'}
                  name='isLinkBroken'
                  checked={reports.isLinkBroken}
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
                  checked={reports.isAudioNotSynced}
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
                  checked={reports.isSubtitleNotSynced}
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
                  checked={reports.isSkipTimeWrong}
                />
              </div>
            </div>

            <Form.Label style={{ fontSize: '1rem', color: '#fff' }}>Other:</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              onChange={handleChange}
              id={'other'}
              value={reports.other}
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
            disabled={isLoading}
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
  );
};

const Chat = ({ episode }) => {
  const [message, setMessage] = useState('');
  const [isClicked, setIsClicked] = useState(false);
  const [messages, setMessages] = useState([]);

  const path = useLocation().pathname.replace('/watch/', '');

  const { userCredentials } = useContext(AuthProvider);

  const details = {
    userDetails: { name: userCredentials.name, avatar: userCredentials.avatarDetails.avatar },
    time: new Date(),
    message: message,
  };

  const sendMessage = async () => {
    const chatRef = doc(db, 'chats', path);
    if (message === '') {
      return;
    }
    let d;
    if (messages.length <= 0) {
      await setDoc(chatRef, { ['episode' + episode]: { chats: [details] } });
      setMessage('');
      return;
    }

    d = messages[0];
    delete d.id;
    if (Object.keys(d).includes('episode' + episode)) {
      d['episode' + episode]['chats'].push(details);
      await setDoc(chatRef, { ...d });
    } else {
      await updateDoc(chatRef, { ['episode' + episode]: { chats: [details] } });
    }
    setMessage('');
  };

  useEffect(() => {
    const collectionRef = collection(db, 'chats');

    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages.filter((el) => el.id === path));
    });
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addEmoji = (e) => {
    let sym = e.unified.split('-');
    let codesArray = [];
    sym.forEach((el) => codesArray.push('0x' + el));
    let emoji = String.fromCodePoint(...codesArray);
    setMessage(message + emoji);
  };
  return (
    <Container className='d-flex flex-column'>
      <h1>Chat</h1>

      {messages.length > 0 && <ChatBox messages={messages} episode={episode} />}
      <div className='d-flex gap-3 align-items-center my-4' style={{ position: 'relative' }}>
        <Image src={userCredentials.avatarDetails.avatar} width={'40px'} height={'40px'} />

        <InputGroup style={{ flexGrow: '1' }}>
          <Form.Control
            type='text'
            placeholder='Write your message here'
            value={message}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
            onChange={(e) => setMessage(e.target.value)}
          />

          <InputGroup.Text onClick={() => setIsClicked(!isClicked)} className='cursor-pointer'>
            <FaSmile />
          </InputGroup.Text>
        </InputGroup>
        {isClicked && (
          <div style={{ position: 'absolute', top: '2.5rem', right: '4.5rem' }}>
            <EmojiPicker emojiStyle='facebook' theme='dark' onEmojiClick={addEmoji} />
          </div>
        )}

        <Button variant='primary' type='submit' onClick={sendMessage}>
          Send
        </Button>
      </div>
    </Container>
  );
};

const ChatBox = ({ messages, episode }) => {
  const messageBoxRef = useRef(null);
  const messagesEndRef = useRef(null);
  const isVisible = useIsVisible(messageBoxRef);

  const compareDates = (millis1) => {
    const present = Date.now();
    const date1 = new Date(millis1);
    const date2 = new Date(present);
    const moment1 = moment(date1);
    const moment2 = moment(date2);
    const difference = moment.duration(moment2.diff(moment1));
    return {
      date1,
      date2,
      difference,
    };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    isVisible && scrollToBottom();
  }, [isVisible, messages]);

  return (
    <div
      style={{
        maxHeight: '400px',
        overflow: 'hidden scroll',
      }}
      className='hide-scroll'
      ref={messageBoxRef}
    >
      {Object.keys(messages[0]).includes('episode' + episode) &&
        messages[0]['episode' + episode]['chats']
          .sort((a, b) => a.time - b.time)
          .map((el) => (
            <div
              className='py-2'
              style={{
                display: 'grid',
                gridTemplateColumns: '200px 1fr',
                alignItems: 'center',
              }}
            >
              <div className='d-flex align-items-center gap-2 pt-4'>
                <Image src={el.userDetails.avatar} width={'40px'} height={'40px'} />
                <div>
                  <p style={{ color: 'var(--text-color)' }} className='m-0'>
                    {el.userDetails.name}
                  </p>
                  <p className='m-0' style={{ fontSize: '.9rem' }}>
                    {}
                    {compareDates(
                      el.time.seconds * 1000 + el.time.nanoseconds / 1000000
                    ).difference.humanize() + ' ago'}
                  </p>
                </div>
              </div>
              <p style={{ margin: '0', marginTop: '2rem', wordWrap: 'break-word' }}>{el.message}</p>
            </div>
          ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
