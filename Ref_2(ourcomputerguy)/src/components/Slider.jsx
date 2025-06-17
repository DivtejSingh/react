import React from 'react'
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Images from '../constant/Images'

const Slider = ({ sliderImg }) => {
    console.log(sliderImg)
    return (
        <Carousel className='pt-8' autoPlay={true} interval={2000} infiniteLoop={true} showThumbs={false}>
            {
                sliderImg?.status && sliderImg?.data.map((item, index) => (
                    <div key={index}>
                        <img className='h-[256px]' src={item.slider} alt='slider Image' />
                    </div>
                ))
            }
        </Carousel>
    )
}

export default Slider