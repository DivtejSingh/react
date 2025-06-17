import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";
import { useSelector } from "react-redux";

const Video_cart = ({ item, category }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [urls, setUrl] = useState("");
  const navigate = useNavigate();
  const getVideoCategorys = useSelector((state) => state.video.videoData);
  const videoRef = useRef();
  const [playedSeconds, setPlayedSeconds] = useState(0);

  useEffect(() => {
    if (getItemsCountBasedOnBreakpoint()) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            setUrl(item.url);
          } else {
            setIsInView(false);
          }
        },
        { threshold: 1 }
      );

      if (videoRef.current) {
        observer.observe(videoRef.current);
      }

      return () => {
        if (videoRef.current) {
          observer.unobserve(videoRef.current);
        }
      };
    }
  }, []);

  const handleVideoPlay = (item) => {
    navigate(`/video_player/${encodeURIComponent(item.url)}#t=${playedSeconds}s`, { state: { item, category: category, playedSeconds } });
  };

  const handleMouseEnter = (url) => {
    setUrl(url);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const getItemsCountBasedOnBreakpoint = () => {
    const width = window.innerWidth;
    if (width <= 500) {
      return true;
    }
  };

  const handleProgress = (state) => {
    setPlayedSeconds(state.playedSeconds); // Track played seconds
  };

  const handleShortVideoPlay = (item) => {
    // navigate(`/reels/${encodeURIComponent(item.url)}#t=${playedSeconds}s`, { state: { item, category: category, playedSeconds } });
    navigate(`/reels/${encodeURIComponent(item?.url)}`, { state: { item } });
  };

  // const handleFullscreen = () => {
  //     const player = videoRef.current.getInternalPlayer();
  //     if (player.requestFullscreen) {
  //         player.requestFullscreen();
  //     } else if (player.webkitRequestFullscreen) { /* Safari */
  //         player.webkitRequestFullscreen();
  //     } else if (player.mozRequestFullScreen) { /* Firefox */
  //         player.mozRequestFullScreen();
  //     } else if (player.msRequestFullscreen) { /* IE11 */
  //         player.msRequestFullscreen();
  //     }
  // };

  const innerDesktopWidth = window.innerWidth;


  if (item.type == "hrz") {
    return (
      <>
        <div ref={videoRef} className="cursor-pointer w-full video_cart relative" onMouseLeave={handleMouseLeave} onMouseEnter={() => handleMouseEnter(item.url)}>
          {/* <div className='overflow_full'></div> */}
          <div className="w-full">
            {isHovered || isInView ? (
              <div className="w-full h-[220px] cstm_hrz_height">
                <VideoPlayer url={urls} horizentlyHeights={true} autoplay={true} controls={true} onProgress={handleProgress} />
              </div>
            ) : (
              <img className="rounded-lg h-[220px] w-full object-cover cstm_hrz_height" src={`https://bouboulena.com${item.p_image}`} alt="cover photo" />
            )}
            {/* <button onClick={handleFullscreen} className="fullscreen-button text-white">Fullscreen tinku</button> */}
          </div>
          {getVideoCategorys?.titles ? (
            <div className="flex gap-3 pt-3">
              <div className="text-white">
                <span className="text-gray-900">{item.p_name}</span>
                <br />
                <span className="text-gray-900">{item.view}</span>
              </div>
            </div>
          ) : null}
        </div>
      </>
    );
  } else if (item.type == "vrt") {
    return (
      <>
        <div className="cursor-pointer w-full" onClick={() => handleMouseEnter(item.url)} onMouseEnter={() => handleMouseEnter(item.url)} onMouseLeave={innerDesktopWidth>600 ? handleMouseLeave : null}>
          {/* <div className="cursor-pointer w-full relative" onClick={() => handleShortVideoPlay(item)}> */}
          {/* <div className="overflow_full"></div> */}
          <div className="w-full">
            {isHovered || isInView ? (
              <div className="h-[410px] w-full short_video">
                <VideoPlayer url={urls} autoplay={true} verticlyHeights={true} controls={true} />
              </div>
            ) : (
              <img className="rounded-lg h-[410px] w-full object-cover cover_img" src={`https://bouboulena.com${item.p_image}`} alt="" />
            )}
          </div>
          {getVideoCategorys?.titles ? (
            <div className="flex gap-3 pt-3">
              <div className="text-white">
                <h2 className="text-gray-900">{item?.p_desc}</h2>
                <span className="text-gray-900">{item?.view}</span>
              </div>
            </div>
          ) : null}
        </div>
      </>
    );
    // else {
    //   return (
    //     <>
    //       <div className="cursor-pointer w-full" onMouseEnter={() => handleMouseEnter(item.url)} onMouseLeave={handleMouseLeave} onClick={() => handleShortVideoPlay(item)}>
    //         {/* <div className='cursor-pointer w-full relative' onClick={() => handleShortVideoPlay(item)}> */}
    //         <div className="overflow_full"></div>
    //         <div className="w-full">
    //           {isHovered || isInView ? (
    //             <div className="h-[410px] w-full short_video">
    //               <VideoPlayer url={urls} autoplay={true} verticlyHeights={true} controls={true} />
    //             </div>
    //           ) : (
    //             <img className="rounded-lg h-[410px] w-full object-cover cover_img" src={`https://bouboulena.com${item.p_image}`} alt="" />
    //           )}
    //         </div>
    //         {getVideoCategorys?.titles ? (
    //           <div className="flex gap-3 pt-3">
    //             <div className="text-white">
    //               <h2 className="text-gray-900">{item?.p_desc}</h2>
    //               <span className="text-gray-900">{item?.view}</span>
    //             </div>
    //           </div>
    //         ) : null}
    //       </div>
    //     </>
    //   );
    // }
  }
};

export default Video_cart;
