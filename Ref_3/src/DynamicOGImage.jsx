import React, { useEffect, useState } from 'react';
import { useRandomColorQuery } from './store/service/HomeService';

const DynamicOGImage = () => {
    const [image, setImage] = useState('');
    const { data: localDatas } = useRandomColorQuery();

    useEffect(() => {
        const imagePath = localDatas?.siteinfo[5]?.value
        setImage(imagePath)
    }, [localDatas]);

    useEffect(() => {
        if (image) {
            // Function to update meta tag
            const updateMetaTag = (property, content) => {
                let element = document.querySelector(`meta[property='${property}']`);
                if (!element) {
                    element = document.createElement('meta');
                    element.setAttribute('property', property);
                    document.head.appendChild(element);
                }
                element.setAttribute('content', content);
            };

            // Update the OG image meta tag
            updateMetaTag('og:image', image);
        }
    }, [image]);

    return (
        <div>
            {image && <img src={`https://bouboulena.com/admin/${image}`} alt="Dynamic OG" />}
        </div>
    );
};

export default DynamicOGImage;
