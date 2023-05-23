import { getAuth } from 'firebase/auth';
import { FieldValue, deleteDoc, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { useContext, useRef, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import YouTube from 'react-youtube';
import StateContextProvider from '../../context/StateContext';
import VideoContextProvider from '../../context/VideoContext';
import { db } from '../../firebase.config';
import useDimension from '../hooks/useDimension';
import { EpisodeDetails } from '../util/EpisodeDetails';

export const ListCard = ({ imgSrc, videoDetails }) => {
  const [hovered, setHovered] = useState(false);
  const [show, setShow] = useState(false);

  const [coordinates, setCoordinates] = useState({ left: 0, right: 0 });
  const navigate = useNavigate();
  const ref = useRef();

  // Context Management
  const { favouriteVideos, setClickedVideo, setId, id } = useContext(StateContextProvider);
  const { seriesVideos } = useContext(VideoContextProvider);

  // Custom Hooks
  const [user] = useAuthState(getAuth());
  const { width } = useDimension();

  // Checking if the vidoe is a favourite video
  let favVideosUniqueID = [];
  for (let i = 0; i < favouriteVideos.length; i++) {
    const favouriteVidIndex = seriesVideos.findIndex((vid) => vid.id === favouriteVideos[i].id);
    favVideosUniqueID.push(seriesVideos[favouriteVidIndex].id);
  }
  const isFavourite = favVideosUniqueID.includes(videoDetails.id);

  const handleClick = (id) => {
    setClickedVideo(id);
    localStorage.removeItem('videoID');
    localStorage.setItem('videoID', JSON.stringify(id));
    navigate(`/watch/${videoDetails.id}`);
  };

  const saveFavourite = async () => {
    // setId((prev) => [...prev, videoDetails.id]);

    // await updateDoc(userRef, {
    //   favouriteVideos: id,
    // });

    const vidRef = doc(db, `users/${user.uid}/favourite_videos/${videoDetails.id}`);

    await setDoc(vidRef, {
      ...videoDetails,
      isFavourite: true,
      timestamp: serverTimestamp(),
    });
  };
  const deleteFavourite = async () => {
    const favouriteVidRef = doc(db, `users/${user.uid}/favourite_videos/${videoDetails.id}`);
    await deleteDoc(favouriteVidRef);
  };

  // getting the position relative to the viewport
  const bodyRect = document.body.getBoundingClientRect();
  const getPosition = (el) => {
    const { left, right } = el.getBoundingClientRect();
    setCoordinates({ left, right });
  };

  const opts = {
    height: width > 1000 ? '250' : '200',
    width: '100%',
    playerVars: {
      autoplay: 1,
      mute: 1,
    },
  };
  const conditionalStyle =
    coordinates.left < bodyRect.width - coordinates.left
      ? 'translateX(2.8rem)'
      : coordinates.right > bodyRect.width - coordinates.right && 'translateX(-3.9rem)';

  const textStyle = {
    width: '100%',
    display: 'inline-block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  return (
    <div className='position-relative' ref={ref}>
      <EpisodeDetails
        show={show}
        setShow={setShow}
        details={videoDetails}
        handleClick={handleClick}
      />

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
        <img
          src={imgSrc}
          alt='thumbnail'
          width={width > 1000 ? '230px' : '200px'}
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
          style={{
            width: width > 1000 ? '340px' : '280px',
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
              transform: width > 768 && conditionalStyle,
              transition: 'all .3s',
              zIndex: '100000',
            }}
          >
            <div className='rounded p-0 overflow-hidden' style={{ borderRadius: '5px' }}>
              <YouTube videoId={videoDetails.episodes[0].id} opts={opts} />
            </div>
            <div
              style={{
                position: 'absolute',
                background: 'rgba(0,0,0,0.2)',
                width: '100%',
                height: width > 1000 ? '250px' : '200px',
              }}
              className='cursor-pointer'
              onClick={() => handleClick(videoDetails.episodes[0].id)}
            />
            <Card.Body className='cursor-pointer ' style={{ zIndex: '100000' }}>
              <div
                onClick={() => handleClick(videoDetails.episodes[0].id)}
                style={{ overflow: 'hidden' }}
              >
                <Card.Title
                  style={{ fontSize: '1.5rem', fontWeight: 'bold', ...textStyle, margin: '0' }}
                >
                  {videoDetails.title}
                </Card.Title>
                <Card.Text
                  className='textEllipsis'
                  style={{
                    fontSize: '1.2rem',
                    margin: 0,
                  }}
                >
                  {videoDetails.description}
                </Card.Text>
              </div>

              <div className='d-flex justify-content-end align-self-end gap-2 mt-2'>
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
                {videoDetails.episodes.length > 1 ? (
                  <Button
                    variant='dark'
                    style={{
                      fontSize: '1rem',
                      color: '#fff',
                    }}
                    onClick={() => {
                      setHovered(false);
                      setShow(true);
                    }}
                  >
                    Episodes
                  </Button>
                ) : (
                  <Button
                    variant='dark'
                    style={{
                      color: '#fff',
                      fontSize: '1rem',
                    }}
                    onClick={() => handleClick(videoDetails.episodes[0].id)}
                  >
                    Fullscreen
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
