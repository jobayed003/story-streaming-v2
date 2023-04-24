import { getAuth } from 'firebase/auth';
import { motion } from 'framer-motion';
import { useContext, useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Container, Image, Row } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';

import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { FaHeart } from 'react-icons/fa';
import { Navigate, useNavigate } from 'react-router-dom';
import YouTube from 'react-youtube';
import AuthProvider from '../context/AuthContext';
import StateContextProvider from '../context/StateContext';
import VideoContextProvider from '../context/VideoContext';
import { db } from '../firebase.config';
import { createCheckoutSession } from '../stripe/createCheckoutSession';
import { getThumbnails } from '../youtubeUtils';
import './Dashboard.css';
import logo from './Icons/StorySaloon_Logo.svg';
import Header from './UI/Header';
import useDimension from './hooks/useDimension';
import useStatus from './hooks/useStatus';
import Footer from './util/Footer';
import Slide from './util/Slide';

const Dashboard = () => {
  const { isAuthenticated } = useContext(AuthProvider);
  const { favouriteVideos } = useContext(StateContextProvider);
  const { videos } = useContext(VideoContextProvider);
  const [user, userLoading] = useAuthState(getAuth());
  const status = useStatus(videos);
  const navigate = useNavigate();

  // Getting thumbnail from video Urls
  const size = useDimension();
  const trendingVidThumbnail = getThumbnails(videos);
  const favouriteVidThumbnail = getThumbnails(favouriteVideos);

  if (!user) {
    return (
      <Row className='justify-content-center align-items-center' style={{ height: '100vh' }}>
        <Image src={logo} alt='' style={{ width: '300px', height: '80px' }} />
      </Row>
    );
  }

  return (
    <>
      <Header />
      <Container
        as='section'
        id='movies'
        className='fontFamily hide-scroll'
        style={{ overflow: 'hidden visible', paddingBottom: '8rem' }}
      >
        {/* Top trending videos list */}
        <Row className='mt-5' id='top-trending'>
          <Col className='mt-5 text-light'>
            <h1>Top Trending</h1>
          </Col>
        </Row>

        {videos.length <= 0 ? (
          <Row>{status}</Row>
        ) : videos.length <= 4 ? (
          <div
            className='d-flex justify-content-center'
            style={{ gap: '4rem', flexWrap: 'wrap', marginBottom: '4rem' }}
          >
            {videos.map((el, idx) => (
              <ListCard imgSrc={trendingVidThumbnail[idx]} videoDetails={el} />
            ))}
          </div>
        ) : (
          <Slide>
            {videos.map((el, idx) => (
              <div
                className='slide'
                key={Math.random() + idx}
                style={{ width: size > 500 ? '400px' : '300px' }}
              >
                <ListCard imgSrc={trendingVidThumbnail[idx]} videoDetails={el} />
              </div>
            ))}
          </Slide>
        )}

        {/* Favourite Videos List */}
        <Row style={{ marginTop: '8rem' }}>
          <Col className='text-light' id={'my-list'}>
            <h1>My List</h1>
          </Col>
        </Row>

        {favouriteVideos.length <= 0 ? (
          <Row>{status}</Row>
        ) : favouriteVideos.length <= 4 ? (
          <div
            className='d-flex justify-content-center'
            style={{ gap: '4rem', flexWrap: 'wrap', paddingBottom: '4rem' }}
          >
            {favouriteVideos.map((el, idx) => (
              <ListCard videoDetails={el} imgSrc={favouriteVidThumbnail[idx]} />
            ))}
          </div>
        ) : (
          <Slide>
            {favouriteVideos.map((el, idx) => (
              <div
                id='my-list'
                className='slide '
                key={Math.random() + idx}
                style={{ width: size > 500 ? '400px' : '300px' }}
              >
                <ListCard imgSrc={favouriteVidThumbnail[idx]} videoDetails={el} />
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
  const [coordinates, setCoordinates] = useState({ left: 0, right: 0 });
  const navigate = useNavigate();
  const [user, userLoading] = useAuthState(getAuth());
  const { favouriteVideos, setClickedVideo } = useContext(StateContextProvider);
  const { videos } = useContext(VideoContextProvider);
  const ref = useRef();
  const size = useDimension();

  // Checking if favourite video
  let favVideosUniqueID = [];

  for (let i = 0; i < favouriteVideos.length; i++) {
    const favouriteVidIndex = videos.findIndex(
      (vid) => vid.uniqueId === favouriteVideos[i].uniqueId
    );
    favVideosUniqueID.push(videos[favouriteVidIndex].uniqueId);
  }
  const isFavourite = favVideosUniqueID.includes(videoDetails.uniqueId);

  const handleClick = () => {
    setClickedVideo(videoDetails);
    localStorage.removeItem('video');
    localStorage.setItem('video', JSON.stringify(videoDetails));
    navigate(`/watch/${videoDetails.uniqueId}`);
  };

  const saveFavourite = async () => {
    const vidRef = doc(db, `users/${user.uid}/favourite_videos/${videoDetails.uniqueId}`);

    await setDoc(vidRef, {
      ...videoDetails,
      isFavourite: true,
    });
  };
  const deleteFavourite = async () => {
    const favouriteVidRef = doc(db, `users/${user.uid}/favourite_videos/${videoDetails.uniqueId}`);
    await deleteDoc(favouriteVidRef);
  };

  // getting the position relative to the viewport
  const bodyRect = document.body.getBoundingClientRect();
  const getPosition = (el) => {
    const elemRect = el.getBoundingClientRect();
    setCoordinates({ left: elemRect.left, right: elemRect.right });
  };

  const opts = {
    height: '250',
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  };
  const conditionalStyle =
    coordinates.left < bodyRect.width - coordinates.left
      ? 'translateX(3rem)'
      : coordinates.right > bodyRect.width - coordinates.right && 'translateX(-3rem)';

  return (
    <div className='position-relative' ref={ref}>
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
          getPosition(ref.current);
          setHovered(true);
        }}
        onMouseLeave={() => setHovered(false)}
      >
        <img src={imgSrc} alt='thumbnail' width={'250px'} className='cursor-pointer' />
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
          style={{
            width: '350px',
            position: 'absolute',
            top: '-25%',
            left: '-20%',
            right: '20%',
            zIndex: '10000000',
          }}
        >
          <Card
            style={{
              width: '100%',
              fontFamily: 'Roboto',
              background: 'gray',
              fontSize: '1.5rem',
              transform: size.width > 768 && conditionalStyle,
              transition: 'all .3s',
              zIndex: '100000',
            }}
          >
            <div style={{ borderRadius: '50px' }}>
              <YouTube videoId={videoDetails.episodes[0].id} opts={opts} />
            </div>
            <div
              style={{
                position: 'absolute',
                background: 'rgba(0,0,0,0.2)',
                width: '100%',
                height: '250px',
              }}
              className='cursor-pointer'
              onClick={handleClick}
            />
            <Card.Body className='cursor-pointer' style={{ zIndex: '100000' }}>
              <div className='d-flex align-items-center justify-content-between gap-1'>
                <div onClick={handleClick}>
                  <Card.Title style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {videoDetails.title}
                  </Card.Title>
                  <Card.Text style={{ fontSize: '1.2rem', margin: 0 }}>
                    {videoDetails.description}
                  </Card.Text>
                </div>
                <Button
                  variant='success'
                  style={{
                    color: '#fff',
                    fontSize: '1rem',
                  }}
                  onClick={handleClick}
                >
                  Fullscreen
                </Button>
                <Button
                  variant='dark'
                  style={{
                    fontSize: '1rem',
                    color: '#fff',
                  }}
                  onClick={!isFavourite ? saveFavourite : deleteFavourite}
                >
                  <FaHeart color={isFavourite ? 'green' : 'white'} />
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
