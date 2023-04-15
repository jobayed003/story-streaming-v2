import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { useContext, useRef } from 'react';
import { Button, Container, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthProvider from '../context/AuthContext';
import VideoContextProvider from '../context/VideoContext';
import { db } from '../firebase.config';
import { parseVideoIDFromYoutubeURL, ytDurationToSeconds } from '../youtubeUtils';
import './AddContent.css';
import useStatus from './hooks/useStatus';
import useThumbnail from './hooks/useThumbnail';
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
  // const [series, setSeries] = useState({
  //   description: '',
  //   episodes: [initialEpisode],
  //   genre: '',
  //   title: '',
  // });

  const formRef = useRef();
  const navigate = useNavigate();

  const { videos, videoUrls, series, updated, setSeries, setUpdated } =
    useContext(VideoContextProvider);
  const { isAuthenticated, isAdmin } = useContext(AuthProvider);

  // custom hooks
  const thumbnail = useThumbnail(videoUrls);
  const status = useStatus(videos);

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
    console.log(updatedEpisodes);
  };

  const AddVideo = async () => {
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
    console.log(finalSeries);

    const videoRef = doc(db, 'series', `${finalSeries.id}-${Math.random().toString(16).slice(2)}`);
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
    const updateTimestamp = await updateDoc(videoRef, {
      uniqueId: `${finalSeries.id}-${Math.random().toString(16).slice(2)}`,
    });

    console.log(updateTimestamp);
    setUpdated(!updated);
  };

  const opts = {
    height: '230',
    width: '230',
    playerVars: {
      autoplay: 0,
    },
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    slidesToShow: 3,
    slidesToScroll: 2,
  };

  if (!isAuthenticated) {
    navigate('/');
    return <Spinner></Spinner>;
  } else if (!isAdmin) navigate('/dashboard');

  return (
    <div>
      <h1 className='text-center mt-5' ref={formRef}>
        Add a video
      </h1>
      <Form className='col-md-6 offset-md-3'>
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
                onClick={() => setSeries({ ...series, episodes: series.episodes.splice(index, 1) })}
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

          <Button className='my-4 w-50' variant='primary' type='button' onClick={AddVideo}>
            Submit
          </Button>
        </div>
      </Form>

      <Container as='section' className='listsection py-2'>
        {videos.length > 0 ? (
          <Slide videosCount={videos.length}>
            {videos.map((video, idx) => (
              <div className='slide' key={Math.random()} style={{ width: '400px' }}>
                <VideoCard video={video} imgSrc={thumbnail[idx]} scrollTo={formRef} />
              </div>
            ))}
          </Slide>
        ) : (
          status
        )}
      </Container>
    </div>
  );
};

export default AddContent;
