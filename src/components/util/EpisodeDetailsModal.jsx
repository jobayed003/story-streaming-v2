import { Form, Modal } from 'react-bootstrap';
import { getThumbnails } from '../../youtubeUtils';

export const EpisodeDetailsModal = ({ show, setShow, details, handleClick }) => {
  const handleClose = () => setShow(false);
  const episodeUrls = details.episodes.map((episode) => {
    return episode.url;
  });
  const thumbnail = getThumbnails(episodeUrls);

  const season = +details.season;

  if (isNaN(details.season)) {
    return;
  }

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
              {[...Array(season).keys()].map((season) => (
                <option defaultValue={details.season} value={season + 1}>
                  Season {season + 1}
                </option>
              ))}
            </Form.Select>
            <h2 className='text-bold'>Episodes</h2>

            {details.episodes.map((el, idx) => (
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
