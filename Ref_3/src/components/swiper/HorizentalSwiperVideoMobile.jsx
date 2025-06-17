import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Pagination, Navigation, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import VideoPlayer from '../video/VideoPlayer';

const HorizontalSwiperVideoMobile = ({ item, category }) => {
    const swiperRef = useRef(null);
    const videoRefs = useRef([]);
    const maskRefs = useRef([]);
    const observerRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(null);
    const [isInView, setIsInView] = useState(new Array(item?.length || 0).fill(false));
    const [isMaskVisible, setIsMaskVisible] = useState(true);
    const touchStartX = useRef(null);
    const maskHideTimeout = useRef(null);
    const [isInteractingWithControls, setIsInteractingWithControls] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const fullscreenVideoRef = useRef(null);

    const breakpoints = {
        1600: { slidesPerView: 4, spaceBetween: 20, slidesPerGroup: 3 },
        1350: { slidesPerView: 3, spaceBetween: 20, slidesPerGroup: 3 },
        1000: { slidesPerView: 3, spaceBetween: 20, slidesPerGroup: 2 },
        568: { slidesPerView: 2, spaceBetween: 20, slidesPerGroup: 2 },
        0: { slidesPerView: 1, spaceBetween: 20, slidesPerGroup: 1 },
    };


    const isMobile = window.innerWidth <= 1024;

    const isRotateMobile = window.innerWidth <= 568;

    const handleIntersection = useCallback((entries) => {
        entries.forEach((entry) => {
            const index = parseInt(entry.target.getAttribute('data-index'), 10);
            
            if (!document.fullscreenElement) {
                setIsInView((prevInView) => {
                    const newInView = [...prevInView];
                    newInView[index] = entry.isIntersecting;
                    return newInView;
                });
            }                    
        });
    }, []);

    useEffect(() => {
        if (!isMobile) return;
       
        observerRef.current = new IntersectionObserver(handleIntersection, { threshold: 0.5 });

        videoRefs.current.forEach((ref, index) => {
            if (ref) observerRef.current.observe(ref);
        });

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [isMobile, handleIntersection]);

    useEffect(() => {
        const handleFullScreenChange = () => {
            const isFullScreenNow = !!document.fullscreenElement;
            setIsFullScreen(isFullScreenNow);

            if (isFullScreenNow) {
                fullscreenVideoRef.current = videoRefs.current[activeIndex]?.querySelector('video, iframe');
                
                setIsInView((prevInView) => {
                    const newInView = new Array(prevInView.length).fill(false);
                    newInView[activeIndex] = true;
                    return newInView;
                });
            } else {
                videoRefs.current.forEach((ref, index) => {
                    if (ref && observerRef.current) {
                        observerRef.current.observe(ref);
                    }
                });
                fullscreenVideoRef.current = null;
            }
        };

        const handleOrientationChange = () => {
            if (isFullScreen && fullscreenVideoRef.current) {
                setTimeout(() => {
                    fullscreenVideoRef.current.scrollIntoView({ behavior: 'auto', block: 'center' });
                }, 100);
            }
        };

        document.addEventListener('fullscreenchange', handleFullScreenChange);
        window.addEventListener('orientationchange', handleOrientationChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
            window.removeEventListener('orientationchange', handleOrientationChange);
        };
    }, [activeIndex, isFullScreen]);

    useEffect(() => {
        if (isMobile && isInView[activeIndex]) {
            const videoElement = videoRefs.current[activeIndex]?.querySelector('video, iframe');
            if (videoElement) {
                if (videoElement.tagName === 'VIDEO') {
                    videoElement.play().catch(error => console.error('Error playing video:', error));
                } else if (videoElement.tagName === 'IFRAME') {
                    console.log('Play Vimeo video');
                }
            }
        }
    }, [activeIndex, isInView, isMobile]);

    const handleMouseEnter = (index) => {
        if (!isMobile) {
            setIsHovered(index);
            const videoElement = videoRefs.current[index]?.querySelector('video, iframe');
            if (videoElement) {
                if (videoElement.tagName === 'VIDEO') {
                    videoElement.play().catch(error => console.error('Error playing video:', error));
                } else if (videoElement.tagName === 'IFRAME') {
                    console.log('Play Vimeo video on desktop');
                }
            }
        }
    };

    const handleMouseLeave = (index) => {
        if (!isMobile) {
            setIsHovered(null);
            const videoElement = videoRefs.current[index]?.querySelector('video, iframe');
            if (videoElement) {
                if (videoElement.tagName === 'VIDEO') {
                    videoElement.pause();
                    videoElement.currentTime = 0;
                } else if (videoElement.tagName === 'IFRAME') {
                    console.log('Pause Vimeo video on desktop');
                }
            }
        }
    };

    const handleTouchStart = (e) => {
        if (!isInteractingWithControls) {
            touchStartX.current = e.touches[0].clientX;
        }
    };

    const handleTouchMove = (e) => {
        if (touchStartX.current !== null && !isInteractingWithControls) {
            const touchEndX = e.touches[0].clientX;
            const diff = touchStartX.current - touchEndX;

            if (Math.abs(diff) > 5) {
                e.preventDefault();
            }
        }
    };

    const handleTouchEnd = (e) => {
        if (touchStartX.current !== null && !isInteractingWithControls) {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX.current - touchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0 && activeIndex < item.length - 1) {
                    swiperRef.current.slideNext();
                } else if (diff < 0 && activeIndex > 0) {
                    swiperRef.current.slidePrev();
                }
                setIsMaskVisible(true);
            }
        }
        touchStartX.current = null;
    };

    const handleVideoClick = (e) => {
        setIsMaskVisible(false);
        setIsInteractingWithControls(true);
        if (maskHideTimeout.current) {
            clearTimeout(maskHideTimeout.current);
        }
        maskHideTimeout.current = setTimeout(() => {
            setIsMaskVisible(true);
            setIsInteractingWithControls(false);
        }, 5000);

        if (!isFullScreen) {
            fullscreenVideoRef.current = e.target.closest('.video-container').querySelector('video, iframe');
        }
    };

    return (
        <div className='video_play_back pb-4'>
            <div className="text-white w-full h-full">
                {item ? (
                    <Swiper
                        modules={[Pagination, Navigation, Scrollbar, A11y]}
                        spaceBetween={5}
                        slidesPerView={1}
                        breakpoints= {isRotateMobile ? false : breakpoints}
                       
                        pagination={{ clickable: true }}
                        scrollbar={{ draggable: true }}
                       
                        navigation={{ prevEl: '.swiper-button-prev', nextEl: '.swiper-button-next' }}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        onSlideChange={(swiper) => {
                            setActiveIndex(swiper.activeIndex);
                            setIsMaskVisible(true);
                            setIsInteractingWithControls(false);
                            if (isFullScreen) {
                                fullscreenVideoRef.current = videoRefs.current[swiper.activeIndex]?.querySelector('video, iframe');
                            }
                        }}
                        allowTouchMove={isMobile ? false : true}
                        initialSlide={activeIndex}
                    >
                        {item?.filter(video => video.type === 'hrz').map((url, index) => (
                            <SwiperSlide key={index}>
                                <div
                                    className='cursor-pointer w-full video_cart relative'
                                    onMouseEnter={() => handleMouseEnter(index)}
                                    onMouseLeave={() => handleMouseLeave(index)}
                                    ref={el => (videoRefs.current[index] = el)}
                                    data-index={index}
                                    onClick={handleVideoClick}
                                >
                                    {(isHovered === index || (isMobile && activeIndex === index && (isInView[index] || isFullScreen))) ? (
                                        <div className='w-full h-[220px] cstm_hrz_height relative video-container'>
                                            <VideoPlayer url={url.url} autoplay={true} controls={true} />
                                            {isMobile && isMaskVisible && !isFullScreen && (
                                                <div
                                                    ref={el => (maskRefs.current[index] = el)}
                                                    className='absolute left-0'
                                                    style={{
                                                        top: '60px',
                                                        bottom: '60px',
                                                        width: '80%',
                                                        zIndex: 9999
                                                    }}
                                                    onTouchStart={handleTouchStart}
                                                    onTouchMove={handleTouchMove}
                                                    onTouchEnd={handleTouchEnd}
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                        {isMobile && isInView[index] ? (
                                            <div className='w-full h-[220px] cstm_hrz_height relative video-container'>
                                                <VideoPlayer url={url.url} autoplay={true} controls={true} />
                                                {isMobile && isMaskVisible && !isFullScreen && (
                                                    <div
                                                        ref={el => (maskRefs.current[index] = el)}
                                                        className='absolute left-0'
                                                        style={{
                                                            top: '60px',
                                                            bottom: '60px',
                                                            width: '80%',
                                                            zIndex: 9999
                                                        }}
                                                        onTouchStart={handleTouchStart}
                                                        onTouchMove={handleTouchMove}
                                                        onTouchEnd={handleTouchEnd}
                                                    />
                                                )}
                                            </div>
                                        ) : (
                                            <img className='rounded-lg h-[220px] w-full object-cover cstm_hrz_height' src={`https://bouboulena.com${url.p_image}`} alt="cover photo" />
                                        )}
                                        </>
                                    )}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <p>No videos available</p>
                )}
            </div>
        </div>
    );
};

export default HorizontalSwiperVideoMobile;