import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';

import Img1 from "../../assets/banner/img1.jpg"
import Img2 from "../../assets/banner/img2.jpg"
import Img3 from "../../assets/banner/img3.jpg"
import Img4 from "../../assets/banner/img4.jpg"

import 'swiper/css';
import 'swiper/css/pagination';

import { Autoplay, Pagination } from 'swiper/modules';

const Banner = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center md:gap-56 gap-32">
      <div className="md:w-1/2 w-full text-center">
        <h1 className="md:text-48 text-30 font-bold md:leading-60">
          Latest Updates and Insights from School Community
        </h1>
        <p className="py-16">
          Explore recent posts from the community and gain valuable insights.
          Engage with the content by commenting on posts to ask questions or
          share your thoughts, and expand your knowledge with new discoveries!
        </p>
      </div>

      <div className="md:w-1/2 w-full mx-auto">
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 1500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 1,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 1,
              spaceBetween: 50,
            },
          }}
          modules={[Pagination, Autoplay]}
          className="mySwiper"
        >
          {[Img1, Img2, Img3, Img4].map((src, index) => (
            <SwiperSlide key={index}>
              <img
                src={src}
                alt=""
                className="w-full lg:h-420 sm:h-384 h-320"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Banner