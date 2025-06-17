import { createSlice } from "@reduxjs/toolkit";
import { getLocalStorage, setLocalStorage } from "../../utils/LocalStorageUtills";

const initialState = {
    Cart: getLocalStorage('cart') || [],
    products: [],
    myOrder: []
};

const CartSlice = createSlice({
    name: "ecom",
    initialState,
    reducers: {
        setMyOrder: (state, action) => {
            state.myOrder = action.payload;
        },
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        setCart: (state, action) => {
            state.Cart = action.payload;
        },
        addToCart: (state, action) => {
            const existingProduct = state.Cart.find(item => item.product_id === action.payload.product_id);
            if (existingProduct) {
                existingProduct.quantity += 1;
                existingProduct.totalPrice = existingProduct.product_price * existingProduct.quantity;
            } else {
                state.Cart.push({ ...action.payload, quantity: 1, totalPrice: action.payload.product_price });
            }
            setLocalStorage('cart', state.Cart)
        },
        removeFromCart: (state, action) => {
            const existingProduct = state.Cart.find(item => item.product_id === action.payload.product_id);
            if (existingProduct && existingProduct.quantity > 1) {
                existingProduct.quantity -= 1;
                existingProduct.totalPrice = existingProduct.product_price * existingProduct.quantity;
            } else {
                state.Cart = state.Cart.filter(item => item.product_id !== action.payload.product_id);
            }
            setLocalStorage('cart', state.Cart)
        },
        removeItemFromCart: (state, action) => {
            state.Cart = state.Cart.filter(item => item.product_id !== action.payload.product_id);
            setLocalStorage('cart', state.Cart)
        }
    }
});

export const { setCart, setProducts, addToCart, removeFromCart, removeItemFromCart , setMyOrder } = CartSlice.actions;

export default CartSlice;
