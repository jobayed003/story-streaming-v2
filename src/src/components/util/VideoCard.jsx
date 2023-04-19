import { deleteDoc, doc } from 'firebase/firestore';
import { useContext } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import VideoContextProvider from '../../context/VideoContext';
import { db } from '../../firebase.config';
import { getSeriesData } from '../../youtubeUtils';

const VideoCard = ({ imgSrc, scrollTo, video }) => {
  const { updated, setUpdated, setSeries } = useContext(VideoContextProvider);
  const navigate = useNavigate();

  const handleClick = async () => {
    setSeries({ ...(await getSeriesData(video.id)), id: video.id });
    scrollTo.current.scrollIntoView();
  };

  const playVideo = () => {
    navigate(`/watch/${video.uniqueId}`);
    localStorage.removeItem('video');
    localStorage.setItem('video', JSON.stringify(video));
  };

  const btnStyles = {
    fontFamily: 'Roboto',
    background: 'none',
    border: 'none',
  };

  return (
    <Card style={{ background: 'gray' }}>
      <div
        className='d-flex flex-column justify-content-between'
        style={{ background: 'gray', height: '23rem' }}
      >
        <Card.Img
          variant='top'
          src={imgSrc}
          height={'230px'}
          style={{ cursor: 'pointer' }}
          onClick={playVideo}
        />
        <Card.Body>
          <Card.Title>{video.episodes[0].title}</Card.Title>
          <Card.Text>{video.episodes[0].description}</Card.Text>

          <div className='d-flex justify-content-between'>
            <Button className={'bg-primary'} style={{ ...btnStyles }} onClick={handleClick}>
              Edit
            </Button>
            <Button
              className={'bg-danger'}
              style={{ ...btnStyles }}
              onClick={async () => {
                await deleteDoc(doc(db, 'series', video.id));
                setUpdated(!updated);
                toast.success('Video Deleted Successfully');
              }}
            >
              Delete
            </Button>
          </div>
        </Card.Body>
      </div>
    </Card>
  );
};

export default VideoCard;
