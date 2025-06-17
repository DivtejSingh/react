import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { getLocalStorage } from '../../utils/LocalStorageUtills';


const MyProfile = () => {
    const { register, handleSubmit, setValue, formState: { errors }, } = useForm();

    useEffect(() => {
        const userData = getLocalStorage('user');
            console.log('User data:', userData); 
            setValue('firstname', userData.name);
            setValue('email', userData.email);
    }, [setValue]);
    

    return (
        <div className="container">
            <div className='bg-white p-6'>
                <h3>Personal Information</h3>
                <div className='flex flex-col gap-4 mt-8'>
                    <div className='flex gap-4 flex-wrap'>
                        <div className="2xl:p-4 border border-input-placeholder border-[#000E2F70] flex items-center gap-x-2 rounded-xl p-3 relative mt-2 w-[49%]">
                            <label className="2xl:text-sm absolute bg-white text-input-label -top-2 left-5 text-[11px] px-1" htmlFor="firstname">First Name</label>
                            <input placeholder="First Name" className="w-full outline-none text-[12px] text-input-placeholder" type="text" id="firstname" name='firstname' {...register('firstname')} />
                        </div>
                        <div className="2xl:p-4 border border-input-placeholder border-[#000E2F70] flex items-center gap-x-2 rounded-xl p-3 relative mt-2 w-[49%]">
                            <label className="2xl:text-sm absolute bg-white text-input-label -top-2 left-5 text-[11px] px-1" htmlFor="lastname">Last Name</label>
                            <input placeholder="Last Name" className="w-full outline-none text-[12px] text-input-placeholder" type="text" id="lastname" name='lastname' />
                        </div>
                        <div className="2xl:p-4 border border-input-placeholder border-[#000E2F70] flex items-center gap-x-2 rounded-xl p-3 relative mt-2 w-[49%]">
                            <label className="2xl:text-sm absolute bg-white text-input-label -top-2 left-5 text-[11px] px-1" htmlFor="email">Email</label>
                            <input placeholder="michellejohnson125@gmail.com" className="w-full outline-none text-[12px] text-input-placeholder" type="email" id="email" {...register('email')} />
                        </div>
                        <div className="2xl:p-4 border border-input-placeholder border-[#000E2F70] flex items-center gap-x-2 rounded-xl p-3 relative mt-2 w-[49%]">
                            <label className="2xl:text-sm absolute bg-white text-input-label -top-2 left-5 text-[11px] px-1" htmlFor="mobile">Mobile</label>
                            <input placeholder="9999999999" className="w-full outline-none text-[12px] text-input-placeholder" type="text" id="mobile" />
                        </div>
                    </div>
                    {/* <div className='text-center border py-2  border-[#000E2F70] rounded-xl'>
                        <input className="w-full outline-none text-[12px] text-input-placeholder" type="submit" />
                    </div> */}
                    {/* <button type="submit" className="main_btn mt-3 bg-blue-900 text-white text-xs font-semibold px-12 py-3 rounded-lg flex items-center gap-x-2">
                        <span className='w-full'>Update Profile
                        </span>
                    </button> */}
                </div>
            </div>
        </div>
    )
}

export default MyProfile