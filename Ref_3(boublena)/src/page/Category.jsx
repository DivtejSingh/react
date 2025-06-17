import React, { useEffect, useState, useRef } from 'react';
import WithHomeLayout from '../hoc/WithHomeLayout';
import Video_cart from '../components/video/Video_cart';
import { useGetDataQuery, usePartnerSectionQuery, useRandomColorQuery } from '../store/service/HomeService';
import { useDispatch, useSelector } from 'react-redux';
import { setVideoData } from '../store/slice/VideoSlice';
import ShowMoreButton from '../components/ShowMoreButton';
import { Skeleton, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import '../constant/stylefotterset.css/stylefotterset.css'; // Import CSS module
import HorizentalSwiperVideoMobile from '../components/swiper/HorizentalSwiperVideoMobile';
import SwiperSliderReels from '../components/swiper/SwiperSliderReels';
import { Link } from 'react-router-dom';

const Category = () => {
  const { data: getVideoCategory, isError, isLoading } = useGetDataQuery();
  const dispatch = useDispatch();
  const getVideoCategorys = useSelector((state) => state.video.videoData);
  const [displayedItems, setDisplayedItems] = useState({});
  const [subDisplayedItems, setSubDisplayedItems] = useState({});
  const prevWindowWidth = useRef(window.innerWidth);
  const params = useParams()
  const { data: randomColor } = useRandomColorQuery()

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  useEffect(() => {
    if (getVideoCategory) {
      dispatch(setVideoData(getVideoCategory));
    }
  }, [getVideoCategory, dispatch]);

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

  const getBackgroundColor = (category, randomColors) => {
    if (!randomColors) return "";
    const colorData = randomColors.find(color => color.background_of === category);
    return colorData ? colorData.hex_color : "";
  };
  const getColor = (category, randomColors) => {
    if (!randomColors) return "";
    const colorData = randomColors.find(color => color.background_of === category);
    return colorData ? colorData.title_hex : "";
  };

  const scrolltop = window.scrollTo(0, 0);
  useEffect(() => {
  }, [scrolltop]);


  return (
    <>
      <section className='h-full'>
        {isLoading && (
          <>
            <div className='layout_videos'>
              {[...Array(20)].map((_, index) => (
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
          <>
            {getVideoCategorys?.data[category]?.map((isParent, parentIndex) => {
              const sortedContent = isParent?.content ? [...isParent.content].sort((a, b) => a.video_position - b.video_position) : [];
              if (isParent?.is_parent == 1) {
                return (
                  <>
                    {isParent?.content?.map((Sub_Cat, subIndex) => {
                      if (Sub_Cat.cat_name == params.cat_name) {
                        const sortedContent = Sub_Cat?.content ? [...Sub_Cat.content].sort((a, b) => a.video_position - b.video_position) : [];
                        return (
                          <>
                            {/* <div className='sm:hidden onmobilepadding px-4 pb-10' style={{ backgroundColor: getBackgroundColor(category, randomColor?.data) }} key={subIndex}> 
                              <div className='category_center px-4'>
                                <h3 style={{ color: getColor(category, randomColor?.data) }} className='text-white mt-6 inline-block'>{Sub_Cat.cat_name}</h3>
                              </div>
                              {Sub_Cat.hrz_count > 0 && <div className='pt-8 layout_video layout_videos'>
                                {Sub_Cat?.content?.filter(video => video.type === 'hrz')?.slice(0, getSubDisplayedItems(category, parentIndex, subIndex, 'hrz')).map((item, hrzIndex) => (
                                  <Video_cart category={Sub_Cat?.cat_name} key={hrzIndex} item={item} />
                                ))}
                              </div>}
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
                              {Sub_Cat.vrt_count > 0 && <div className='pt-8 layout_videos_Short'>
                                {Sub_Cat?.content?.filter(video => video.type === 'vrt')?.slice(0, getSubDisplayedItems(category, parentIndex, subIndex, 'vrt')).map((item, vrtIndex) => (
                                  <Video_cart key={vrtIndex} item={item} />
                                ))}
                              </div>}
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
                            </div> */}

                            {/* {window.innerWidth < 640 && */}
                            <div style={{ backgroundColor: getBackgroundColor(category, randomColor?.data) }} className='onmobilepadding px-4' key={subIndex}> {/* Use subIndex as the key */}
                              <div id={Sub_Cat.cat_name} className='category_center'>
                                <Link className='nav_links' to={`/category/${encodeURIComponent(Sub_Cat.cat_name)}`}>
                                  <h3 style={{ color: getColor(category, randomColor?.data) }} className='text-white mt-6 inline-block'>{Sub_Cat.cat_name}</h3></Link>
                              </div>
                              <HorizentalSwiperVideoMobile category={Sub_Cat?.cat_name} key={`${subIndex}-hrz`} item={sortedContent} />

                              <SwiperSliderReels key={`${subIndex}-vrt`} item={sortedContent} />
                            </div>
                            {/* } */}
                          </>

                        );
                      }
                    })}
                  </>
                );
              }
            })}
          </>
        ))}

        {!isLoading && !isError && (!getVideoCategorys?.data || Object.keys(getVideoCategorys?.data).length === 0) && (
          <Typography variant="h6" className='text-center text-white'>
            No videos available.
          </Typography>
        )}
      </section >
    </>
  );
};

export default Category;
