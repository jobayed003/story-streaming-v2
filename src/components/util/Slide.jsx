import { Row } from 'react-bootstrap';
import Slider from 'react-slick';
import './slide.css';

const Slide = ({ children, videosCount }) => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    slidesToShow: videosCount === 3 ? videosCount : videosCount - 1,
    autoplay: true,
    autoplaySpeed: 2000,
    // centerMode: true,
    pauseonhover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          centerMode: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 2,
          initialSlide: 2,
          centerMode: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
        },
      },
    ],

    nextArrow: <NextArrow></NextArrow>,
    prevArrow: <PrevArrow></PrevArrow>,
  };
  return (
    <Row className='mb-5 mt-2 d-flex justify-content-center'>
      <Slider className='slider-wrapper' {...settings}>
        {children}
      </Slider>
    </Row>
  );
};

export default Slide;

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', background: 'none' }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', background: 'none' }}
      onClick={onClick}
    />
  );
};
