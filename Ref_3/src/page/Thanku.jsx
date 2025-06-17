import React from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Link } from 'react-router-dom';

const ThankYouPage = () => {
    return (
        <div className="min-h-screen bg-black-900 flex flex-col items-center justify-center bg-gradient-to-b from-purple-400 via-pink-500 to-red-500">
            <div className="max-w-lg p-8 bg-white shadow-lg rounded-lg text-center">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">Thank You!</h2>
                <p className="text-gray-600 mb-6">Your query has been submitted successfully. We'll get back to you as soon as possible.</p>
                <div className='text-center'>
                    <ThumbUpIcon sx={{ fontSize: 64, color: '#000' }} />
                </div>
               <Link to='/'><button className="bg-blue-500 text-black-900 py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Return to Home</button></Link>
            </div>
        </div>
    );
};

export default ThankYouPage;
