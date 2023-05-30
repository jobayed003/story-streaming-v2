import { deleteDoc, doc } from 'firebase/firestore';
import { useContext, useState } from 'react';
import { Button, Card, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import VideoContextProvider from '../../context/VideoContext';
import { db } from '../../firebase.config';
import { getSeriesData } from '../util/videoUtil';

const btnStyles = {
  fontFamily: 'Roboto',
  background: 'var(--button-color)',
  border: 'none',
};

const EditCard = ({ imgSrc, scrollTo, video }) => {
  const { setSeriesDetails } = useContext(VideoContextProvider);
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const handleShow = () => setShow(true);

  const editVideo = async () => {
    setSeriesDetails(await getSeriesData(video.id));
    scrollTo.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
  };

  const playVideo = () => {
    navigate(`/watch/${video.id}`);
    localStorage.removeItem('video');
    localStorage.setItem(
      'video',
      JSON.stringify({ ...video.episodes[0], seriesTitle: video.title })
    );
  };

  const textStyle = {
    width: '100%',
    display: 'inline-block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  return (
    <>
      <DeleteConfirmation show={show} setShow={setShow} video={video} />

      <Card style={{ background: 'gray', height: '20rem', maxWidth: '230px' }}>
        <Card.Img
          variant='top'
          src={imgSrc}
          height={'200px'}
          width={'100%'}
          style={{ cursor: 'pointer' }}
          onClick={playVideo}
        />

        <Card.Body
          className='d-flex flex-column justify-content-between'
          style={{ height: '100%' }}
        >
          <div
            style={{
              overflow: 'hidden',
            }}
          >
            <Card.Title style={{ ...textStyle }}>{video.title}</Card.Title>
            <Card.Text style={{ height: '45px' }}>{video.description}</Card.Text>
          </div>
          <div className='d-flex justify-content-between mt-2'>
            <Button style={{ ...btnStyles }} onClick={editVideo}>
              <FaEdit />
            </Button>
            <Button
              style={{ ...btnStyles, backgroundColor: 'var(--gray-color)' }}
              onClick={handleShow}
            >
              <FaTrash />
            </Button>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default EditCard;

const DeleteConfirmation = ({ show, setShow, video }) => {
  const { setUpdated } = useContext(VideoContextProvider);

  const handleClose = () => setShow(false);

  const deleteVideo = async () => {
    await deleteDoc(doc(db, 'series', video.id));
    setUpdated((prev) => !prev);
    handleClose();
    toast.dark('Video Deleted Successfully!', {
      theme: 'dark',
    });
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Body
        className='rounded'
        style={{
          background: 'var(--form-bg)',
        }}
      >
        <div className='d-flex flex-column gap-1'>
          <div>
            <h4
              style={{
                width: '100%',
                display: 'inline-block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                margin: '0',
                textOverflow: 'ellipsis',
              }}
            >
              {video.title}
            </h4>
            <p className='m-0'>Episodes: {video.episodes.length}</p>
          </div>
          <h4>Are you sure you want to delete the video?</h4>

          <div className='d-flex justify-content-end gap-3'>
            <Button style={{ ...btnStyles, background: 'var(--gray-color)' }} onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={deleteVideo}
              style={{ ...btnStyles, background: 'var(--button-secondary-color)' }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
