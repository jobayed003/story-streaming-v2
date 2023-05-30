import { getAuth } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useContext, useEffect, useRef } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import AuthProvider from '../../context/AuthContext';
import VideoContextProvider from '../../context/VideoContext';
import { db } from '../../firebase.config';
import Layout from '../UI/Layout';
import EditCard from '../VideoCards/EditCard';
import useDimension from '../hooks/useDimension';
import useLoadingState from '../hooks/useLoadingState';
import useSearchDebounce from '../hooks/useSearchBounce';
import useStatus from '../hooks/useStatus';
import Slide from '../util/Slide';
import { getVideoDetails } from '../util/youtubeUtils';
import './AddContent.css';

const AddContent = () => {
  const initialEpisode = {
    description: '',
    duration: 0,
    episode: 0,
    title: '',
    url: '',
    season: 1,
  };
  const formRef = useRef();

  // Context Management
  const { seriesVideos, seriesDetails, setUpdated, setSeriesDetails } =
    useContext(VideoContextProvider);
  const { isAdmin } = useContext(AuthProvider);

  // Custom Hooks

  const status = useStatus(seriesVideos);
  const loadingState = useLoadingState();
  const [user] = useAuthState(getAuth());
  const [search, setSearchQuery, index, setIndex] = useSearchDebounce();

  const updatedEpisodeDetails = (field, value, currentIndex) => {
    const updatedEpisodes = seriesDetails.episodes.map((episode, index) => {
      if (index === currentIndex) {
        return {
          ...episode,
          [field]: value,
        };
      }
      return episode;
    });
    setSeriesDetails({
      ...seriesDetails,
      episodes: updatedEpisodes,
    });
  };

  const AddVideo = async () => {
    const uniqueId = Math.random().toString(16).slice(2);
    const episodes = [];

    seriesDetails.episodes.forEach((episode, idx) => {
      episodes.push({
        ...episode,
        season: episode.season || 1,
        episode: episode.episode || idx + 1,
      });
    });

    if (!seriesDetails.genre) {
      toast.dark('Something Went Wrong.Check the values and try again!', {
        theme: 'dark',
      });
      return;
    }
    const finalSeries = {
      ...seriesDetails,
      episodes: episodes.sort((a, b) => a.episode - b.episode),
      id: seriesDetails.id ? seriesDetails.id : uniqueId,
      timeStamp: serverTimestamp(),
    };
    const seriesVideoRef = doc(db, 'series', seriesDetails.id ? seriesDetails.id : uniqueId);

    try {
      await setDoc(seriesVideoRef, finalSeries);

      toast.dark('Video added successfully!', {
        theme: 'dark',
      });
      setUpdated((prev) => !prev);

      setSeriesDetails({
        description: '',
        episodes: [initialEpisode],
        genre: '',
        title: '',
        type: 'movies',
      });
    } catch (error) {
      toast.dark('Something Went Wrong.Check the values and try again!', {
        theme: 'dark',
      });
      console.log(error);
    }
  };

  useEffect(() => {
    const getDetails = async () => {
      const data = await getVideoDetails(search);

      if (data.error === '' && search !== '') {
        const { epDetails } = data;
        setSeriesDetails({
          ...seriesDetails,
          episodes: [...seriesDetails.episodes, epDetails].filter((el) => el.title !== ''),
          title: index === 0 ? epDetails.title : seriesDetails.episodes[0].title,
          description: index === 0 ? epDetails.description : seriesDetails.episodes[0].description,
        });
      } else {
        toast.dark(data.error, {
          theme: 'dark',
        });
      }
    };
    getDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    setSeriesDetails({
      description: '',
      episodes: [initialEpisode],
      genre: '',
      title: '',
      type: 'movies',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!user && loadingState}
      {/* {!isAdmin && <Navigate to='/dashboard' />} */}
      {user && isAdmin && (
        <Layout>
          <Container style={{ marginTop: '5rem', overflow: 'hidden' }} as='section'>
            <Row ref={formRef}>
              <Col>
                <h1 className='text-center text-white'>Add a video</h1>
              </Col>
            </Row>
            <Row className='justify-content-center'>
              <Col xs={9}>
                <Form>
                  <VideoDetailsForm />
                  {seriesDetails.episodes.map((el, index) => (
                    <div key={'episode-' + index}>
                      <h3 className='mt-5'>Episode {index + 1}</h3>
                      {index > 0 && index === seriesDetails.episodes.length - 1 && (
                        <Button
                          style={{
                            background: 'none',
                            border: 'none',
                            paddingLeft: 0,
                          }}
                          onClick={() => {
                            seriesDetails.episodes.splice(index, 1);
                            setSeriesDetails({
                              ...seriesDetails,
                            });
                          }}
                        >
                          Remove
                        </Button>
                      )}

                      <Form.Group className='mb-3'>
                        <Form.Label className='custom-label'>Video URL</Form.Label>
                        <Form.Control
                          type='text'
                          value={el.url}
                          placeholder='Enter video URL'
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setIndex(index);
                            // handleDetails(e.target.value, index);
                            updatedEpisodeDetails('url', e.target.value, index);
                          }}
                        />
                      </Form.Group>
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
                        <Form.Label className='custom-label'>Season Number</Form.Label>
                        <Form.Control
                          min={1}
                          max={40}
                          required
                          defaultValue={1}
                          type='number'
                          value={el.season}
                          placeholder='Select Season'
                          onChange={(e) => {
                            updatedEpisodeDetails('season', +e.target.value, index);
                          }}
                        />
                      </Form.Group>
                    </div>
                  ))}

                  <div className='text-center'>
                    <Button
                      variant='link'
                      style={{ paddingLeft: 0, textDecoration: 'none', color: 'var(--text-color)' }}
                      type='button'
                      onClick={() => {
                        setSeriesDetails({
                          ...seriesDetails,
                          episodes: [
                            ...seriesDetails.episodes,
                            { ...initialEpisode, episode: seriesDetails.episodes.length + 1 },
                          ],
                        });
                      }}
                    >
                      Add another episode
                    </Button>

                    <div className='d-flex flex-column flex-sm-row gap-4 my-4 mx-5 flex-grow-1'>
                      <Button
                        className='flex-grow-1'
                        style={{
                          background: 'var(--button-color)',
                          border: 'none',
                          height: '2.5rem',
                        }}
                        type='button'
                        disabled={Object.values(seriesDetails).includes('')}
                        onClick={AddVideo}
                      >
                        Submit
                      </Button>
                      <Button
                        className='flex-grow-1'
                        type='button'
                        style={{
                          background: 'var(--button-color)',
                          border: 'none',
                          height: '2.5rem',
                        }}
                        onClick={() => {
                          formRef.current.scrollIntoView({
                            behavior: 'smooth',
                            block: 'end',
                            inline: 'nearest',
                          });
                          setSeriesDetails({
                            description: '',
                            episodes: [initialEpisode],
                            genre: '',
                            title: '',
                            type: 'movies',
                          });
                        }}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </Form>
              </Col>
            </Row>

            <Row className='listsection py-20' style={{ marginLeft: '.1rem' }}>
              {seriesVideos.length <= 0 ? (
                status
              ) : seriesVideos.length <= 4 ? (
                <div
                  className='d-flex justify-content-center'
                  style={{ gap: '1rem', flexWrap: 'wrap', marginBottom: '4rem' }}
                >
                  {seriesVideos.map((video, idx) => (
                    <EditCard
                      video={video}
                      imgSrc={video.episodes[0].thumbnail}
                      scrollTo={formRef}
                    />
                  ))}
                </div>
              ) : (
                <Slide
                  change={{
                    infinite: false,
                    centerMode: false,
                    slidesToScroll: 3,
                    autoplay: false,
                  }}
                >
                  {seriesVideos.map((video, idx) => (
                    <div className='slide' key={Math.random() + idx}>
                      <EditCard
                        video={video}
                        imgSrc={video.episodes[0].thumbnail}
                        scrollTo={formRef}
                      />
                    </div>
                  ))}
                </Slide>
              )}
            </Row>
          </Container>
        </Layout>
      )}
    </>
  );
};

