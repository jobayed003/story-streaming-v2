import { getAuth } from 'firebase/auth';
import { motion } from 'framer-motion';
import { useContext, useRef, useState } from 'react';
import { Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';

import { useNavigate } from 'react-router-dom';
import YouTube from 'react-youtube';
import AuthProvider from '../context/AuthContext';
import StateContextProvider from '../context/StateContext';
import VideoContextProvider from '../context/VideoContext';
import { createCheckoutSession } from '../stripe/createCheckoutSession';
import './Dashboard.css';
import Header from './UI/Header';
import useOutsideHover from './hooks/useOutsideHover';
import useThumbnail from './hooks/useThumbnail';
import Footer from './util/Footer';
import Slide from './util/Slide';

const Dashboard = () => {
  const navigate = useNavigate();

  const { isAuthenticated } = useContext(AuthProvider);
  const { videos, videoUrls } = useContext(VideoContextProvider);

  // custom hook for generating thumbnail from url
  const thumbnail = useThumbnail(videoUrls);

  if (!isAuthenticated) {
    navigate('/');
    return (
      <Row className='mb-5 mt-5 justify-content-center'>
        <Spinner animation='border' role='status' style={{ width: '50px', height: '50px' }}>
          <span className='visually-hidden'>Loading...</span>
        </Spinner>
      </Row>
    );
  }

  return (
    <div>
      {/* nav-start */}
      <Header />
      {/* nav-end */}
      {/* list-start */}
      <Container
        as='section'
        id='movies'
        className='listsection py-2 fontFamily'
        style={{ position: 'relative' }}
      >
        <Row className='mt-5' id='top-trending'>
          <Col className='mt-5 text-light'>
            <h1>Top Trending</h1>
          </Col>
        </Row>

        <Slide videosCount={videos.length}>
          {videos.map((el, idx) => (
            <div className='slide' key={Math.random() + idx} style={{ width: '400px' }}>
              <ListCard imgSrc={thumbnail[idx]} videoDetails={el} />
            </div>
          ))}
        </Slide>
        <Row>
          <Col className='text-light' id={'my-list'}>
            <h1>My List</h1>
          </Col>
        </Row>

        <Slide videosCount={videos.length}>
          {videos.map((el, idx) => (
            <div
              id='my-list'
              className='slide'
              key={Math.random() + idx}
              style={{ width: '400px' }}
            >
              <ListCard imgSrc={thumbnail[idx]} videoDetails={el} />
            </div>
          ))}
        </Slide>
      </Container>
      {/* list-end */}
      {/* footer-start */}
      <Footer />
    </div>
  );
};

export default Dashboard;

const ListCard = ({ imgSrc, videoDetails }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const { setClickedVideo } = useContext(StateContextProvider);
  // useOutsideHover(ref, () => setHovered(false));

  const handleClick = () => {
    setClickedVideo(videoDetails);
    localStorage.removeItem('video');
    localStorage.setItem('video', JSON.stringify(videoDetails));
    navigate(`/watch/${videoDetails.uniqueId}`);
  };

  const opts = {
    height: '300',
    width: '450',
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div>
      {!hovered && (
        <motion.div
          className='box'
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.3,
            delay: 0,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        >
          <img
            src={imgSrc}
            alt='thumbnail'
            width={'300px'}
            onMouseEnter={() => {
              setHovered(true);
            }}
          />
        </motion.div>
      )}
      {hovered && (
        <motion.div
          className='box'
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.3,
            delay: 0,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          style={{ width: '100%', position: 'relative' }}
        >
          <Card
            style={{
              width: '100%',
              fontFamily: 'Roboto',
              background: 'gray',
              zIndex: '1000000',
              fontSize: '1.5rem',
            }}
            onMouseLeave={() => setHovered(false)}
            onClick={handleClick}
          >
            <YouTube videoId={videoDetails.episodes[0].id} opts={opts} onPause={handleClick} />

            <Card.Body className='cursor-pointer'>
              <div className='d-flex align-items-center justify-content-between'>
                <div>
                  <Card.Title className='display-6' style={{ fontWeight: 'bold' }}>
                    {videoDetails.title}
                  </Card.Title>
                  <Card.Text style={{ margin: 0 }}>{videoDetails.description}</Card.Text>
                </div>
                <Button
                  variant='success'
                  style={{
                    color: '#fff',
                    fontSize: '1.5rem',
                  }}
                >
                  Fullscreen
                </Button>
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export const Test = () => {
  const [user, userLoading] = useAuthState(getAuth());

  return (
    <div>
      {user && !userLoading && (
        <>
          <h1>Hello, {user.displayName}</h1>
          <button onClick={() => createCheckoutSession(user.uid)}>Upgrade to premium!</button>
        </>
      )}
    </div>
  );
};

// https://github.com/jobayed003/story-streaming-v2.git
// https://github.com/Hunter84/story-streaming.git
