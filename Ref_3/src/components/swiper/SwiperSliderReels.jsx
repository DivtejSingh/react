import React, { useRef, useState, useEffect } from "react";
import { Pagination, Scrollbar, Navigation, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import VideoPlayer from "../video/VideoPlayer";
import Video_cart from "../video/Video_cart";

const SwiperSliderReels = ({ item }) => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showNavigation, setShowNavigation] = useState(false);

  const breakpoints = {
    // when window width is >= 768px
    1663: {
      slidesPerView: 7,
      spaceBetween: 20,
      slidesPerGroup: 4,
    },
    1301: {
      slidesPerView: 6,
      spaceBetween: 20,
      slidesPerGroup: 4,
    },
    1146: {
      slidesPerView: 5,
      spaceBetween: 20,
      slidesPerGroup: 5,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 20,
      slidesPerGroup: 4,
    },
    913: {
      slidesPerView: 3,
      spaceBetween: 20,
      slidesPerGroup: 3,
    },
    // when window width is >= 568px and < 768px
    755: {
      slidesPerView: 3,
      spaceBetween: 20,
      slidesPerGroup: 3,
    },
    // when window width is < 568px
    0: {
      slidesPerView: 2,
      spaceBetween: 20,
      slidesPerGroup: 2,
    },
  };

  const handleSwiperInit = (swiper) => {
    swiperRef.current = swiper;
    setShowNavigation(swiper.slides.length > swiper.params.slidesPerView);
  };

  const handleSlideChange = () => {
    const currentIndex = swiperRef.current.realIndex;
    setActiveIndex(currentIndex);
  };

  return (
    <div className="video_play_back pb-4">
      <div className="text-white">
        {item ? (
          <Swiper
            modules={[Pagination, Navigation, Scrollbar, A11y]}
            spaceBetween={5}
            slidesPerView={7}
            breakpoints={breakpoints}
            pagination={{ clickable: true }}
            navigation={{ prevEl: '.swiper-button-prev', nextEl: '.swiper-button-next' }}
            onSwiper={handleSwiperInit}
            onSlideChange={handleSlideChange}
          // onSwiper={(swiper) => {
          //   swiperRef.current = swiper;
          // }}
          // onSlideChange={() => {
          //   const currentIndex = swiperRef.current.realIndex;
          //   setActiveIndex(currentIndex);
          // }}
          >
            {item?.filter(video => video.type === 'vrt').map((url, index) => {
              return (
                <SwiperSlide key={index}>
                  <Video_cart item={url} />
                </SwiperSlide>
              )
            })}
            {/* {showNavigation && (
              <>
                <div className="swiper-button-prev horizental_prev"></div>
                <div className="swiper-button-next horizental_next"></div>
              </>
            )} */}
          </Swiper>
        ) : (
          <p>No videos available</p>
        )}
      </div>
    </div>
  );
};

export default SwiperSliderReels;
