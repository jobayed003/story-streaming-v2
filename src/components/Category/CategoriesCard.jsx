import { useContext, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { categories } from '../../categories';
import VideoContextProvider from '../../context/VideoContext';
import CardContainer from '../VideoCards/CardContainer';
import Slide from '../util/Slide';

const CategoriesCard = ({ sx }) => {
  const [clickedText, setClickedText] = useState('');

  const [filteredVid, setfilteredVid] = useState([]);

  const { seriesVideos } = useContext(VideoContextProvider);

  const handleClick = (e) => {
    setClickedText(e.target.textContent);
    const replaceAll = /\b(?:-| |,)\b/gi;
    const text = e.target.textContent.toLowerCase().replace(replaceAll, '').trim();
    const regex = new RegExp(text, 'i');

    setfilteredVid(
      seriesVideos.filter((vid) => regex.test(vid.genre.replace(replaceAll, '').trim()))
    );
  };

  return (
    <>
      <Row style={{ marginTop: '8rem', ...sx }}>
        <Slide change={{ infinite: false, centerMode: false, slidesToScroll: 1, autoplay: true }}>
          {categories.map((el) => (
            <div className='slide'>
              <div
                className='d-flex justify-content-center align-items-center fontLosBanditos cursor-pointer'
                style={{
                  width: '200px',
                  height: '100px',
                  background: '#000',
                  fontSize: '1.3rem',
                  color: 'var(--text-color)',
                  borderRadius: '5px',
                  boxShadow: 'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
                }}
                onClick={handleClick}
              >
                {el}
              </div>
            </div>
          ))}
        </Slide>
      </Row>
      {clickedText !== '' && (
        <Row style={{ marginTop: '4rem', marginBottom: '6rem' }}>
          <Col className='text-light fontLosBanditos'>
            <h1>{clickedText}</h1>
          </Col>
          <CardContainer videos={filteredVid} />
        </Row>
      )}
    </>
  );
};

export default CategoriesCard;
