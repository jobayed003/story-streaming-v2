import { deleteDoc, doc } from 'firebase/firestore';
import { useContext } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import VideoContextProvider from '../../context/VideoContext';
import { db } from '../../firebase.config';
import { getSeriesData } from './videoUtil';

const EditCard = ({ imgSrc, scrollTo, video }) => {
  const { setUpdated, setSeriesDetails } = useContext(VideoContextProvider);
  // const { deleteFavouriteVideo } = useContext(StateContextProvider);

  const navigate = useNavigate();

  const editVideo = async () => {
    setSeriesDetails(await getSeriesData(video.id));
    scrollTo.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
  };

  const playVideo = () => {
    navigate(`/watch/${video.id}`);
    localStorage.removeItem('videoID');
    localStorage.setItem('videoID', JSON.stringify(video.episodes[0].id));
  };

  const deleteVideo = async () => {
    await deleteDoc(doc(db, 'series', video.id));
    setUpdated((prev) => !prev);
    toast.dark('Video Deleted Successfully!', {
      theme: 'dark',
    });
  };

  const btnStyles = {
    fontFamily: 'Roboto',
    background: 'none',
    border: 'none',
  };

  const textStyle = {
    width: '100%',
    display: 'inline-block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  return (
    <Card style={{ background: 'gray', height: '20rem', maxWidth: '230px' }}>
      <Card.Img
        variant='top'
        src={imgSrc}
        height={'200px'}
        width={'100%'}
        style={{ cursor: 'pointer' }}
        onClick={playVideo}
      />

      <Card.Body className='d-flex flex-column justify-content-between' style={{ height: '100%' }}>
        <div
          style={{
            overflow: 'hidden',
          }}
        >
          <Card.Title style={{ ...textStyle }}>{video.title}</Card.Title>
          <Card.Text style={{ height: '45px' }}>{video.description}</Card.Text>
        </div>
        <div className='d-flex justify-content-between mt-2'>
          <Button className={'bg-primary'} style={{ ...btnStyles }} onClick={editVideo}>
            Edit
          </Button>
          <Button className={'bg-danger'} style={{ ...btnStyles }} onClick={deleteVideo}>
            Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default EditCard;
