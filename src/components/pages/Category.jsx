import { getAuth } from 'firebase/auth';
import { useContext } from 'react';
import { Container } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import VideoContextProvider from '../../context/VideoContext';
import Footer from '../UI/Footer';
import Header from '../UI/Header';

import CategoriesCard from '../Category/CategoriesCard';
import useLoadingState from '../hooks/useLoadingState';

import { categories } from '../../categories';
import CategoryListCard from '../Category/CategoryListCard';
import Layout from '../UI/Layout';
import classes from './Category.module.css';

const Category = () => {
  const [user] = useAuthState(getAuth());
  const loadingState = useLoadingState();
  const { seriesVideos } = useContext(VideoContextProvider);

  return (
    <Container as='main' className='fontLosBanditos' style={{ overflow: 'hidden' }}>
      {!user && loadingState}
      {user && (
        <Layout>
          <CategoriesCard sx={{ marginLeft: '.5rem' }} />
          {categories.map((el) => (
            <CategoryListCard category={el} videos={seriesVideos} />
          ))}
        </Layout>
      )}
    </Container>
  );
};

export default Category;
