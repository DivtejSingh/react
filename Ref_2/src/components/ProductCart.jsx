import React, { useEffect, useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, removeItemFromCart } from '../store/slice/CartSlice';

const ProductCart = ({ item }) => {
    const dispatch = useDispatch();
    const cart = useSelector(state => state.ecom.Cart);
    const [isSelected, setIsSelected] = useState(false);

    useEffect(() => {
        const isItemInCart = cart.some(cartItem => cartItem.product_id === item.product_id);
        setIsSelected(isItemInCart);
    }, [cart, item.product_id]);

    const handleAddProduct = () => {
        dispatch(addToCart(item));
    };

    const handleRemoveProduct = () => {
        dispatch(removeFromCart(item));
    };

        const handleRemoveCart = () => {
            dispatch(removeItemFromCart(item));
        };

    const getItemDetails = () => {
        return cart.find(cartItem => cartItem.product_id === item.product_id) || { quantity: 0, totalPrice: 0 };
    };

    const { quantity, totalPrice } = getItemDetails();

    return (
        <div className='border cursor-pointer p-4 rounded-md border-[#e0e0e0] relative'>
            {isSelected && (
                <div className='absolute bg-black-200 top-3 right-3 p-1 rounded-full'>
                    <CheckIcon sx={{ color: '#fff' }} />
                </div>
            )}
            <img className='w-full h-[100px] object-contain' src={item.product_image} alt={item.caption} />
            <div className='pt-8'>
                <h2 className='text-center'>{item.product_name}</h2>
                <p className='font-semibold text-center'>{item.currency} {item.product_price}</p>
                <div className='flex justify-center gap-10 mt-3' onClick={(e) => e.stopPropagation()}>
                    <RemoveCircleIcon sx={{ color: isSelected ? '#212121' : '#646ea6' }} onClick={() => handleRemoveProduct()} />
                    <div>{quantity}</div>
                    <AddCircleIcon sx={{ color: isSelected ? '#212121' : '#646ea6' }} onClick={() => handleAddProduct()} />
                </div>
                {isSelected ? (
                    <div className='text-center mt-3'>
                        <button
                            type="button"
                            className="main_btn mt-3 bg-black-200 text-[#fff] text-xs font-semibold px-12 py-3 rounded-lg remove_cart"
                            onClick={() => handleRemoveCart()}
                        >
                            Remove From Cart
                        </button>
                    </div>
                ) : (
                    <div className='text-center mt-3'>
                        <button
                            type="button"
                            className="main_btn mt-3 bg-blue-900 text-white text-xs font-semibold px-12 py-3 rounded-lg"
                            onClick={() => handleAddProduct()}
                        >
                            Add To Cart
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCart;
