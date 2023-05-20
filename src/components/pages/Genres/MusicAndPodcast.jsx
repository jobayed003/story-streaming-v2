import { useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import { categories } from '../../../categories';
import VideoContextProvider from '../../../context/VideoContext';

import CategoryListCard from '../../Category/CategoryListCard';

import Layout from '../../UI/Layout';
import CardContainer from '../../VideoCards/CardContainer';
import CategoryContainer from '../../Category/CategoryContainer';

const MusicAndPodcast = () => {
  const { musicsAndPodcast } = useContext(VideoContextProvider);

  return (
    <Layout>
      <CategoryContainer sx={{ marginLeft: '.5rem' }} videos={musicsAndPodcast} />
      <Row style={{ marginTop: '2rem' }}>
        <Col className='text-light'>
          <h1>Musics & Podcast</h1>
        </Col>
      </Row>
      <CardContainer videos={musicsAndPodcast} />
      {categories.map((el) => (
        <CategoryListCard category={el} videos={musicsAndPodcast} />
      ))}
    </Layout>
  );
};

export default MusicAndPodcast;
