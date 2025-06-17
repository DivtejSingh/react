import React from 'react';
import VideoPlayer from './video/VideoPlayer';

const HeroSection = ({ heroSection }) => {
    return (
        <section className='hero_section'>
            <div className='text-center'>
                {heroSection?.data?.map((item, index) => (
                    <div key={index}>
                        <div className='w-full h-full relative video-background'>
                            <VideoPlayer
                                verticlyHeights={false}
                                url={item.background_content}
                                autoplay={true}
                                controls={false}
                                disableFullScreen={true}
                            />
                            {/* <iframe
                src={`${item.background_content}?h=3f73183a26&background=1&autoplay=1&loop=1&muted=1&controls=0`}
                mozallowfullscreen="true"
                webkitallowfullscreen="true"
                allow="autoplay; fullscreen; picture-in-picture"
                title="Background Video"
              ></iframe> */}
                        </div>
                        <div className='hero-content'>
                            <h1 className='text-white'>{item.heading}</h1>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

const memoizedHeroSection = React.memo(HeroSection, (prevProps, nextProps) => {
    return prevProps.heroSection === nextProps.heroSection;
});

export default memoizedHeroSection;
