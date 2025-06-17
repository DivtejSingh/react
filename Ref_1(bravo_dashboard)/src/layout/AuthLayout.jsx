import React from 'react'
import auth_img from '../assets/images/authImage.jpg'

const AuthLayout = ({ children }) => {
    return (
        <div className="flex w-full sm:justify-center h-screen">
            <div className="w-[45%] bg-blue-900 flex items-center justify-center sm:hidden">
                <img src={auth_img} alt="login left side image" className="max-w-[65%]  " />
            </div>
            <div className="flex-1 flex items-center justify-center">
                {children}
            </div>
        </div>
    )
}

export default AuthLayout