// import React from 'react';
// import { Autoplay, Navigation, Pagination } from 'swiper';
// import { Swiper } from 'swiper/react';
// import './Carousel.css';

// const Carousel = ({ children }) => {
//   return (
//     <Swiper
//       spaceBetween={20}
//       loop
//       // autoplay={{
//       //   delay: 2500,
//       //   disableOnInteraction: false,
//       // }}
//       cubeEffect
//       pagination={{
//         clickable: true,
//       }}
//       navigation={true}
//       modules={[Autoplay, Pagination, Navigation]}
//       className='mySwiper'
//       centeredSlides
//       breakpoints={{
//         // when window width is >= 600px
//         600: {
//           slidesPerView: 2,
//           slidesPerGroup: 2,
//           spaceBetween: 5,
//           centeredSlides: true,
//         },
//         // when window width is >= 900px
//         900: {
//           slidesPerView: 3,
//           slidesPerGroup: 3,
//           spaceBetween: 5,
//           centeredSlides: false,
//         },
//         // when window width is >= 1200px
//         1200: {
//           slidesPerView: 4,
//           slidesPerGroup: 4,
//           spaceBetween: 5,
//           centeredSlides: false,
//         },

//         // when window width is >= 1500px
//         1500: {
//           slidesPerView: 5,
//           slidesPerGroup: 5,
//           spaceBetween: 5,
//           centeredSlides: false,
//         },

//         // when window width is >= 1800px
//         1800: {
//           slidesPerView: 5,
//           slidesPerGroup: 5,
//           spaceBetween: 8,
//           centeredSlides: false,
//         },
//       }}
//     >
//       {children}
//     </Swiper>
//   );
// };

// export default Carousel;
