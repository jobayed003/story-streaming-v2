import React from 'react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Swiper } from 'swiper/react';
import './Carousel.css';

const Carousel = ({ children }) => {
  return (
    <Swiper
      spaceBetween={20}
      loop
      slidesPerView={4}
      autoplay={{
        delay: 2500,
        disableOnInteraction: true,
      }}
      cubeEffect
      pagination={{
        clickable: true,
      }}
      navigation={true}
      modules={[Autoplay, Navigation]}
      className='mySwiper'
      centeredSlides
      breakpoints={{
        // when window width is >= 600px
        480: {
          slidesPerView: 1,
          slidesPerGroup: 1,
          spaceBetween: 5,
          centeredSlides: false,
        },
        600: {
          slidesPerView: 1,
          slidesPerGroup: 1,
          spaceBetween: 5,
          centeredSlides: false,
        },
        // when window width is >= 900px
        768: {
          slidesPerView: 2,
          slidesPerGroup: 2,
          spaceBetween: 1,
          centeredSlides: true,
        },
        900: {
          slidesPerView: 2.5,
          slidesPerGroup: 2,
          spaceBetween: 1,
          centeredSlides: false,
        },
        1024: {
          slidesPerView: 3,
          slidesPerGroup: 2,
          spaceBetween: 1,
          centeredSlides: false,
        },
        // when window width is >= 1200px
        1200: {
          slidesPerView: 4,
          slidesPerGroup: 1,
          spaceBetween: 8,
          centeredSlides: false,
        },
        1440: {
          slidesPerView: 4,
          slidesPerGroup: 4,
          spaceBetween: 5,
          centeredSlides: false,
        },

        // when window width is >= 1500px
        1500: {
          slidesPerView: 5,
          slidesPerGroup: 5,
          spaceBetween: 5,
          centeredSlides: false,
        },

        // when window width is >= 1800px
        // 1800: {
        //   slidesPerView: 4,
        //   slidesPerGroup: 4,
        //   spaceBetween: 10,
        //   centeredSlides: false,
        // },
      }}
    >
      {children}
    </Swiper>
  );
};

export default Carousel;
