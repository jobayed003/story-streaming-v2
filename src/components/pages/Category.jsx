import { useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import VideoContextProvider from '../../context/VideoContext';
import Footer from '../UI/Footer';
import Header from '../UI/Header';
import useDimension from '../hooks/useDimension';
import useStatus from '../hooks/useStatus';
import { ListCard } from '../util/ListCard';
import classes from './Category.module.css';

const Category = () => {
  const { seriesVideos } = useContext(VideoContextProvider);
  const { pathname } = useLocation();
  const status = useStatus();
  const { width } = useDimension();
  const path = pathname.replace('/category/', '');

  const replaceAll = /\b(?:-| |,)\b/gi;
  const text = path.toLowerCase().replace(replaceAll, '').trim();
  const regex = new RegExp(text, 'i');

  const filteredVideos = seriesVideos.filter((vid) =>
    regex.test(vid.genre.replace(replaceAll, '').trim())
  );

  return (
    <>
      <Header />
      <Container
        className={classes.container}
        style={{
          gridTemplateRows: `1fr ${filteredVideos.length < 4 ? '30vh' : 'max-content'} 1fr`,
        }}
      >
        <Row>
          <Col
            className='text-light custom_font'
            style={{ marginTop: '8rem', marginLeft: '4.9rem' }}
          >
            <h1>{path.toUpperCase()}</h1>
          </Col>
        </Row>
        <Row
          className={`hide-scroll ${classes.videoContainer} custom_font`}
          style={{ left: filteredVideos.length <= 0 ? '' : '6%' }}
        >
          <div
            className={`d-flex gap-4 flex-wrap justify-content-${width > 475 ? 'start' : 'center'}`}
          >
            {filteredVideos.length <= 0 ? (
              <div style={{ margin: '0 auto' }}>{status}</div>
            ) : (
              filteredVideos.map((el) => (
                <ListCard videoDetails={el} imgSrc={el.episodes[0].thumbnail} />
              ))
            )}
          </div>
        </Row>
        <div className='justify-self-end'>
          <Footer />
        </div>
      </Container>
    </>
  );
};

export default Category;
