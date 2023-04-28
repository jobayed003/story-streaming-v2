import { Form, Modal } from 'react-bootstrap';
import { getThumbnails } from '../../youtubeUtils';

export const VideoDetailsModal = ({ show, setShow, episodes, handleClick }) => {
  const handleClose = () => setShow(false);
  const episodeUrls = episodes.map((episode) => {
    return episode.url;
  });
  const thumbnail = getThumbnails(episodeUrls);

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body className='bg-dark p-4 rounded'>
          <div className='d-flex flex-column'>
            <Form.Select
              aria-label='Season No. Select'
              className='align-self-end cursor-pointer'
              style={{ width: 'max-content' }}
            >
              <option defaultValue={'1'} value='1'>
                Season 1
              </option>
            </Form.Select>
            <h2 className='text-bold'>Episodes</h2>

            {episodes.map((el, idx) => (
              <div
                className='d-flex justify-content-between align-items-center mb-2 pb-1 cursor-pointer border-bottom'
                onClick={() => handleClick(el.id)}
              >
                <img alt='img' width={'100px'} src={thumbnail[idx]} />
                <div className='d-flex flex-column align-items-end '>
                  <span>{el.title}</span>
                  <span>Episode {el.episode}</span>
                </div>
              </div>
            ))}
          </div>

          {/* <Button variant='secondary' onClick={handleClose}>
              Close
            </Button>
            <Button variant='primary' onClick={handleClose}>
              Save Changes
            </Button> */}
        </Modal.Body>
      </Modal>
    </>
  );
};
