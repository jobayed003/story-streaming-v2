/* eslint-disable react-hooks/exhaustive-deps */
import EmojiPicker from 'emoji-picker-react';
import { getAuth } from 'firebase/auth';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import moment from 'moment/moment';
import { useContext, useEffect, useRef, useState } from 'react';
import { Button, Container, Form, Image, InputGroup, Modal } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaSmile, FaTimes } from 'react-icons/fa';
import { MdOutlineReportProblem } from 'react-icons/md';
import { useLocation } from 'react-router-dom';
import YouTube from 'react-youtube';
import ChevronDownIcon from '../../assets/Icons/chevron-down.svg';
import AuthProvider from '../../context/AuthContext';
import StateContextProvider from '../../context/StateContext';
import { db } from '../../firebase.config';
import Header from '../UI/Header';
import useDimension from '../hooks/useDimension';
import { useIsVisible } from '../hooks/useIsVisible';
import useLoadingState from '../hooks/useLoadingState';
import { getDuration, getSeriesData } from '../util/videoUtil';
import './Viewing.css';

// function getWidth() {
//   return Math.max(
//     document.body.scrollWidth,
//     document.documentElement.scrollWidth,
//     document.body.offsetWidth,
//     document.documentElement.offsetWidth,
//     document.documentElement.clientWidth
//   );
// }

// function getHeight() {
//   return (
//     Math.max(
//       document.body.scrollHeight,
//       document.documentElement.scrollHeight,
//       document.body.offsetHeight,
//       document.documentElement.offsetHeight,
//       document.documentElement.clientHeight
//     ) - 100
//   );
// }

const Viewing = () => {
  const { height, width } = useDimension();
  const [video, setVideo] = useState({});
  const [details, setDetails] = useState({
    // videoId: ,
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
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [episode, setEpisode] = useState({});
  const [episodeNumber, setEpisodeNumber] = useState(1);
  const [show, setShow] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  const loadingState = useLoadingState();
  const [user] = useAuthState(getAuth());

  const path = useLocation().pathname.replace('/watch/', '');

  const { clickedEpisode } = useContext(StateContextProvider);

  const handleShow = () => setShow(true);

  useEffect(() => {
    const getVideo = async () => {
      const data = await getSeriesData(path);
      setVideo(data);
      setIsAvailable(true);
    };
    getVideo();

    const videofromStorage = JSON.parse(localStorage.getItem('videoEp'));
    if (videofromStorage === undefined) {
      setEpisode(clickedEpisode);
    } else {
      setEpisode(videofromStorage);
    }

    setDetails((prev) => ({ ...prev, opts: { ...prev.opts, width: width, height: height } }));
  }, [width, height, path]);

  useEffect(() => {
    if (isAvailable) {
      const totalSeason = [...new Set(video.episodes.map((el) => el.season))];
      setSeasons(totalSeason);
      getEpisodes(episode.season);
    }
  }, [isAvailable]);

  const getEpisodes = (season) => {
    const selectedSeasonEp = video.episodes.filter((ep) => ep.season === +season);
    // const selectedEpNumber = selectedSeasonEp.findIndex((el) => el.episode === episode.episode);

    setEpisodes(selectedSeasonEp);
  };

  return (
    <>
      {!user && episode.id === '' && loadingState}
      {user && episode.id !== '' && (
        <div>
          <Header />
          <div className='text-light'>
            <YouTube
              {...details}
              videoId={episode.id}
              onPause={(e) => setWatchTime(getDuration(e.target.playerInfo.currentTime))}
            />
          </div>

          <div className='d-flex justify-content-around align-items-center flex-column-reverse flex-sm-row p-4 gap-2 gap-sm-0 cursor-pointer'>
            <p className={`d-flex align-items-center button m-0 gap-1`} onClick={handleShow}>
              <MdOutlineReportProblem />
              <span className='mt-1'>Report</span>
            </p>
            <div className='d-flex  gap-2'>
              <Form.Select
                aria-label='Season No. Select'
                className='text-white align-self-end cursor-pointer '
                style={{
                  width: 'max-content',
                  backgroundColor: 'var(--gray-color)',
                  backgroundImage: `url(${ChevronDownIcon})`,
                }}
                onChange={(e) => getEpisodes(e.target.value)}
              >
                {seasons.map((season) => (
                  <option selected={episode.season === season} value={season}>
                    Season {season}
                  </option>
                ))}
              </Form.Select>
              <Form.Select
                className='text-white align-self-end cursor-pointer '
                style={{
                  width: 'max-content',
                  backgroundColor: 'var(--gray-color)',
                  backgroundImage: `url(${ChevronDownIcon})`,
                }}
                onChange={(e) => {
                  setEpisodeNumber(+e.target.value);
                  setEpisode(episodes[+e.target.value - 1]);
                  localStorage.removeItem('videoEp');
                  localStorage.setItem('videoEp', JSON.stringify(episodes[+e.target.value - 1]));
                }}
              >
                {!episodes.every((ep) => episode.season === ep.season) && (
                  <option value='' selected hidden>
                    Select Episode
                  </option>
                )}
                {isAvailable &&
                  episodes.map((ep, idx) => (
                    <option
                      selected={episode.season === ep.season && episode.episode === ep.episode}
                      value={idx + 1}
                    >
                      Episode {idx + 1}
                    </option>
                  ))}
              </Form.Select>
            </div>
          </div>
          <Report
            show={show}
            setShow={setShow}
            seriesTitle={video.title}
            episode={episode}
            episodeNumber={episodeNumber}
          />
          <Chat path={path} />
        </div>
      )}
    </>
  );
};

export default Viewing;

const Report = ({ show, setShow, seriesTitle, episode, episodeNumber }) => {
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
            <h5 style={{ color: 'var(--text-color)', alignSelf: 'start' }}>{seriesTitle}</h5>
            <span>Season {episode.season}</span>
            <span>Episode {episodeNumber}</span>

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

const Chat = ({ path }) => {
  const [message, setMessage] = useState('');
  const [isClicked, setIsClicked] = useState(false);
  const [messages, setMessages] = useState([]);

  const { width } = useDimension();

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

    if (messages.length <= 0) {
      await setDoc(chatRef, { chats: [details] });
      setMessage('');
      return;
    }

    let d;
    d = messages[0];
    delete d.id;

    d['chats'].push(details);

    if (Object.keys(d).includes('chats')) {
      await setDoc(chatRef, { ...d });
    }
    // } else {}
    //   await updateDoc(chatRef, { ['episode' + episode]: { chats: [details] } });
    // }
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

      {messages.length > 0 && <ChatBox messages={messages} />}
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
          <div
            style={{
              position: 'absolute',
              top: '-28.3rem',
              right: width > 400 ? '5rem ' : '1rem',
            }}
          >
            <EmojiPicker
              width={width > 400 ? 400 : 320}
              emojiStyle='facebook'
              theme='dark'
              onEmojiClick={addEmoji}
            />
          </div>
        )}

        <Button variant='primary' type='submit' onClick={sendMessage}>
          Send
        </Button>
      </div>
    </Container>
  );
};

const ChatBox = ({ messages }) => {
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
      {Object.keys(messages[0]).includes('chats') &&
        messages[0]['chats']
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
