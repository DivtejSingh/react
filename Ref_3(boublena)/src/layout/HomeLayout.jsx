import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
// import { useNavigationDataQuery } from '../store/service/HomeService';
// import { useDispatch } from 'react-redux';
// import { setCategoryData } from '../store/slice/categorySlice';

const HomeLayout = ({ children }) => {
  // const { data: navigation } = useNavigationDataQuery();
  // const dispatch = useDispatch()

  // useEffect(() => {
  //   dispatch(setCategoryData(navigation))
  // }, [navigation]);


  return (
    <>
      {/* <div className='flex'> */}
      <Sidebar />
      <main className="w-[100%]">
        {children}
      </main>
      {/* </div> */}
      {/* </div> */}
    </>
  )
}

export default HomeLayout