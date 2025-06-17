import React, { useEffect, useRef, useState, } from 'react';
import videoListData from '../constant/jsxData/VideoListData';
import { useDispatch, useSelector } from 'react-redux';
import { setVideoData, setVideoList } from '../store/slice/VideoSlice';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import VideoPlayer from '../components/video/VideoPlayer';
import { useGetDataQuery, useSingleVideoDataQuery } from '../store/service/HomeService';
import { Skeleton } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Link } from 'react-router-dom';
import Category from './Category';
import ShowMoreButton from '../components/ShowMoreButton';
import Video_cart from '../components/video/Video_cart';
import HorizentalSwiperVideoMobile from '../components/swiper/HorizentalSwiperVideoMobile';
import SwiperSliderReels from '../components/swiper/SwiperSliderReels';

const VideoPlayback = () => {
    const dispatch = useDispatch();
    const params = useParams()
    const navigate = useNavigate()
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [videoUrl, setVideoUrl] = useState('');
    const { data: videoTitle } = useSingleVideoDataQuery(location?.state?.item?.cat_id);
    const [displayedItems, setDisplayedItems] = useState({});
    const [subDisplayedItems, setSubDisplayedItems] = useState({});
    const prevWindowWidth = useRef(window.innerWidth);
    const { data: getVideoCategory, isLoading, isError } = useGetDataQuery();
    const getVideoCategorys = useSelector((state) => state.video.videoData);

    useEffect(() => {
        if (getVideoCategory) {
            dispatch(setVideoData(getVideoCategory));
        }
    }, [dispatch, videoTitle, getVideoCategory]);


    const handleVideoPlay = (item) => {
        setVideoUrl(item.url)
        navigate(`/video_player/${encodeURIComponent(item.url)}`, { state: { item: item } });
    };


    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const urlParam = searchParams.get('videoUrl');
        if (urlParam) {
            setVideoUrl(urlParam);
        } else {
            setVideoUrl(params.id);
        }
    }, []);

    const handleShowMore = (category, type) => {
        setDisplayedItems(prevCounts => {
            const newDisplayedItems = { ...prevCounts };
            if (type === 'hrz') {
                newDisplayedItems[category][type] += 4;
            } else if (type === 'vrt') {
                newDisplayedItems[category][type] += 7;
            }
            return newDisplayedItems;
        });
    };


    const getItemsCountBasedOnBreakpoint = () => {
        const width = window.innerWidth;
        if (width <= 500) return { hrz: 1, vrt: 2 };
        if (width <= 599) return { hrz: 1, vrt: 2 };
        if (width <= 664) return { hrz: 2, vrt: 2 };
        if (width <= 913) return { hrz: 2, vrt: 3 };
        if (width <= 999) return { hrz: 2, vrt: 4 };
        if (width <= 1145) return { hrz: 3, vrt: 4 };
        if (width <= 1300) return { hrz: 3, vrt: 5 };
        if (width <= 1350) return { hrz: 3, vrt: 6 };
        if (width <= 1662) return { hrz: 4, vrt: 6 };
        return { hrz: 4, vrt: 7 };
    };

    useEffect(() => {
        const updateDisplayedItems = () => {
            const currentWidth = window.innerWidth;
            if (currentWidth !== prevWindowWidth.current) {
                if (getVideoCategorys) {
                    const categories = Object.keys(getVideoCategory?.data || {});
                    const initialDisplayedItems = categories.reduce((acc, category) => {
                        const itemsCount = getItemsCountBasedOnBreakpoint();
                        acc[category] = { hrz: itemsCount.hrz, vrt: itemsCount.vrt };
                        return acc;
                    }, {});
                    setDisplayedItems(initialDisplayedItems);
                }
                prevWindowWidth.current = currentWidth;
            }
        };

        const updateSubDisplayedItems = () => {
            const currentWidth = window.innerWidth;
            if (currentWidth !== prevWindowWidth.current) {
                if (getVideoCategorys) {
                    const categories = Object.keys(getVideoCategory?.data || {});
                    const initialDisplayedItems = categories.reduce((acc, category) => {
                        acc[category] = {};
                        getVideoCategory?.data[category]?.forEach((parent, parentIndex) => {
                            if (parent.is_parent === 1) {
                                parent.content.forEach((subCat, subIndex) => {
                                    const itemsCount = getItemsCountBasedOnBreakpoint();
                                    acc[category][`${parentIndex}-${subIndex}`] = { hrz: itemsCount.hrz, vrt: itemsCount.vrt };
                                });
                            }
                        });
                        return acc;
                    }, {});
                    setSubDisplayedItems(initialDisplayedItems);
                }
                prevWindowWidth.current = currentWidth;
            }
        };

        const setInitialDisplayedItems = () => {
            if (getVideoCategorys) {
                const categories = Object.keys(getVideoCategory?.data || {});
                const initialDisplayedItems = categories.reduce((acc, category) => {
                    const itemsCount = getItemsCountBasedOnBreakpoint();
                    acc[category] = { hrz: itemsCount.hrz, vrt: itemsCount.vrt };
                    return acc;
                }, {});
                setDisplayedItems(initialDisplayedItems);

                const initialSubDisplayedItems = categories.reduce((acc, category) => {
                    acc[category] = {};
                    getVideoCategory?.data[category]?.forEach((parent, parentIndex) => {
                        if (parent.is_parent === 1) {
                            parent.content.forEach((subCat, subIndex) => {
                                const itemsCount = getItemsCountBasedOnBreakpoint();
                                acc[category][`${parentIndex}-${subIndex}`] = { hrz: itemsCount.hrz, vrt: itemsCount.vrt };
                            });
                        }
                    });
                    return acc;
                }, {});
                setSubDisplayedItems(initialSubDisplayedItems);
            }
        };

        setInitialDisplayedItems();
        window.addEventListener('resize', updateDisplayedItems);
        window.addEventListener('resize', updateSubDisplayedItems);

        return () => {
            window.removeEventListener('resize', updateDisplayedItems);
            window.removeEventListener('resize', updateSubDisplayedItems);
        };
    }, [getVideoCategorys]);

    const getDisplayedItems = (category, type) => {
        return Math.min(
            displayedItems[category]?.[type] || 0,
            getVideoCategorys?.data?.[category][0].content?.filter(video => video.type === type)?.length || 0
        );
    };

    const getSubDisplayedItems = (category, parentIndex, subIndex, type) => {
        const key = `${parentIndex}-${subIndex}`;
        return Math.min(
            subDisplayedItems[category]?.[key]?.[type] || 0,
            getVideoCategorys?.data[category]?.[parentIndex]?.content?.[subIndex]?.content?.filter(video => video.type === type)?.length || 0
        );
    };

    const handleSubShowMore = (category, parentIndex, subIndex, type) => {
        setSubDisplayedItems(prevCounts => {
            const newDisplayedItems = { ...prevCounts };
            const key = `${parentIndex}-${subIndex}`;
            if (!newDisplayedItems[category]) {
                newDisplayedItems[category] = {};
            }
            if (!newDisplayedItems[category][key]) {
                newDisplayedItems[category][key] = { hrz: 0, vrt: 0 };
            }
            if (type === 'hrz') {
                newDisplayedItems[category][key][type] += 4;
            } else if (type === 'vrt') {
                newDisplayedItems[category][key][type] += 7;
            }
            return newDisplayedItems;
        });
    };

    return (
        <>
            <div className='video_play_back pb-15'>
                <div className="">
                    <Link to={'/'}><KeyboardBackspaceIcon sx={{ fontSize: "50px", color: '#fff', marginBottom: "25px" }} /></Link>
                    <div className='w-[100%] h-[638px] video_contaier '>
                        <div className='single_video_play h-full'>
                            <VideoPlayer url={params?.id} autoplay={true} controls={true} />
                        </div>
                        {/* {
                            videoTitle?.data?.map((item, index) => {
                                if (item.type == 'hrz') {
                                    if (params.id == item.url) {
                                        return (
                                            <div key={index} className='mt-2 pt-5 title_video text-white'>
                                                <h3>{item.p_name}</h3>
                                            </div>
                                        )
                                    }
                                }
                            })
                        } */}
                    </div>
                    <section className='py-8  border-t border-white w-full mt-20'>
                        {!isLoading && !isError && getVideoCategorys?.data && Object.keys(getVideoCategorys?.data).filter(category => {
                            return getVideoCategorys?.data[category].some(item => item.count > 0);
                        }).map(category => {
                            return (
                                <>
                                    {getVideoCategorys?.data[category]?.map((isParent, parentIndex) => {
                                        if (isParent?.is_parent == 1) {
                                            return (
                                                <>
                                                    {isParent?.content?.map((Sub_Cat, subIndex) => {
                                                        if (Sub_Cat.cat_name == location?.state?.category) {
                                                            return (
                                                                <>
                                                                    <div className='sm:hidden onmobilepadding px-4 pb-10' key={subIndex}> {/* Use subIndex as the key */}
                                                                        <div className='category_center'>
                                                                            <h3 className='text-white inline-block'>{Sub_Cat.cat_name}</h3>
                                                                        </div>
                                                                        <div className='pt-8 layout_video layout_videos'>
                                                                            {Sub_Cat?.content?.filter(video => video.type === 'hrz')?.slice(0, getSubDisplayedItems(category, parentIndex, subIndex, 'hrz')).map((item, hrzIndex) => (
                                                                                <Video_cart category={Sub_Cat.cat_name} key={hrzIndex} item={item} />
                                                                            ))}
                                                                        </div>
                                                                        {
                                                                            getSubDisplayedItems(category, parentIndex, subIndex, 'hrz') < Sub_Cat?.content?.filter(video => video.type === 'hrz')?.length && (
                                                                                <ShowMoreButton
                                                                                    label="Show More"
                                                                                    totalItems={Sub_Cat?.content?.filter(video => video.type === 'hrz')?.length}
                                                                                    displayedItems={getSubDisplayedItems(category, parentIndex, subIndex, 'hrz')}
                                                                                    onClick={() => handleSubShowMore(category, parentIndex, subIndex, 'hrz')}
                                                                                />
                                                                            )
                                                                        }
                                                                        <div className='pt-8 layout_videos_Short'>
                                                                            {Sub_Cat?.content?.filter(video => video.type === 'vrt')?.slice(0, getSubDisplayedItems(category, parentIndex, subIndex, 'vrt')).map((item, vrtIndex) => (
                                                                                <Video_cart key={vrtIndex} item={item} />
                                                                            ))}
                                                                        </div>
                                                                        {
                                                                            getSubDisplayedItems(category, parentIndex, subIndex, 'vrt') < Sub_Cat?.content?.filter(video => video.type === 'vrt')?.length && (
                                                                                <ShowMoreButton
                                                                                    label="Show More"
                                                                                    totalItems={Sub_Cat?.content?.filter(video => video.type === 'vrt')?.length}
                                                                                    displayedItems={getSubDisplayedItems(category, parentIndex, subIndex, 'vrt')}
                                                                                    onClick={() => handleSubShowMore(category, parentIndex, subIndex, 'vrt')}
                                                                                />
                                                                            )
                                                                        }
                                                                    </div>
                                                                    {window.innerWidth < 640 &&
                                                                        <div className='onmobilepadding px-4' key={subIndex}> {/* Use subIndex as the key */}
                                                                            <div id={Sub_Cat.cat_name} className='category_center'>
                                                                                <Link className='nav_links' to={`/category/${encodeURIComponent(Sub_Cat.cat_name)}`}>
                                                                                    <h3 className='text-white mt-6 inline-block'>{Sub_Cat.cat_name}</h3></Link>
                                                                            </div>
                                                                            {/* <div className='pt-8 layout_video layout_videos'>
                                                                        {sortedContent?.filter(video => video.type === 'hrz')?.slice(0, getSubDisplayedItems(category, parentIndex, subIndex, 'hrz')).map((item, hrzIndex) => (
                                                                          <Video_cart category={Sub_Cat.cat_name} key={hrzIndex} item={item} />
                                                                        ))}
                                                                      </div>
                                                                      {
                                                                        getSubDisplayedItems(category, parentIndex, subIndex, 'hrz') < Sub_Cat?.content?.filter(video => video.type === 'hrz')?.length && (
                                                                          <ShowMoreButton
                                                                            label="Show More"
                                                                            totalItems={Sub_Cat?.content?.filter(video => video.type === 'hrz')?.length}
                                                                            displayedItems={getSubDisplayedItems(category, parentIndex, subIndex, 'hrz')}
                                                                            onClick={() => handleSubShowMore(category, parentIndex, subIndex, 'hrz')}
                                                                          />
                                                                        )
                                                                      } */}
                                                                            <HorizentalSwiperVideoMobile category={Sub_Cat?.cat_name} key={subIndex} item={Sub_Cat} />

                                                                            <SwiperSliderReels key={subIndex} item={Sub_Cat} />
                                                                        </div>
                                                                    }
                                                                </>
                                                            );
                                                        }
                                                    })}
                                                </>
                                            );
                                        } else {
                                            const isActiveCategory = category === location?.state?.category;
                                            return (
                                                <>
                                                    {isActiveCategory &&
                                                        <div className='sm:hidden onmobilepadding px-4 pb-10' key={parentIndex}>
                                                            <div className='category_center'>
                                                                <h1 className='text-white mt-10 inline-block'>{location?.state?.category}</h1>
                                                            </div>
                                                            <div className='pt-8 layout_video layout_videos'>
                                                                {isParent?.content?.filter(video => video.type === 'hrz')?.slice(0, getDisplayedItems(category, 'hrz')).map((item, hrzIndex) => (
                                                                    <Video_cart key={hrzIndex} item={item} />
                                                                ))}
                                                            </div>
                                                            {getDisplayedItems(category, 'hrz') < getVideoCategorys?.data[category][0].content?.filter(video => video.type === 'hrz')?.length && (
                                                                <ShowMoreButton
                                                                    label="Show More"
                                                                    totalItems={getVideoCategorys?.data[category][0].content?.filter(video => video.type === 'hrz')?.length}
                                                                    displayedItems={getDisplayedItems(category, 'hrz')}
                                                                    onClick={() => handleShowMore(category, 'hrz')}
                                                                />
                                                            )}
                                                            <div className='pt-8 layout_videos_Short'>
                                                                {isParent?.content?.filter(video => video.type === 'vrt')?.slice(0, getDisplayedItems(category, 'vrt')).map((item, vrtIndex) => (
                                                                    <Video_cart key={vrtIndex} item={item} />
                                                                ))}
                                                            </div>
                                                            {getDisplayedItems(category, 'vrt') < getVideoCategorys?.data[category][0].content?.filter(video => video.type === 'vrt')?.length && (
                                                                <ShowMoreButton
                                                                    label="Show More"
                                                                    totalItems={getVideoCategorys?.data[category][0].content?.filter(video => video.type === 'vrt')?.length}
                                                                    displayedItems={getDisplayedItems(category, 'vrt')}
                                                                    onClick={() => handleShowMore(category, 'vrt')}
                                                                />
                                                            )}
                                                        </div>
                                                    }
                                                    {isActiveCategory && window.innerWidth < 640 &&
                                                        <div className='onmobilepadding px-4' key={parentIndex}>
                                                            <HorizentalSwiperVideoMobile category={isParent.cat_name} key={parentIndex} item={isParent} />
                                                            <SwiperSliderReels key={parentIndex} item={isParent} />
                                                        </div>
                                                    }
                                                </>
                                            );;
                                        }
                                    })}
                                </>
                            )
                        })}
                    </section >
                </div>
            </div>
        </>
    );
};

export default VideoPlayback;
