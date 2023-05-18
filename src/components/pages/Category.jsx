import { getAuth } from 'firebase/auth';
import { useContext, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import VideoContextProvider from '../../context/VideoContext';
import Footer from '../UI/Footer';
import Header from '../UI/Header';

import useLoadingState from '../hooks/useLoadingState';

import CardContainer from '../util/CardContainer';

import Slide from '../util/Slide';
import classes from './Category.module.css';

const categories = [
  'Drama',
  'Action',
  'Comedy',
  'Horror',
  'Sci-Fi',
  'Thriller',
  'Fantasy',
  'Short Story',
  'Fiction',
  'Humor',
  'Music',
  'Podcast',
  'Realty TV',
  'Crime Fiction',
  'Documentary',
  'Science And Education',
];

const Category = () => {
  const [clickedText, setClickedText] = useState('');
  // const [newCategories, setNewCategories] = useState([]);

  const [filteredVid, setfilteredVid] = useState([]);

  const { seriesVideos } = useContext(VideoContextProvider);
  const [user] = useAuthState(getAuth());
  const loadingState = useLoadingState();

  const handleClick = (e) => {
    setClickedText(e.target.textContent);
    const replaceAll = /\b(?:-| |,)\b/gi;
    const text = e.target.textContent.toLowerCase().replace(replaceAll, '').trim();
    const regex = new RegExp(text, 'i');

    setfilteredVid(
      seriesVideos.filter((vid) => regex.test(vid.genre.replace(replaceAll, '').trim()))
    );

    // const idx = categories.indexOf(clickedText);
    // categories.splice(idx, 1);

    // console.log(categories);
  };

  return (
    <Container as='main' className='fontLosBanditos' style={{ overflow: 'hidden' }}>
      {!user && loadingState}
      {user && (
        <>
          <Header />
          <Container className={classes.container}>
            <Row style={{ marginTop: '8rem' }}>
              <Slide
                change={{ infinite: false, centerMode: false, slidesToScroll: 1, autoplay: true }}
              >
                {categories.map((el) => (
                  <div className='slide'>
                    <div
                      className='d-flex justify-content-center align-items-center fontLosBanditos cursor-pointer'
                      style={{
                        width: '200px',
                        height: '100px',
                        background: '#000',
                        fontSize: '1.3rem',
                        color: 'var(--text-color)',
                        borderRadius: '5px',
                        boxShadow:
                          'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
                      }}
                      onClick={handleClick}
                    >
                      {el}
                    </div>
                  </div>
                ))}
              </Slide>
            </Row>
            {clickedText !== '' && (
              <Row style={{ marginTop: '4rem' }}>
                <Col className='text-light fontLosBanditos'>
                  <h1>{clickedText}</h1>
                </Col>
                <CardContainer videos={filteredVid} />
              </Row>
            )}
            {categories.map((el) => (
              <CategoryListCard category={el} />
            ))}

            <div style={{ alignSelf: 'end' }}>
              <Footer />
            </div>
          </Container>
        </>
      )}
    </Container>
  );
};

export default Category;

const CategoryListCard = ({ category }) => {
  const [videos, setVideos] = useState([]);

  const { seriesVideos } = useContext(VideoContextProvider);

  useEffect(() => {
    const replaceAll = /\b(?:-| |,)\b/gi;
    const text = category.toLowerCase().replace(replaceAll, '').trim();

    const regex = new RegExp(text, 'i');

    const vid = seriesVideos.filter((vid) => regex.test(vid.genre.replace(replaceAll, '').trim()));
    setVideos(vid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Row style={{ marginTop: '2rem' }}>
        <Col className='text-light'>
          <h1>{category}</h1>
        </Col>
      </Row>

      <CardContainer videos={videos} />
    </>
  );
};
