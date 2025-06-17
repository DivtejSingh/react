import React, { useEffect, useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useRandomColorQuery } from '../store/service/HomeService';

const Header = () => {
    const [openSidebar, setOpenSidebar] = React.useState(false);
    const { data: randomColor } = useRandomColorQuery()
    const [localData, setLocalData] = useState(() => {
        const savedData = localStorage.getItem('siteinfo');
        return savedData ? JSON.parse(savedData) : null;
    });
    const location = useLocation()
    const hideHeaderRoutes = ['/reels']
    const shouldHideHeader = hideHeaderRoutes.some((route) => location.pathname.includes(route))

    useEffect(() => {
        if (randomColor) {
            localStorage.setItem('siteinfo', JSON.stringify(randomColor));
            setLocalData(randomColor);
        }
    }, [randomColor]);

    const dataToDisplay = randomColor || localData;
    const title = dataToDisplay?.siteinfo[0].value


    if (shouldHideHeader) {
      return null;
    }

    return (
        <>
            <header className='py-6 sticky top-0 bg-white z-10'>
                <div className="page_width">
                    <div className='flex items-center justify-between'>
                        <div className='cursor-pointer sm:pl-2'>
                            <MenuIcon onClick={() => setOpenSidebar(true)} />
                        </div>
                        <div>
                            <Link to='/'><h1 className='text-xl md:text-[20px] text-center font-black'>{title}</h1></Link>
                        </div>
                        <div></div>
                    </div>
                </div>
            </header >
            <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
        </>
    )
}

export default Header