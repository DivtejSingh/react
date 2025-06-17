import React from 'react'
import { Link } from 'react-router-dom'
import { getLocalStorage } from '../utils/LocalStorageUtills'
import Header from '../components/header/Header'

const ProfileLayout = ({ children }) => {
    return (
        <div className=''>
            <Header />
            <div className="container">
                <h1 className='py-5'>My Profile</h1>
                <div className='flex'>
                    <div className='w-[20%]'>
                        <div className='bg-white p-6 flex gap-3'>
                            <img className='w-12 h-12' src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/profile-pic-male_4811a1.svg" alt="" />
                            <div>
                                <span className='text-xs'>Hello,</span>
                                <h2 className='font-semibold'>{getLocalStorage('user').name}</h2>
                            </div>
                        </div>
                        <div className='mt-5 bg-white p-6'>
                            <Link to='/user/myorder'><h3 className='text-light_Grey border-b pb-4'>My Order</h3></Link>
                            <Link to='/'><h3 className='text-light_Grey pt-4'>Log Out</h3></Link>
                        </div>
                    </div>
                    <div className='w-[80%]'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileLayout