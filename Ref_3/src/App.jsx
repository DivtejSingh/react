import { useEffect, useState } from 'react';
import './App.css';
import Routing from './routing/Routing';
import DynamicHead from './DynamicHead';
import { Toaster } from 'react-hot-toast';
import { useNavigationDataQuery } from './store/service/HomeService';
import { useDispatch } from 'react-redux';
import { setCategoryData } from './store/slice/categorySlice';
import DynamicOGImage from './DynamicOGImage';

function App() {
 
  const { data: navigation } = useNavigationDataQuery();
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setCategoryData(navigation))
  }, [navigation]);


  return (
    <>
      <Routing  />
      <Toaster />
      <DynamicHead />
    </>
  );
}

export default App;