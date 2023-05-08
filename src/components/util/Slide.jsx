import { Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import Slider from 'react-slick';
import './Slide.css';

const Slide = ({ children, videoCount }) => {
  // const slidesToShow = videoCount > 4 ? 4 : videoCount;
  const path = useLocation().pathname.replace('/', '');

  const settings = {
    // infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    // autoplay: true,
    autoplaySpeed: 2000,
    // centerMode: true,
    pauseonhover: true,
    // variableWidth: true,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 3,
          infinite: true,
          // centerMode: true,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2.66,
          slidesToScroll: 3,
          infinite: true,
          // centerMode: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
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
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
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
      style={{ ...style, display: 'block', background: 'none', right: '20px', zIndex: '5' }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', background: 'none', left: '-5px', zIndex: '5' }}
      onClick={onClick}
    />
  );
};

/*  responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: videoCount > 4 ? 3 : videoCount,
          slidesToScroll: 3,
          infinite: true,
          // centerMode: true,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2.66,
          slidesToScroll: 3,
          infinite: true,
          centerMode: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: videoCount > 4 ? 3 : videoCount,
          slidesToScroll: 2,
          infinite: true,
          centerMode: true,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: videoCount > 4 ? 3 : videoCount,
          slidesToScroll: 1,
          infinite: true,
          centerMode: true,
        },
      },

      {
        breakpoint: 768,
        settings: {
          slidesToShow: videoCount > 4 ? 2 : videoCount,
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
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ], */
