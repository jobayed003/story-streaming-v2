import { Row } from 'react-bootstrap';
import { ListCard } from './ListCard';

import { SwiperSlide } from 'swiper/react';
import useDimension from '../hooks/useDimension';
import useStatus from '../hooks/useStatus';
import Carousel from './Carousel';
import Slide from './Slide';

const ListHoverContent = ({ videos, thumbnail }) => {
  // Custom Hooks
  const status = useStatus(videos);
  const size = useDimension();

  return (
    <>
      {videos.length <= 0 ? (
        <Row>{status}</Row>
      ) : size.width > 575 && videos.length < 4 ? (
        <div
          className='d-flex ms-3'
          style={{
            gap: size.width > 1200 ? '4.5rem' : '2rem',
            marginLeft: '2.5rem',
            marginBottom: '4rem',
            flexWrap: 'wrap',
            justifyContent: size.width > 575 ? 'start' : 'center',
          }}
        >
          {videos.map((el, idx) => (
            <ListCard imgSrc={thumbnail[idx]} videoDetails={el} />
          ))}
        </div>
      ) : (
        <Slide>
          {videos.map((el, idx) => (
            <div
              className='slide'
              key={Math.random() + idx}
              style={{ width: size.width > 500 ? '400px' : '300px' }}
            >
              <ListCard imgSrc={thumbnail[idx]} videoDetails={el} />
            </div>
          ))}
        </Slide>
      )}
    </>
  );
};

export default ListHoverContent;
