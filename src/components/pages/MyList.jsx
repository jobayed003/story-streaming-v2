import { useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import StateContextProvider from '../../context/StateContext';
import CategoriesCard from '../Category/CategoriesCard';
import Footer from '../UI/Footer';
import Header from '../UI/Header';
import CardContainer from '../VideoCards/CardContainer';

const MyList = () => {
  const { favouriteVideos } = useContext(StateContextProvider);

  return (
    <Container as='main' style={{ overflow: 'hidden' }}>
      <Header />

      <CategoriesCard sx={{ marginLeft: '.5rem' }} />

      <Row style={{ marginTop: '2rem' }}>
        <Col className='text-light'>
          <h1>My List</h1>
        </Col>
      </Row>
      <CardContainer videos={favouriteVideos} />
      <div style={{ alignSelf: 'end' }}>
        <Footer />
      </div>
    </Container>
  );
};

export default MyList;
