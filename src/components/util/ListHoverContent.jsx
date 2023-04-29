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
      {/* <Row>
        <Carousel>
          {/* <Row className='mb-5 mt-2 d-flex justify-content-center ms-0 ps-0'> 
          {videos.map((el, idx) => (
            <SwiperSlide className='ms-1'>
              <ListCard imgSrc={thumbnail[idx]} videoDetails={el} />
            </SwiperSlide>
          ))}
           </Row> 
        </Carousel>
      </Row> 
    */}
      {videos.length <= 0 ? (
        <Row>{status}</Row>
      ) : videos.length <= 4 ? (
        <div
          className='d-flex ms-3'
          style={{
            gap: '4rem',
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
              style={{ width: size > 500 ? '400px' : '300px' }}
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