import React, { useEffect, useState, useRef } from 'react';
import Video_cart from '../../components/video/Video_cart';
import { useGetDataQuery, usePartnerSectionQuery } from '../../store/service/HomeService';
import { useDispatch, useSelector } from 'react-redux';
import { setVideoData } from '../../store/slice/VideoSlice';
import { Skeleton, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import SwiperSliderReels from '../swiper/SwiperSliderReels';
// import styles from './Home.module.css'; // Import CSS module

const MobileVerticle = () => {
    const { data: getVideoCategory, isError, isLoading } = useGetDataQuery();
    const { data: heroSection, isLoading: heroSectionLoading } = usePartnerSectionQuery();
    const dispatch = useDispatch();
    const getVideoCategorys = useSelector((state) => state.video.videoData);
    const [displayedItems, setDisplayedItems] = useState({});
    const [subDisplayedItems, setSubDisplayedItems] = useState({});
    const prevWindowWidth = useRef(window.innerWidth);

    useEffect(() => {
        if (getVideoCategory) {
            dispatch(setVideoData(getVideoCategory));
        }
    }, [getVideoCategory, dispatch]);


    return (
        <>

            <section className='bg-black-900 py-8'>
                <div className="page_width">
                    {isLoading && (
                        <>
                            <div className='category_center pb-4'>
                                <Skeleton
                                    variant='text'
                                    sx={{ bgcolor: "#3c3a3a", paddingTop: "10px", width: '20%', height: "100px" }}
                                />
                            </div>
                            <div className='layout_videos'>
                                {[...Array(4)].map((_, index) => (
                                    <div key={index}>
                                        <Skeleton
                                            variant='rectangular'
                                            sx={{ bgcolor: "#3c3a3a", height: "200px", width: "100%" }}
                                        />
                                        <Skeleton
                                            variant='text'
                                            sx={{ bgcolor: "#3c3a3a", paddingTop: "10px", width: '85%' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {isError && (
                        <Typography variant="h6" color="error" className='text-center'>
                            Failed to load videos. Please try again later.
                        </Typography>
                    )}

                    {!isLoading && !isError && getVideoCategorys?.data && Object.keys(getVideoCategorys?.data).filter(category => {
                        return getVideoCategorys?.data[category].some(item => item.count > 0);
                    }).map(category => (
                        <div key={category}>
                            <div id={category} className='category_center'>
                                <Link className='nav_links' to={{ pathname: `/categorys/${encodeURIComponent(category)}` }}>
                                    <h1 className='text-white mt-10 inline-block'>{category}</h1>
                                </Link>
                            </div>
                            {/* <div style={{ backgroundColor: getBackgroundColor(category, randomColor.data) }}> */}
                            <div>
                                {getVideoCategorys?.data[category]?.map((isParent, parentIndex) => {
                                    const sortedContent = isParent?.content ? [...isParent.content].sort((a, b) => a.video_position - b.video_position) : [];
                                    if (isParent?.is_parent == 1) {
                                        return (
                                            <div key={parentIndex}>
                                                {isParent?.content?.map((Sub_Cat, subIndex) => {
                                                    const sortedContent = Sub_Cat?.content ? [...Sub_Cat.content].sort((a, b) => a.video_position - b.video_position) : [];
                                                    if (Sub_Cat.count > 0) {
                                                        return (
                                                            <div key={subIndex}> {/* Use subIndex as the key */}
                                                                <div id={Sub_Cat.cat_name} className='category_center'>
                                                                    <Link className='nav_links' to={`/category/${encodeURIComponent(Sub_Cat.cat_name)}`}>
                                                                        <h3 className='text-white mt-6 inline-block'>{Sub_Cat.cat_name}</h3></Link>
                                                                </div>
                                                                {/* <div className='pt-8 layout_video layout_videos'>
                                                                    {sortedContent?.filter(video => video.type === 'hrz').map((item, hrzIndex) => (
                                                                        <Video_cart category={Sub_Cat.cat_name} key={hrzIndex} item={item} />
                                                                    ))}
                                                                </div> */}
                                                                <div className=''>
                                                                    {/* {sortedContent?.filter(video => video.type === 'vrt').map((item, vrtIndex) => ( */}
                                                                    <SwiperSliderReels key={subIndex} item={Sub_Cat} />
                                                                    {/* ))} */}
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                })}
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div key={parentIndex}>
                                                {/* <div className='pt-8 layout_video layout_videos'>
                                                    {sortedContent?.filter(video => video.type === 'hrz').map((item, hrzIndex) => (
                                                        <Video_cart category={isParent.cat_name} key={hrzIndex} item={item} />
                                                    ))}
                                                </div> */}
                                                <div className=''>
                                                    {/* {sortedContent?.filter(video => video.type === 'vrt').map((item, vrtIndex) => ( */}
                                                    <SwiperSliderReels key={parentIndex} item={isParent} />
                                                    {/* ))} */}
                                                </div>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                    ))}

                    {!isLoading && !isError && (!getVideoCategorys?.data || Object.keys(getVideoCategorys?.data).length === 0) && (
                        <Typography variant="h6" className='text-center text-white'>
                            No videos available.
                        </Typography>
                    )}
                </div>
            </section >
        </>
    );
};

export default MobileVerticle;
