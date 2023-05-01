import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Dropdown, Form, Modal } from 'react-bootstrap';
import YouTube from 'react-youtube';
import ChevronDownIcon from '../../assets/Icons/chevron-down.svg';
import { getThumbnails } from '../../youtubeUtils';
import classes from './EpisodeDetailsModal.module.css';

export const EpisodeDetailsModal = ({ show, setShow, details, handleClick }) => {
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [watchTime, setWatchTime] = useState(0);
  const [visibilty, setVisibilty] = useState('visible');

  const thumbnail = getThumbnails(episodes.map((episode) => episode.url));

  const handleClose = () => {
    setShow(false);
    getSeason(1);
  };

  const getDuration = (duration) => {
    // Hours, minutes and seconds
    const hrs = ~~(duration / 3600);
    const mins = ~~((duration % 3600) / 60);
    const secs = ~~duration % 60;
    let time = '';
    if (hrs > 0) {
      time += '' + hrs + 'h ' + (mins < 10 ? '0' : '');
    }
    time += '' + mins + 'm ' + (secs < 10 ? '0' : '');
    time += '' + secs + 's';

    return time;
  };

  useEffect(() => {
    const totalSeason = [...new Set(details.episodes.map((el) => el.season))];
    setSeasons(totalSeason);
    getSeason(1);
  }, []);

  const getSeason = (season) => {
    console.log(season);

    if (season === 'View All') {
      setEpisodes(details.episodes);
      return;
    }

    const selectedSeasonEp = details.episodes.filter((ep) => ep.season === +season);
    setEpisodes(selectedSeasonEp);
  };

  const opts = {
    width: '100%',
    height: '280',
    playerVars: {
      autoplay: 1,
    },
  };

  const listVariants = {
    hidden: {
      opacity: 0,
      y: -25,
      transition: {
        when: 'afterChildren',
        staggerChildren: 0.5,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ease: 'linear',
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: -20,
    },
    visible: {
      opacity: 1,
      y: 0,
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
          <div className={'d-flex flex-column p-4 pb-0'}>
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
                onChange={(e) => getSeason(e.target.value)}
              >
                {seasons.map((season) => (
                  <option defaultValue={details.season} value={season}>
                    Season {season}
                  </option>
                ))}
                <option>View All</option>
              </Form.Select>
            </div>

            <motion.div variants={listVariants} initial='hidden' animate={'visible'}>
              {episodes.map((el, idx) => (
                <motion.div variants={itemVariants} className='item' key={Math.random()}>
                  <div
                    className='d-flex justify-content gap-3 align-items-center mb-2 pb-1 cursor-pointer border-bottom'
                    onClick={() => handleClick(el.id)}
                  >
                    <span>{idx + 1}</span>
                    <img alt='img' src={thumbnail[idx]} className={classes.episodesImg} />

                    <div
                      className='d-flex flex-column mt-2'
                      style={{
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                      }}
                    >
                      <div className={`d-flex justify-content-between ${classes.episodeDetails}`}>
                        <span style={{ fontWeight: 'bold' }}>{el.title}</span>

                        <span style={{ fontSize: '.9rem' }}>{getDuration(el.duration)}</span>
                      </div>
                      <span className={`text-secondary`} style={{ height: '50px' }}>
                        {el.description}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
