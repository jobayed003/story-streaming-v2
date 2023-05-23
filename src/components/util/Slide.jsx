import { Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import Slider from 'react-slick';
import './Slide.css';

const Slide = ({ children, change }) => {
  const path = useLocation().pathname.replace('/', '');

  const settings = {
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    autoplay: true,
    autoplaySpeed: 2000,
    centerMode: true,
    ...change,
    centerPadding: '0px',
    pauseonhover: true,
    // variableWidth: true,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          infinite: true,
          // centerMode: true,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          centerMode: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          centerMode: false,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: path.includes('upload') ? 2 : 3,
          slidesToScroll: 2,
          infinite: true,
          centerMode: false,
        },
      },

      {
        breakpoint: 768,
        settings: {
          slidesToShow: path.includes('upload') ? 1 : 2,
          slidesToScroll: 1,
          infinite: true,

          // centerMode: true,
        },
      },

      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          // centerMode: true,
        },
      },
    ],

    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };
  return (
    <Row className='mb-5 mt-2 d-flex justify-content-center ms-0 ps-0'>
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
      style={{
        ...style,
        display: 'block',
        background: 'none',
        right: '7px',
        zIndex: '5',
        width: '10px',
        height: '10px',
      }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'block',
        background: 'none',
        left: '-11px',
        zIndex: '5',
        width: '10px',
        height: '10px',
      }}
      onClick={onClick}
    />
  );
};
