import { Row } from 'react-bootstrap';
import { ListCard } from './ListCard';
import useDimension from '../hooks/useDimension';
import useStatus from '../hooks/useStatus';
import Slide from '../util/Slide';

const CardContainer = ({ videos }) => {
  // Custom Hooks
  const status = useStatus(videos);
  const size = useDimension();
  return (
    <>
      {videos.length <= 0 ? (
        <Row>{status}</Row>
      ) : size.width > 575 && videos.length < 5 ? (
        <div
          className='d-flex ms-3'
          style={{
            gap: size.width > 1200 ? '2.5rem' : '2rem',
            marginLeft: '2.5rem',
            marginBottom: '4rem',
            flexWrap: 'wrap',
            justifyContent: size.width > 500 ? 'start' : 'center',
          }}
        >
          {videos.map((el) => (
            <ListCard imgSrc={el.episodes[0].thumbnail} videoDetails={el} />
          ))}
        </div>
      ) : (
        <Slide
          change={{
            centerMode: false,
            slidesToScroll: 2,
          }}
        >
          {videos.map((el, idx) => (
            <div className='slide' key={Math.random() + idx}>
              <ListCard imgSrc={el.episodes[0].thumbnail} videoDetails={el} />
            </div>
          ))}
        </Slide>
      )}
    </>
  );
};

export default CardContainer;
