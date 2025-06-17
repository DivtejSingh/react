import React from 'react'
import { Link } from 'react-router-dom'

const SignUp = () => {
    return (
        <div className='2xl:max-w-[335px] w-full max-w-[270px] mx-auto h-full flex flex-col gap-2'>
            <h2 className="font-bold text-base heading">Register Now</h2>
            <h4 className="2xl:text-base font-semibold text-xs">Welcome back!</h4>
            <form className="flex flex-col pt-[28px]">
                <div className="2xl:p-4 border border-input-placeholder border-[#000E2F70] flex items-center gap-x-2 rounded-xl p-3 relative mt-2">
                    <label className="2xl:text-sm absolute bg-white text-input-label -top-2 left-5 text-[11px] px-1" htmlFor="email">Name</label>
                    <input placeholder="Enter Your Name" className="w-full outline-none text-[12px] text-input-placeholder" type="email" id="email" />
                </div>
                <div className="2xl:p-4 border border-input-placeholder border-[#000E2F70] flex items-center gap-x-2 rounded-xl p-3 relative mt-2">
                    <label className="2xl:text-sm absolute bg-white text-input-label -top-2 left-5 text-[11px] px-1" htmlFor="email">Email</label>
                    <input placeholder="michellejohnson125@gmail.com" className="w-full outline-none text-[12px] text-input-placeholder" type="email" id="email" />
                </div>
                <div className="2xl:p-4 border border-input-placeholder border-[#000E2F70] flex gap-x-2 rounded-xl p-3 relative mt-4">
                    <label className="2xl:text-sm absolute bg-white text-input-label -top-2 left-5 text-[11px] px-1" htmlFor="password">Password</label>
                    <input placeholder="********" className="w-full outline-none text-[12px] text-input-placeholder" type='password' id="password" />
                </div>
                <button type="submit" className="sign-in text-center mt-3 bg-blue-900 text-white text-xs font-semibold px-12 py-3 rounded-lg flex items-center gap-x-2">
                    <span className='w-full'>Sign Up</span>
                </button>
            </form>
            <div className='mt-5'>
                <div className='flex items-center'>
                    <span className='w-[34%] h-[1px] bg-blue-900'></span>
                    <p className='w-[32%] text-xs'>Need to Login Now</p>
                    <span className='w-[34%] h-[1px] bg-blue-900'></span>
                </div>
                <Link to='/'>
                    <div className='border cursor-pointer mt-5 text-center border-blue-900 rounded-md py-1'>
                        <button className='text-xs font-semibold'>Login</button>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default SignUp