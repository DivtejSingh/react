import React, { useState } from 'react'
import VideoPlayer from './VideoPlayer'

const ShortVideo_cart = ({ item }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [urls, setUrl] = useState('');

    const handleMouseEnter = (url) => {
        setUrl(url);
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    return (
        <div className='sm:w-[100%] lg:w-[48%] xl:w-[31%] w-[15.77%] cursor-pointer' onMouseEnter={() => handleMouseEnter(item.videoUrl)} onMouseLeave={handleMouseLeave}>
            <div>
                <div
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {isHovered ? (
                        <div className='h-[500px] w-full'>
                            <VideoPlayer url={item.videoUrl} disableFullScreen={true} />
                        </div>
                    ) : (
                        <img className='rounded-lg h-[500px] w-full object-cover' src={item?.src} alt="" />
                    )}

                </div>
            </div>
            <div className='flex gap-3 pt-3'>
                <div className='text-white'>
                    <h2 className='text-white'>{item?.songName}</h2>
                    <span className='text-gray-900'>{item?.view}</span>
                </div>
            </div>
        </div>
    )
}

export default ShortVideo_cart