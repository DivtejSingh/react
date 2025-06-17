import React, { useEffect, useState } from 'react';
import Slider from '../../components/Slider';
import productData from '../../constant/Products';
import ProductCart from '../../components/ProductCart';
import { useDispatch, useSelector } from 'react-redux';
import { setCart, setProducts } from '../../store/slice/CartSlice';
import { useOrderMutation, useProductsQuery } from '../../store/service/HomeService';
import { getLocalStorage } from '../../utils/LocalStorageUtills';
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@mui/material';

const Home = () => {
  const dispatch = useDispatch()
  const { data: Products, isError, isLoading } = useProductsQuery(getLocalStorage('user').unique_id)
  const allProducts = useSelector((state => state?.ecom?.products))
  const cart = useSelector((state => state?.ecom?.Cart))
  const [productsDetails, setProductsDetails] = useState([])
  const [orderData] = useOrderMutation()
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()


  useEffect(() => {
    try {
      if (Products?.status) {
        dispatch(setProducts(Products))
      }
    } catch (error) {
      console.log(error)
    }
  }, [Products])

  const getTotalCartPrice = () => {
    return cart.reduce((total, item) => {
      return total + (item.product_price * item.quantity)
    }, 0)
  };


  useEffect(() => {
    if (cart) {
      const details = cart.map((item) => {
        return {
          productId: item.product_id,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
        }
      });
      setProductsDetails(details)
    }
  }, [cart]);

  const orderNow = async () => {
    setLoading(true);
    try {
      const id = getLocalStorage('user').unique_id
      const responce = await orderData({ id, productsDetails })
      console.log(responce)
      if (responce?.data.status) {
        localStorage.removeItem('cart')
        dispatch(setCart([]));
        navigate('/user/thankupage')
        return setLoading(false);
      }
    } catch (error) {
      console.log(error)
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  const renderSkeletons = () => {
    return Array.from({ length: 10 }).map((_, index) => (
      <div key={index} className="border cursor-pointer p-4 rounded-md border-[#e0e0e0] relative">
        <Skeleton height={100} />
        <Skeleton count={2} style={{ marginTop: '10px' }} />
      </div>
    ));
  };


  return (
    <div className="container">
      <Slider />
      <div className='bg-white my-8 p-6'>
        <h1>Products</h1>
        <div className='grid grid-cols-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-5'>
          {isLoading ? renderSkeletons() : allProducts?.data?.map((product, index) => (
            <ProductCart
              key={index}
              item={product}
            />
          ))}
        </div>
        <hr className='my-14 border-[#ccc]' />
        {cart?.length > 0 ?
          <table className='w-full'>
            <tbody>
              <tr>
                <th className='text-right w-[85%] total_price'>Total Price:</th>
                <td className='text-right w-[15%]'>{cart[0]?.currency} {getTotalCartPrice()}</td>
              </tr>
              <tr>
                <th className='w-1/2'></th>
                <td className='w-1/2 text-right'>
                  <button onClick={orderNow} type="submit" className="main_btn mt-14 bg-blue-900 text-white text-xs font-semibold px-12 py-3 order_btn rounded-lg">
                    <div className='flex items-center justify-center'>
                      <span className=''>Order Now</span>
                      <ClipLoader size={15} className='ml-2' color='#000' loading={loading} />
                    </div>
                  </button>
                </td>
              </tr>
            </tbody>
          </table> : null}
      </div>
    </div>
  )
}

export default Home;
