// src/ThankYouPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const ThankYouPage = () => {
  return (
    <div className="flex items-center justify-center from-blue-100 to-blue-300" style={{ height: 'calc(100vh - 140px)' }}>
      <div className="bg-white p-10 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Thank You for the order!</h1>
        <p className="text-lg text-gray-600 mb-4">You can check the order details from orders page.</p>
        <img src="https://media1.giphy.com/media/ZZZo9EVpp4KeIiMlT2/giphy.gif?cid=6c09b952nqlu60xjagfoa0t92j5hsgm68lpl6ongl2rfkxa2&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=g" alt="" />
        <div className='pt-8'>
          <Link to='/user/dashboard'>
            <button className="px-6 py-2 bg-blue-500 font-semibold text-black-200 rounded-md hover:bg-blue-600 transition duration-300">
              Back to Home
            </button>
          </Link>
          <Link to='/user/myorder'>
            <button className="px-6 py-2 bg-blue-500 font-semibold text-black-200 rounded-md hover:bg-blue-600 transition duration-300">
              Go to Order Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ThankYouPage;
