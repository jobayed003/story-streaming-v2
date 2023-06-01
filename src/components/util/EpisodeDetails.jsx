import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import YouTube from 'react-youtube';
import ChevronDownIcon from '../../assets/Icons/chevron-down.svg';
import StateContextProvider from '../../context/StateContext';
import classes from './EpisodeDetails.module.css';
import { getDuration } from './videoUtil';

export const EpisodeDetails = ({ show, setShow, details }) => {
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [watchTime, setWatchTime] = useState(0);
  const navigate = useNavigate();

  // Context Management
  const { setClickedEpisode } = useContext(StateContextProvider);

  const handleClose = () => {
    setShow(false);
    getEpisodes(details.episodes, 1);
  };

  useEffect(() => {
    const totalSeason = [...new Set(details.episodes.map((el) => el.season))];
    setSeasons(totalSeason);
    getEpisodes(details.episodes, 1);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getEpisodes = (series, season) => {
    if (season === 'View All') {
      const sortedEp = series.sort((a, b) => a.season - b.season);
      setEpisodes(sortedEp);
      return;
    }
    const selectedSeasonEp = series.filter((ep) => ep.season === +season);
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
        // ease: 'linear',
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

  const textStyle = {
    width: '80%',
    display: 'inline-block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const handleClick = (episode) => {
    setClickedEpisode(episode);
    localStorage.removeItem('videoEp');
    localStorage.setItem('videoEp', JSON.stringify(episode));
    navigate(`/watch/${details.id}`);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body className='p-0 rounded ' style={{ backgroundColor: 'var(--gray-color)' }}>
          <div style={{ borderRadius: '5px' }}>
            <YouTube
              videoId={details.episodes[0].id}
              opts={opts}
              onPause={(e) => setWatchTime(getDuration(e.target.playerInfo.currentTime))}
            />
          </div>
          <div className={'d-flex flex-column p-4 pb-0 '}>
            <span
              style={{
                fontWeight: 'bold',
                fontSize: '2rem',
                lineHeight: '1.2',
                marginBottom: '.5rem',
              }}
              className={'textEllipsis'}
            >
              {details.title}
            </span>
            <span className={'textEllipsis'}>{details.description}</span>
            <span style={{ fontStyle: 'italic' }}>{details.genre}</span>
          </div>
          <div className='d-flex flex-column p-4' style={{}}>
            <div className='d-flex align-items-center justify-content-between mb-3 border-bottom'>
              <h2 className='text-bold'>Episodes</h2>

              <Form.Select
                aria-label='Season No. Select'
                className='text-white align-self-end cursor-pointer mb-2'
                style={{
                  width: 'max-content',
                  backgroundColor: 'var(--gray-color)',
                  backgroundImage: `url(${ChevronDownIcon})`,
                }}
                onChange={(e) => getEpisodes(details.episodes, e.target.value)}
              >
                {seasons.map((season) => (
                  <option defaultValue={details.season} value={season}>
                    Season {season}
                  </option>
                ))}
                <option>View All</option>
              </Form.Select>
            </div>

            <motion.div
              variants={listVariants}
              initial='hidden'
              animate={'visible'}
              className='hide-scroll'
              style={{ maxHeight: '280px', overflowY: 'scroll' }}
            >
              {episodes.map((el, idx) => (
                <motion.div variants={itemVariants} className='item'>
                  <div className='d-flex justify-content gap-3 align-items-center mb-2 pb-1 border-bottom'>
                    <span>{idx + 1}</span>
                    <img
                      alt='img'
                      src={el.thumbnail}
                      className={`${classes.episodesImg} cursor-pointer`}
                      onClick={() => handleClick(el)}
                    />

                    <div
                      className='d-flex flex-column mt-2'
                      style={{
                        overflow: 'hidden',
                      }}
                    >
                      <div className={`d-flex justify-content-between ${classes.episodeDetails}`}>
                        <span
                          style={{
                            fontWeight: 'bold',
                            ...textStyle,
                          }}
                        >
                          {el.title}
                        </span>

                        <span style={{ fontSize: '.9rem', overflow: 'hidden' }}>
                          {getDuration(el.duration)}
                        </span>
                      </div>
                      <span className={`textEllipsis`} style={{ color: '#898989' }}>
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
