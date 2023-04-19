import { getAuth } from 'firebase/auth';
import { motion } from 'framer-motion';
import { useContext, useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';

import { FaHeart } from 'react-icons/fa';
import { Navigate, useNavigate } from 'react-router-dom';
import YouTube from 'react-youtube';
import AuthProvider from '../context/AuthContext';
import StateContextProvider from '../context/StateContext';
import VideoContextProvider from '../context/VideoContext';
import { createCheckoutSession } from '../stripe/createCheckoutSession';
import './Dashboard.css';
import Header from './UI/Header';
import useSizeElement from './hooks/useSizeElement';
import useThumbnail from './hooks/useThumbnail';
import Footer from './util/Footer';
import Slide from './util/Slide';

const Dashboard = () => {
  const { favouriteVideos } = useContext(StateContextProvider);
  const { isAuthenticated } = useContext(AuthProvider);
  const { videos, videoUrls } = useContext(VideoContextProvider);

  // custom hook for generating thumbnail from url
  const thumbnail = useThumbnail(videoUrls);
  const size = useSizeElement();

  if (!isAuthenticated) {
    return <Navigate to='/' />;
  }

  return (
    <>
      <Header />
      <Container
        as='section'
        id='movies'
        className='listsection py-2 fontFamily overflow-hidden'

        // style={{ position: 'relative' }}
      >
        {/* Top trending videos list */}
        <Row className='mt-5' id='top-trending'>
          <Col className='mt-5 text-light'>
            <h1>Top Trending</h1>
          </Col>
        </Row>

        {videos.length <= 0 ? (
          <Row>
            <Col className='my-5 text-light text-center'>
              <h1>No Videos Found!</h1>
            </Col>
          </Row>
        ) : videos.length <= 4 ? (
          <div
            className='d-flex justify-content-center'
            style={{ gap: '4rem', flexWrap: 'wrap', marginBottom: '4rem' }}
          >
            {videos.map((el, idx) => (
              <ListCard imgSrc={thumbnail[idx]} videoDetails={el} />
            ))}
          </div>
        ) : (
          <Slide videosCount={videos.length}>
            {videos.map((el, idx) => (
              <div
                className='slide'
                key={Math.random() + idx}
                style={{ width: size > 500 ? '400px' : '300px' }}
              >
                <ListCard imgSrc={thumbnail[idx]} videoDetails={el} />
              </div>
            ))}
          </Slide>
        )}

        {/* Favourite Videos List */}
        <Row>
          <Col className='text-light' id={'my-list'}>
            <h1>My List</h1>
          </Col>
        </Row>

        {favouriteVideos.length <= 0 ? (
          <Row>
            <Col className='my-5 text-light text-center'>
              <h1>No Videos Found!</h1>
            </Col>
          </Row>
        ) : favouriteVideos.length <= 4 ? (
          <div className='d-flex justify-content-center' style={{ gap: '4rem', flexWrap: 'wrap' }}>
            {favouriteVideos.map((el, idx) => [
              <ListCard imgSrc={thumbnail[idx]} videoDetails={el} />,
            ])}
          </div>
        ) : (
          <Slide videosCount={videos.length}>
            {favouriteVideos.map((el, idx) => (
              <div
                id='my-list'
                className='slide'
                key={Math.random() + idx}
                style={{ width: size > 500 ? '400px' : '300px' }}
              >
                <ListCard imgSrc={thumbnail[idx]} videoDetails={el} />
              </div>
            ))}
          </Slide>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default Dashboard;

const ListCard = ({ imgSrc, videoDetails }) => {
  const [hovered, setHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [coordinates, setCoordinates] = useState({ left: 0, right: 0 });

  const ref = useRef();

  const size = useSizeElement();

  const navigate = useNavigate();

  const { favouriteVideos, setClickedVideo, setFavouriteVideos } = useContext(StateContextProvider);
  // const {videos, } = useContext();
  // useOutsideHover(ref, () => setHovered(false));

  const handleClick = () => {
    setClickedVideo(videoDetails);
    localStorage.removeItem('video');
    localStorage.setItem('video', JSON.stringify(videoDetails));
    navigate(`/watch/${videoDetails.uniqueId}`);
  };

  const bodyRect = document.body.getBoundingClientRect();

  const getPosition = (el) => {
    const elemRect = el.getBoundingClientRect();
    setCoordinates({ left: elemRect.left, right: elemRect.right });
  };

  const opts = {
    height: '300',
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  };

  const conditionalStyle =
    coordinates.left < bodyRect.width - coordinates.left
      ? 'translateX(4rem)'
      : coordinates.right > bodyRect.width - coordinates.right && 'translateX(-4rem)';

  return (
    <div className='position-relative' ref={ref}>
      <motion.div
        className='box'
        style={{ zIndex: '-2' }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.3,
          delay: 0,
          ease: [0, 0.71, 0.2, 1.01],
        }}
        onMouseEnter={() => {
          getPosition(ref.current);
          setHovered(true);
        }}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={imgSrc}
          alt='thumbnail'
          width={size > 500 ? '300px' : '250px'}
          className='cursor-pointer'
        />
      </motion.div>

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
          onMouseEnter={() => {
            setHovered(true);
          }}
          onMouseLeave={() => setHovered(false)}
          style={{ width: '400px', position: 'absolute', top: '-25%', left: '-25%', right: '20%' }}
        >
          <Card
            style={{
              width: '100%',
              fontFamily: 'Roboto',
              background: 'gray',
              zIndex: '100000',
              fontSize: '1.5rem',
              transform: size.width > 768 && conditionalStyle,
              transition: 'all .3s',
            }}
          >
            <div style={{ borderRadius: '50px' }}>
              <YouTube videoId={videoDetails.episodes[0].id} opts={opts} onPause={handleClick} />
            </div>
            <Card.Body className='cursor-pointer'>
              <div className='d-flex align-items-center justify-content-between'>
                <div onClick={handleClick}>
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
                  onClick={handleClick}
                >
                  Fullscreen
                </Button>
                <Button
                  variant='dark'
                  style={{
                    color: '#fff',
                    fontSize: '1.5rem',
                  }}
                  onClick={() => {
                    setFavouriteVideos((prevVid) => [...prevVid, videoDetails]);
                    setIsClicked(!isClicked);
                  }}
                >
                  <FaHeart
                    color={favouriteVideos.uniqueId === videoDetails.uniqueId ? 'green' : 'white'}
                  />
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
