import { Skeleton } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { useLocation } from 'react-router-dom';

const VideoPlayer = ({ url, autoplay, controls, verticlyHeights, horizentlyHeights, singlePageVideoHeight, disableFullScreen, onProgress }) => {
    const playerRef = useRef();
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    // const isVimeoUrl = url.includes('vimeo.com');
    // if (isVimeoUrl) {
    //     return <div>This is a Vimeo video. Please use Vimeo's embed code to play it.</div>;
    // }
    const handleOnReady = () => {
        setLoading(false);
    };


    const handleOnStart = () => {
        setLoading(false);
    };

    useEffect(() => {
        const hash = location.hash;
        if (hash && playerRef.current) {
            const startTime = parseFloat(hash.replace('#t=', '').replace('s', ''));
            if (!isNaN(startTime)) {
                playerRef.current.seekTo(startTime);
            }
        }
    }, [location.hash]);

    const handleFullscreen = () => {
        const player = playerRef.current.getInternalPlayer();
        if (player.requestFullscreen) {
            player.requestFullscreen();
        } else if (player.webkitRequestFullscreen) { /* Safari */
            player.webkitRequestFullscreen();
        } else if (player.mozRequestFullScreen) { /* Firefox */
            player.mozRequestFullScreen();
        } else if (player.msRequestFullscreen) { /* IE11 */
            player.msRequestFullscreen();
        }
    };

    return (
        <div className='relative w-full h-full'>
            {loading &&
                <div className={`w-full rounded-lg absolute top-0 left-0  ${verticlyHeights ? 'cover_img h-[410px]' : singlePageVideoHeight ? 'video_contaier h-[638px]' : horizentlyHeights ? 'h-[220px] rounded-none cstm_hrz_height' : ''}`}>
                    <Skeleton variant='rectangular' sx={{ bgcolor: "#3c3a3a", height: '100%', width: "100%", borderRadius: "8px" }}></Skeleton>
                </div>
            }
            <ReactPlayer
                ref={playerRef}
                url={url}
                width="100%"
                height="100%"
                controls={controls}
                className="rounded-lg react-player cursor-pointer"
                muted={autoplay}
                playsinline={true}
                playing={autoplay}
                preload="auto"
                pip={false}
                loop={autoplay}
                onReady={handleOnReady}
                onStart={handleOnStart}
                onProgress={onProgress}
                // light={'https://i.vimeocdn.com/video/1660362500-217ef9c26062e8ce9834d87fbc0e1fa4f8981990aa066aa1bfe052ba13b6a7a8-d?mw=1700&mh=956'}
                config={{
                    vimeo: {
                        autoplay: true,
                        playsinline: true,
                    },
                    file: {
                        attributes: {
                            disablePictureInPicture: disableFullScreen,
                            playsInline: true,
                            controlsList: disableFullScreen ? 'nodownload nofullscreen noplaybackrate pip ' : 'nodownload'
                        }
                    }
                }}
            />
            {/* <button onClick={handleFullscreen} className="overflow_full fullscreen-button text-[red]"></button> */}
        </div>
    );
};

export default VideoPlayer;
