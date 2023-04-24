import { deleteDoc, doc } from 'firebase/firestore';
import { useContext } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthProvider from '../../context/AuthContext';
import VideoContextProvider from '../../context/VideoContext';
import { db } from '../../firebase.config';
import { getSeriesData } from '../../youtubeUtils';

const VideoCard = ({ imgSrc, scrollTo, video }) => {
  const { updated, setUpdated, setSeries } = useContext(VideoContextProvider);
  const { userCredentials } = useContext(AuthProvider);

  const navigate = useNavigate();

  const editVideo = async () => {
    setSeries({ ...(await getSeriesData(video.id)), id: video.id });
    scrollTo.current.scrollIntoView();
  };

  const playVideo = () => {
    navigate(`/watch/${video.uniqueId}`);
    localStorage.removeItem('video');
    localStorage.setItem('video', JSON.stringify(video));
  };

  const deleteVideo = async () => {
    await deleteDoc(doc(db, 'series', video.id));
    setUpdated(!updated);
    toast.success('Video Deleted Successfully');
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
          height={'200px'}
          style={{ cursor: 'pointer' }}
          onClick={playVideo}
        />
        <Card.Body>
          <Card.Title>{video.episodes[0].title}</Card.Title>
          <Card.Text>{video.episodes[0].description}</Card.Text>

          <div className='d-flex justify-content-between'>
            <Button className={'bg-primary'} style={{ ...btnStyles }} onClick={editVideo}>
              Edit
            </Button>
            <Button className={'bg-danger'} style={{ ...btnStyles }} onClick={deleteVideo}>
              Delete
            </Button>
          </div>
        </Card.Body>
      </div>
    </Card>
  );
};

export default VideoCard;
