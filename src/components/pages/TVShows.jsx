import { useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import VideoContextProvider from '../../context/VideoContext';
import Footer from '../UI/Footer';
import Header from '../UI/Header';
import CategoriesCard from '../Category/CategoriesCard';
import CardContainer from '../VideoCards/CardContainer';

const TVShows = () => {
  const { tvShows } = useContext(VideoContextProvider);

  return (
    <Container as='main' style={{ overflow: 'hidden' }}>
      <Header />
      <CategoriesCard sx={{ marginLeft: '.5rem' }} />

      <Row style={{ marginTop: '2rem' }}>
        <Col className='text-light'>
          <h1>TV Shows</h1>
        </Col>
      </Row>
      <CardContainer videos={tvShows} />
      <div style={{ alignSelf: 'end' }}>
        <Footer />
      </div>
    </Container>
  );
};

export default TVShows;
