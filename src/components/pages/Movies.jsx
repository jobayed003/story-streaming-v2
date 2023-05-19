import { useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import VideoContextProvider from '../../context/VideoContext';
import CategoriesCard from '../Category/CategoriesCard';
import Footer from '../UI/Footer';
import Header from '../UI/Header';
import CardContainer from '../VideoCards/CardContainer';

const Movies = () => {
  const { movies } = useContext(VideoContextProvider);

  return (
    <Container as='main' style={{ overflow: 'hidden' }}>
      <Header />

      <CategoriesCard sx={{ marginLeft: '.5rem' }} />

      <Row style={{ marginTop: '2rem' }}>
        <Col className='text-light'>
          <h1>Movies</h1>
        </Col>
      </Row>
      <CardContainer videos={movies} />
      <div style={{ alignSelf: 'end' }}>
        <Footer />
      </div>
    </Container>
  );
};

export default Movies;
