import { useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import { categories } from '../../../categories';
import StateContextProvider from '../../../context/StateContext';
import CategoryContainer from '../../Category/CategoryContainer';
import CategoryListCard from '../../Category/CategoryListCard';
import Layout from '../../UI/Layout';
import CardContainer from '../../VideoCards/CardContainer';

const MyList = () => {
  const { favouriteVideos } = useContext(StateContextProvider);

  return (
    <Layout>
      <CategoryContainer sx={{ marginLeft: '.5rem' }} videos={favouriteVideos} />
      <Row style={{ marginTop: '2rem' }}>
        <Col className='text-light'>
          <h1>My List</h1>
        </Col>
      </Row>
      <CardContainer videos={favouriteVideos} />
      {categories.map((el) => (
        <CategoryListCard category={el} videos={favouriteVideos} />
      ))}
    </Layout>
  );
};

export default MyList;