export default AddContent;

const VideoDetailsForm = () => {
  const { width } = useDimension();
  // Context Management
  const { seriesDetails, setSeriesDetails } = useContext(VideoContextProvider);

  return (
    <>
      <div className='d-flex justify-content-between align-items-center flex-column flex-sm-row gap-3 my-4'>
        <h2 className='mb-0 align-self-sm-center align-self-start'>Video Details</h2>
        <Form.Group className={width <= 575 ? 'w-100' : 'w-auto'}>
          <Form.Label className='custom-label'>Choose Video Type</Form.Label>
          <Form.Select
            aria-label='Video Type Select'
            onChange={(e) => setSeriesDetails({ ...seriesDetails, type: e.target.value })}
            value={seriesDetails.type}
          >
            <option defaultValue={'movies'} value='movies'>
              Movies
            </option>
            <option value='tv-shows'>TV Shows</option>
            <option value='musics'>Musics</option>
            <option value='podcast'>Podcast</option>
            <option value='documentary'>Documentary</option>
          </Form.Select>
        </Form.Group>
      </div>

      <Form.Group className='mb-3'>
        <Form.Label className='custom-label'>Video Title</Form.Label>
        <Form.Control
          type='text'
          value={seriesDetails.title}
          placeholder='Enter Title'
          onChange={(e) => {
            setSeriesDetails({ ...seriesDetails, title: e.target.value });
          }}
        />
      </Form.Group>
      <Form.Group className='mb-3'>
        <Form.Label className='custom-label'>Video Description</Form.Label>
        <Form.Control
          type='text'
          value={seriesDetails.description}
          placeholder='Enter Description'
          onChange={(e) => {
            setSeriesDetails({ ...seriesDetails, description: e.target.value });
          }}
        />
      </Form.Group>
      <Form.Group className='mb-3'>
        <Form.Label className='custom-label'>Video Genre</Form.Label>
        <Form.Control
          type='text'
          value={seriesDetails.genre}
          placeholder='Enter Genre'
          onChange={(e) => {
            setSeriesDetails({ ...seriesDetails, genre: e.target.value });
          }}
        />
      </Form.Group>
    </>
  );
};
