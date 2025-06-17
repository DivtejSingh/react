import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/mousewheel';
import { Navigation, Mousewheel } from 'swiper/modules';
import { useLocation, useParams } from 'react-router-dom';
import { useVerticleReelsQuery } from '../../store/service/VerticleService';
import VideoPlayer from '../video/VideoPlayer';

const VerticleReels = () => {
    const swiperRef = useRef(null);
    const { id: videoId } = useParams();
    const { state } = useLocation();
    const cat_id = state?.item?.cat_id;
    const { data: verticalReelsData, refetch, isLoading, isError } = useVerticleReelsQuery(cat_id);

    const [verticalReels, setVerticalReels] = useState([]);
    const [initialSlide, setInitialSlide] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (verticalReelsData) {
            setVerticalReels(verticalReelsData.data);
            if (videoId) {
                const initialIndex = verticalReelsData.data.findIndex(video => video.url === decodeURIComponent(videoId));
                if (initialIndex !== -1) {
                    setInitialSlide(initialIndex);
                    setActiveIndex(initialIndex);
                }
            }
        }
    }, [verticalReelsData, videoId]);

    const handleSlideChange = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            const newIndex = swiperRef.current.swiper.realIndex;
            setActiveIndex(newIndex);
            if (newIndex === 0 && swiperRef.current.swiper.touches.diff > 0) {
                refetch().then(newData => {
                    if (newData.data.length > 0) {
                        setVerticalReels(newData.data);
                    }
                });
            }
        }
    };

    useEffect(() => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideTo(initialSlide, 0);
        }
    }, [initialSlide]);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading vertical reels videos</div>;

    return (
        <div className=''>
            <div className=" w-full bg-black-900  text-white">
                <Swiper
                    ref={swiperRef}
                    direction="vertical"
                    allowTouchMove
                    initialSlide={initialSlide}
                    pagination={{ clickable: true }}
                    navigation={{ prevEl: '.swiper-button-prev', nextEl: '.swiper-button-next' }}
                    mousewheel
                    onSlideChange={handleSlideChange}
                    modules={[Navigation, Mousewheel]}
                    className="mySwiper"
                    style={{ height: "100vh" }}
                >
                    {verticalReels.length > 0 ? (
                        verticalReels.map((item, index) => (
                            <SwiperSlide className='w-full' key={index} style={{ pointerEvents: 'auto' }}>
                                <div className='w-full absolute bottom-16 top-0 sm:bottom-56 z-10'></div>
                                <div className='w-full h-full' >
                                    <VideoPlayer controls={true} url={item.url} autoplay={index === activeIndex} />
                                </div>
                            </SwiperSlide>
                        ))
                    ) : (
                        <SwiperSlide className='w-full' style={{ pointerEvents: 'auto' }}>
                            <div className='w-full h-full flex items-center justify-center' style={{ pointerEvents: 'none' }}>
                                <p>No videos available</p>
                            </div>
                        </SwiperSlide>
                    )}
                    <div className="swiper-button-prev prev-btn"></div>
                    <div className="swiper-button-next next-btn"></div>
                </Swiper>
            </div>
        </div>
    );
};

export default VerticleReels;
