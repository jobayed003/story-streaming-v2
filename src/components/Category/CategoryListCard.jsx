import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import CardContainer from '../VideoCards/CardContainer';

const CategoryListCard = ({ category, videos }) => {
  const [categoryVideos, setCategoryVideoss] = useState([]);

  useEffect(() => {
    const replaceAll = /\b(?:-| |,)\b/gi;
    const text = category.toLowerCase().replace(replaceAll, '').trim();

    const regex = new RegExp(text, 'i');

    setCategoryVideoss(
      videos.filter((vid) => regex.test(vid.genre.replace(replaceAll, '').trim()))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Row style={{ paddingTop: '6.5rem' }}>
        <Col className='text-light'>
          <h1>{category}</h1>
        </Col>
      </Row>

      <CardContainer videos={categoryVideos} />
    </>
  );
};

export default CategoryListCard;
