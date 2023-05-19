import { getAuth } from 'firebase/auth';
import { useContext, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import VideoContextProvider from '../../context/VideoContext';
import Footer from '../UI/Footer';
import Header from '../UI/Header';

import useLoadingState from '../hooks/useLoadingState';

import CardContainer from '../VideoCards/CardContainer';

import CategoriesCard from '../Category/CategoriesCard';

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
  const [user] = useAuthState(getAuth());
  const loadingState = useLoadingState();

  return (
    <Container as='main' className='fontLosBanditos' style={{ overflow: 'hidden' }}>
      {!user && loadingState}
      {user && (
        <>
          <Header />
          <Container className={classes.container}>
            <CategoriesCard />
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
