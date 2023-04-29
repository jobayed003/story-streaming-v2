import { useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import YouTube from 'react-youtube';
import ChevronDownIcon from '../../assets/Icons/chevron-down.svg';
import { getThumbnails } from '../../youtubeUtils';

export const EpisodeDetailsModal = ({ show, setShow, details, handleClick }) => {
  const [watchTime, setWatchTime] = useState(0);

  const handleClose = () => setShow(false);
  const episodeUrls = details.episodes.map((episode) => {
    return episode.url;
  });
  const thumbnail = getThumbnails(episodeUrls);

  const season = details.episodes[0].season;

  const getDuration = (duration) => {
    // Hours, minutes and seconds
    const hrs = ~~(duration / 3600);
    const mins = ~~((duration % 3600) / 60);
    const secs = ~~duration % 60;
    let time = '';
    if (hrs > 0) {
      time += '' + hrs + '.' + (mins < 10 ? '0' : '');
    }
    time += '' + mins + '.' + (secs < 10 ? '0' : '');
    time += '' + secs;

    return time;
  };

  const opts = {
    width: '100%',
    height: '280',
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body className='bg-dark p-0 rounded'>
          <div style={{ borderRadius: '5px' }}>
            <YouTube
              videoId={details.episodes[0].id}
              opts={opts}
              onPause={(e) => setWatchTime(getDuration(e.target.playerInfo.currentTime))}
            />
          </div>
          <div className='d-flex flex-column p-4 pb-0'>
            <span style={{ fontWeight: 'bold', fontSize: '2rem' }}>{details.title}</span>
            <span>{details.description}</span>
            <span>{details.genre}</span>
          </div>
          <div className='d-flex flex-column p-4'>
            <div className='d-flex align-items-center justify-content-between mb-3 border-bottom'>
              <h2 className='text-bold'>Episodes</h2>
              <Form.Select
                aria-label='Season No. Select'
                className='bg-dark text-white align-self-end cursor-pointer mb-2'
                style={{
                  width: 'max-content',
                  backgroundImage: `url(${ChevronDownIcon})`,
                }}
              >
                {[...Array(season).keys()].map((season) => (
                  <option defaultValue={details.season} value={season + 1}>
                    Season {season + 1}
                  </option>
                ))}
              </Form.Select>
            </div>

            {details.episodes.map((el, idx) => (
              <div
                className='d-flex justify-content gap-3 align-items-center mb-2 pb-1 cursor-pointer border-bottom'
                onClick={() => handleClick(el.id)}
              >
                <span>{idx + 1}</span>
                <img
                  alt='img'
                  width={'100px'}
                  src={thumbnail[idx]}
                  style={{ borderRadius: '5px' }}
                />

                <div className='d-flex justify-content-between mt-2' style={{ width: '100%' }}>
                  <div
                    className='d-flex flex-column'
                    style={{
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      width: '260px',
                    }}
                  >
                    <span style={{ fontWeight: 'bold' }}>{el.title}</span>
                    <span className='text-secondary' style={{ height: '50px' }}>
                      {details.episodes[0].description}
                    </span>
                  </div>
                  <span>{getDuration(el.duration) + 'm'}</span>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
