import React from 'react'
import Images from "../constant/Images"
import { useState, useEffect } from 'react';

const Client = ({ clientLogo }) => {
    const [images, setImages] = useState([]);
    const [speed, setSpeed] = useState(0);

    const combinedImages = [...images, ...images, ...images, ...images, ...images, ...images];

    useEffect(() => {
        if (clientLogo && clientLogo.data && clientLogo.data[0] && clientLogo.data[0].value) {
            setImages(clientLogo.data[0].value);
        }
    }, [clientLogo]);

    useEffect(() => {
        if (clientLogo && clientLogo.data && clientLogo.data[1] && clientLogo.data[1].value) {
            setSpeed(clientLogo.data[1].value);
        }
    }, [clientLogo]);


    return (
        <>
            <div className="marquee-container">
                <h3 className='text-center text-black'>Clients</h3>
                <div className="marquee" style={{
                    animation: `marquee-animation ${speed}s linear infinite`
                }}>
                    {combinedImages.map((imageSrc, index) => (
                        // <div key={index} className='inline-block sm:w-[70%] lg:w-[48%] xl:w-[31%] w-[15%] cursor-pointer mt-10'>
                        <div key={index} className='inline-block cursor-pointer pt-[40px] px-10'>
                            <img className='h-[110px]' src={`https://bouboulena.com/admin/assets/uploads/clientlogos/${imageSrc}`} alt={`Image ${index}`} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );

}

export default Client