import { getAuth } from 'firebase/auth';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { useContext, useRef } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';

import { toast } from 'react-toastify';
import AuthProvider from '../context/AuthContext';
import VideoContextProvider from '../context/VideoContext';
import { db } from '../firebase.config';
import { getThumbnails, parseVideoIDFromYoutubeURL, ytDurationToSeconds } from '../youtubeUtils';
import './AddContent.css';
import Footer from './UI/Footer';
import Header from './UI/Header';
import useLoadingState from './hooks/useLoadingState';
import useStatus from './hooks/useStatus';
import Slide from './util/Slide';
import VideoCard from './util/VideoCard';

const AddContent = () => {
  const initialEpisode = {
    description: '',
    duration: 0,
    episode: 0,
    title: '',
    url: '',
  };
  const formRef = useRef();

  // Context Management
  const { videos, series, updated, setSeries, setUpdated } = useContext(VideoContextProvider);
  const { isAdmin } = useContext(AuthProvider);

  // Custom Hooks
  const status = useStatus(videos);
  const loadingState = useLoadingState();
  const [user] = useAuthState(getAuth());

  // Getting thumbnail from video Urls
  const thumbnail = getThumbnails(videos);

  const getVideoDetails = async (url) => {
    const videoID = parseVideoIDFromYoutubeURL(url);
    console.log(videoID);
    const videoDetails = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoID}&part=contentDetails&key=AIzaSyCptCwdOzdgBvgU1O6UIOB_Z1ipsMUKCtg`
    ).then((res) => res.json());
    console.log(videoDetails);
    const { contentDetails } = videoDetails.items[0] || {};
    return { id: videoID, duration: ytDurationToSeconds(contentDetails.duration), contentDetails };
  };

  const updatedEpisodeDetails = (field, value, currentIndex) => {
    const updatedEpisodes = series.episodes.map((episode, index) => {
      if (index === currentIndex) {
        return {
          ...episode,
          [field]: value,
        };
      }
      return episode;
    });
    setSeries({
      ...series,
      episodes: updatedEpisodes,
    });
    // console.log(updatedEpisodes);
  };

  const AddVideo = async () => {
    const uniqueId = Math.random().toString(16).slice(2);
    const episodes = [];
    for (var x = 0; x < series.episodes.length; x++) {
      const episode = series.episodes[x];
      console.log(episode);
      const videoDetails = await getVideoDetails(episode.url);
      console.log(videoDetails);
      episodes.push({
        ...episode,
        ...videoDetails,
      });
    }
    const finalSeries = {
      ...series,
      episodes: episodes.sort((a, b) => a.episode - b.episode),
      id: series.title.toLowerCase().replace(/ /g, '-'),
    };
    // console.log(finalSeries);

    const videoRef = doc(db, 'series', series.uniqueId ? series.uniqueId : uniqueId);

    setDoc(videoRef, finalSeries)
      .then(() => {
        toast.dark('Video added successfully', {
          theme: 'dark',
        });
      })
      .catch((err) => {
        toast.error(err);
        console.log(err);
      });

    // setting uniquesID
    await updateDoc(videoRef, {
      uniqueId: series.uniqueId ? series.uniqueId : uniqueId,
    });

    // console.log(updateTimestamp);
    setUpdated(!updated);
    setSeries({ description: '', episodes: [initialEpisode], genre: '', title: '' });
  };

  // !isAdmin && loadingState;
  // useEffect(() => {
  //   ;
  // }, []);

  // if (!isAdmin) {
  //   setTimeout(() => navigate('/dashboard'), 1000);
  // }

  return (
    <>
      {!user && loadingState}
      {/* {!isAdmin && <Navigate to='/dashboard' />} */}
      {user && isAdmin && (
        <div className='d-flex'>
          <Header />
          <Container style={{ marginTop: '5rem' }}>
            <Row ref={formRef}>
              <Col>
                <h1 className='text-center text-white'>Add a video</h1>
              </Col>
            </Row>
            <Row className='justify-content-center'>
              <Col xs={9}>
                <Form className=''>
                  <h2 className='mb-0'>Series Details</h2>
                  <Form.Group className='mb-3'>
                    <Form.Label className='custom-label'>Video Title</Form.Label>
                    <Form.Control
                      type='text'
                      value={series.title}
                      placeholder='Enter Title'
                      onChange={(e) => {
                        setSeries({ ...series, title: e.target.value });
                      }}
                    />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Label className='custom-label'>Video Description</Form.Label>
                    <Form.Control
                      type='text'
                      value={series.description}
                      placeholder='Enter Description'
                      onChange={(e) => {
                        setSeries({ ...series, description: e.target.value });
                      }}
                    />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Label className='custom-label'>Video Genre</Form.Label>
                    <Form.Control
                      type='text'
                      value={series.genre}
                      placeholder='Enter Genre'
                      onChange={(e) => {
                        setSeries({ ...series, genre: e.target.value });
                      }}
                    />
                  </Form.Group>

                  {series.episodes.map((el, index) => (
                    <span key={'episode-' + index}>
                      <h3 className='mt-5'>Episode {index + 1}</h3>
                      {index > 0 && index === series.episodes.length - 1 && (
                        <Button
                          style={{
                            background: 'none',
                            border: 'none',
                            paddingLeft: 0,
                          }}
                          onClick={() =>
                            setSeries({ ...series, episodes: series.episodes.splice(index, 1) })
                          }
                        >
                          Remove
                        </Button>
                      )}
                      <Form.Group className='mb-3'>
                        <Form.Label className='custom-label'>Video Title</Form.Label>
                        <Form.Control
                          type='text'
                          value={el.title}
                          placeholder='Enter Title'
                          onChange={(e) => {
                            updatedEpisodeDetails('title', e.target.value, index);
                          }}
                        />
                      </Form.Group>
                      <Form.Group className='mb-3'>
                        <Form.Label className='custom-label'>Video Description</Form.Label>
                        <Form.Control
                          type='text'
                          value={el.description}
                          placeholder='Enter Description'
                          onChange={(e) => {
                            updatedEpisodeDetails('description', e.target.value, index);
                          }}
                        />
                      </Form.Group>
                      <Form.Group className='mb-3'>
                        <Form.Label className='custom-label'>Video URL</Form.Label>
                        <Form.Control
                          type='text'
                          value={el.url}
                          placeholder='Enter video URL'
                          onChange={(e) => {
                            updatedEpisodeDetails('url', e.target.value, index);
                          }}
                        />
                      </Form.Group>
                    </span>
                  ))}

                  <div className='d-flex align-items-center flex-column'>
                    <Button
                      variant='link'
                      style={{ paddingLeft: 0, textDecoration: 'none' }}
                      type='button'
                      onClick={() => {
                        setSeries({
                          ...series,
                          episodes: [
                            ...series.episodes,
                            { ...initialEpisode, episode: series.episodes.length + 1 },
                          ],
                        });
                      }}
                    >
                      Add another episode
                    </Button>

                    <Button
                      className='my-4 w-50'
                      variant='primary'
                      type='button'
                      onClick={AddVideo}
                    >
                      Submit
                    </Button>
                  </div>
                </Form>
              </Col>
            </Row>

            <Container as='section' className='listsection py-2 overflow-hidden'>
              {videos.length <= 0 ? (
                status
              ) : videos.length <= 4 ? (
                <div
                  className='d-flex justify-content-center'
                  style={{ gap: '1rem', flexWrap: 'wrap', marginBottom: '4rem' }}
                >
                  {videos.map((video, idx) => (
                    <VideoCard video={video} imgSrc={thumbnail[idx]} scrollTo={formRef} />
                  ))}
                </div>
              ) : (
                <Slide videosCount={videos.length}>
                  {videos.map((video, idx) => (
                    <div className='slide' key={Math.random()} style={{ width: '400px' }}>
                      <VideoCard video={video} imgSrc={thumbnail[idx]} scrollTo={formRef} />
                    </div>
                  ))}
                </Slide>
              )}
            </Container>
            <Footer />
          </Container>
        </div>
      )}{' '}
    </>
  );
};

export default AddContent;
