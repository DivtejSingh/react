import React from "react";
import Images from "../constant/Images";

const AuthLayout = ({ children }) => {
    return (
        <section className='w-full h-screen bg-primary-300 p-8'>
            <div className='w-full h-full bg-white rounded-3xl p-8 flex gap-x-6'>
                <div className="flex-1 items-center justify-center border border-blue-900 rounded-3xl sm:hidden">
                    <img className='2xl:w-50' src={Images.Auth_Img} alt="logo-img" />
                </div>
                <div className="flex-1 self-center">
                    {children}
                </div>
            </div>
        </section>
    )
};

export default AuthLayout;