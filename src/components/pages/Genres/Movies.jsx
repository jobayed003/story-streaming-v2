import { useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import { categories } from '../../../categories';
import VideoContextProvider from '../../../context/VideoContext';
import CategoriesCard from '../../Category/CategoriesCard';
import CategoryListCard from '../../Category/CategoryListCard';
import Layout from '../../UI/Layout';
import CardContainer from '../../VideoCards/CardContainer';

const Movies = () => {
  const { movies } = useContext(VideoContextProvider);

  return (
    <Layout>
      <CategoriesCard sx={{ marginLeft: '.5rem' }} />
      <Row style={{ marginTop: '2rem' }}>
        <Col className='text-light'>
          <h1>Movies</h1>
        </Col>
      </Row>
      <CardContainer videos={movies} />
      {categories.map((el) => (
        <CategoryListCard category={el} videos={movies} />
      ))}
    </Layout>
  );
};

export default Movies;
