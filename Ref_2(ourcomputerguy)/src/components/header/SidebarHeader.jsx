import { Box, Button, Drawer, Menu, MenuItem } from '@mui/material'
import React, { useState } from 'react'
import Images from '../../constant/Images'
import { Link } from 'react-router-dom'

const SidebarHeader = ({ setHeaderOpen, headerOpen }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const logOut = () => {
        localStorage.clear()
    };

    return (
        <Drawer open={headerOpen} onClose={() => setHeaderOpen(false)}>
            <Box sx={{ width: '300px' }}>
                <div className='flex items-center justify-center gap-4 py-10 border-[#ccc] border-b'>
                    <img src={Images.Logo_img} alt="logo" />
                </div>
                <ul className='flex flex-col px-14 pt-4 gap-4'>
                    <Link to='/user/dashboard'><MenuItem>Home</MenuItem></Link>
                    <Link to='/user/products'><MenuItem>Products</MenuItem></Link>
                    <Link to='/user/myorder'><MenuItem>My Order</MenuItem></Link>
                    <Link to='/'><MenuItem onClick={logOut}>Logout</MenuItem></Link>
                </ul>
            </Box>
        </Drawer>
    )
}

export default SidebarHeader