import { getAuth } from 'firebase/auth';
import { useContext } from 'react';
import { Container } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import { categories } from '../../categories';
import VideoContextProvider from '../../context/VideoContext';

import CategoryContainer from '../Category/CategoryContainer';
import CategoryListCard from '../Category/CategoryListCard';
import Layout from '../UI/Layout';
import useLoadingState from '../hooks/useLoadingState';

const Category = () => {
  const [user] = useAuthState(getAuth());
  const loadingState = useLoadingState();
  const { seriesVideos } = useContext(VideoContextProvider);

  return (
    <Container as='main' className='' style={{ overflow: 'hidden' }}>
      {!user && loadingState}
      {user && (
        <Layout>
          <CategoryContainer sx={{ marginLeft: '.5rem' }} videos={seriesVideos} />
          {categories.map((el) => (
            <CategoryListCard category={el} videos={seriesVideos} />
          ))}
        </Layout>
      )}
    </Container>
  );
};

export default Category;
