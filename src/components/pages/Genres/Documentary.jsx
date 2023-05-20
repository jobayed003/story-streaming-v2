import { useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import { categories } from '../../../categories';
import VideoContextProvider from '../../../context/VideoContext';

import CategoryListCard from '../../Category/CategoryListCard';
import Layout from '../../UI/Layout';
import CardContainer from '../../VideoCards/CardContainer';
import CategoryContainer from '../../Category/CategoryContainer';

const Documentary = () => {
  const { documentary } = useContext(VideoContextProvider);

  return (
    <Layout>
      <CategoryContainer sx={{ marginLeft: '.5rem' }} videos={documentary} />
      <Row style={{ marginTop: '2rem' }}>
        <Col className='text-light'>
          <h1>Documentary</h1>
        </Col>
      </Row>
      <CardContainer videos={documentary} />
      {categories.map((el) => (
        <CategoryListCard category={el} videos={documentary} />
      ))}
    </Layout>
  );
};

export default Documentary;
