import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useRandomColorQuery } from './store/service/HomeService';

const DynamicHead = () => {
    const [title, setTitle] = useState('');
    const [favicon, setFavicon] = useState('');
    const [ogImage, setOgImage] = useState('');
    const [ogTitle, setOgTitle] = useState('');
    const [ogDescription, setOgDescription] = useState('');

    const { data: localDatas } = useRandomColorQuery();

    useEffect(() => {

        if (localDatas) {
            const headerTitle = localDatas.siteinfo[1]?.value;
            const subIcon = localDatas.siteinfo[2]?.value;
            const ogTitle = localDatas.siteinfo[3]?.value;
            const ogDescription = localDatas.siteinfo[4]?.value;
            const ogImage = localDatas.siteinfo[5]?.value;



            setTitle(headerTitle || '');
            setFavicon(subIcon || '');
            setOgImage(ogImage || '');
            setOgTitle(ogTitle || '');
            setOgDescription(ogDescription || '');
        }
    }, [localDatas]);

    return (
        <Helmet>
            {title && <title>{title}</title>}
            {favicon && <link rel="icon" type="image/png" href={`https://bouboulena.com/admin/${favicon}`} />}
            {ogTitle && <meta property="og:title" content={ogTitle} />}
            {ogDescription && <meta property="og:description" content={ogDescription} />}
            {ogImage && <meta property="og:image" content={`https://bouboulena.com/admin/${ogImage}`} />}
            <meta property="og:url" content={'https://bouboulena.com/'} />
            <meta property="og:type" content="website" />
        </Helmet>
    );
}

export default DynamicHead;
