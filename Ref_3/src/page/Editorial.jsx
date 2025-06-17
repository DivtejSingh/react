import React, { useEffect, useState } from 'react';
import { useGetDataQuery } from '../store/service/HomeService';
import { useDispatch, useSelector } from 'react-redux';
import { setVideoData } from '../store/slice/VideoSlice';
import Video_cart from '../components/video/Video_cart';
import ShowMoreButton from '../components/ShowMoreButton';

const DroneVideos = () => {
    const { data: droneVideo } = useGetDataQuery();
    const dispatch = useDispatch();
    const fetchDroneVideo = useSelector((state) => state.video.videoData);
    const [displayedItems, setDisplayedItems] = useState({});

    const getItemsCountBasedOnBreakpoint = () => {
        const width = window.innerWidth;
        if (width <= 500) {
            return { hrz: 3, vrt: 3 };
        } else if (width <= 664) {
            return { hrz: 2, vrt: 2 };
        } else if (width <= 913) {
            return { hrz: 2, vrt: 3 };
        } else if (width <= 999) {
            return { hrz: 2, vrt: 4 };
        } else if (width <= 1145) {
            return { hrz: 3, vrt: 4 };
        } else if (width <= 1300) {
            return { hrz: 3, vrt: 5 };
        } else if (width <= 1350) {
            return { hrz: 3, vrt: 6 };
        } else if (width <= 1662) {
            return { hrz: 4, vrt: 6 };
        } else {
            return { hrz: 4, vrt: 7 };
        }
    };

    useEffect(() => {
        dispatch(setVideoData(droneVideo));
    }, [droneVideo, dispatch]);

    useEffect(() => {
        const updateDisplayedItems = () => {
            if (fetchDroneVideo) {
                const categories = Object.keys(fetchDroneVideo?.data || {});
                const initialDisplayedItems = categories.reduce((acc, category) => {
                    const itemsCount = getItemsCountBasedOnBreakpoint();
                    acc[category] = { hrz: itemsCount.hrz, vrt: itemsCount.vrt };
                    return acc;
                }, {});
                setDisplayedItems(initialDisplayedItems);
            }
        };

        updateDisplayedItems(); // Set initial displayed items
        window.addEventListener('resize', updateDisplayedItems); // Update on resize

        return () => {
            window.removeEventListener('resize', updateDisplayedItems); // Cleanup on unmount
        };
    }, [fetchDroneVideo]);

    const handleShowMore = (category, type) => {
        setDisplayedItems(prevCounts => ({
            ...prevCounts,
            [category]: {
                ...prevCounts[category],
                [type]: prevCounts[category][type] + 6
            }
        }));
    };

    const getDisplayedItems = (category, type) => {
        return Math.min(displayedItems[category]?.[type] || 0, fetchDroneVideo?.data?.[category]?.filter(video => video.type === type)?.length || 0);
    };

    return (
        <div className='pt-20 pb-10 bg-black-900'>
            <div className='page_width'>
                <div className='text-white text-center'>
                    <h1 className='text-center'>REEL VIDEO EXAMPLES</h1>
                    <h3 className='px-40 sm:px-0'>All video Reels made with iPhone + stabilizer, color corrected and customizable with type/logos etc.</h3>
                </div>
                {fetchDroneVideo?.data && Object.keys(fetchDroneVideo.data).map((category, index) => {
                    if (category === "EDITORIAL BRANDED EXAMPLES") {
                        return (
                            <div key={index}>
                                <div>
                                    <div className='pt-8 layout_video layout_videos'>
                                        {fetchDroneVideo?.data[category]?.filter(video => video.type === 'hrz')?.slice(0, getDisplayedItems(category, 'hrz'))?.map((item, index) => (
                                            <Video_cart key={index} item={item} />
                                        ))}
                                    </div>
                                    {getDisplayedItems(category, 'hrz') < fetchDroneVideo?.data[category]?.filter(video => video.type === 'hrz')?.length && (
                                        <ShowMoreButton
                                            label="Show More"
                                            totalItems={fetchDroneVideo?.data[category]?.filter(video => video.type === 'hrz')?.length}
                                            displayedItems={getDisplayedItems(category, 'hrz')}
                                            onClick={() => handleShowMore(category, 'hrz')}
                                        />
                                    )}
                                </div>
                                <div className='pt-8 layout_videos_Short'>
                                    {fetchDroneVideo?.data[category]?.filter(video => video.type === 'vrt')?.slice(0, getDisplayedItems(category, 'vrt'))?.map((item, index) => (
                                        <Video_cart key={index} item={item} />
                                    ))}
                                </div>
                                {getDisplayedItems(category, 'vrt') < fetchDroneVideo?.data[category]?.filter(video => video.type === 'vrt')?.length && (
                                    <ShowMoreButton
                                        label="Show More"
                                        totalItems={fetchDroneVideo?.data[category]?.filter(video => video.type === 'vrt')?.length}
                                        displayedItems={getDisplayedItems(category, 'vrt')}
                                        onClick={() => handleShowMore(category, 'vrt')}
                                    />
                                )}
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

export default DroneVideos;
