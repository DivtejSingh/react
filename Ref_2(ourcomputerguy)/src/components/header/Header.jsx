import React, { useState } from 'react'
import Images from '../../constant/Images'
import { Button, Menu, MenuItem } from '@mui/material'
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import SidebarHeader from './SidebarHeader';

const Header = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [headerOpen, setHeaderOpen] = useState(false);
    const open = Boolean(anchorEl);
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
        <header className='bg-white py-5'>
            <div className="container">
                <div className='flex items-center justify-between' >
                    <div className='flex items-center gap-4 main_logo_img'>
                        <img src={Images.Logo_img} alt="logo" />
                    </div>
                    <div className='sm:block cursor-pointer hidden' onClick={()=>setHeaderOpen(true)}>
                        <MenuIcon/>
                    </div>
                    <nav className='sm:hidden'>
                        <ul className='flex gap-10'>
                            <Link to='/user/dashboard'><MenuItem>Home</MenuItem></Link>
                            <Link to='/user/products'><MenuItem>Products</MenuItem></Link>
                            <Link to='/user/myorder'><MenuItem>My Order</MenuItem></Link>
                        </ul>
                    </nav>
                    <div className='sm:hidden'>
                        <Button
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                        >
                            <img className='cursor-pointer 2xl:w-9 h-10 object-cover rounded-full border border-primary-900 p-[2px]' src='https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D' />
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <Link to='/user/myprofile'><MenuItem onClick={handleClose}>My Profile</MenuItem></Link>
                            <Link to='/user/myorder'><MenuItem onClick={handleClose}>My Order</MenuItem></Link>
                            {/* <MenuItem>Product Request</MenuItem> */}
                            <Link to='/'><MenuItem onClick={logOut}>Logout</MenuItem></Link>
                        </Menu>
                    </div>
                </div>
            </div>
            <SidebarHeader headerOpen={headerOpen} setHeaderOpen={setHeaderOpen}/>
        </header>
    )
}

export default Header