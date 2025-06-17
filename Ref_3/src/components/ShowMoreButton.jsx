// ShowMoreButton.js
import React from 'react';

const ShowMoreButton = ({ label, totalItems, displayedItems, onClick }) => {
    return (
        <>
            {totalItems > displayedItems && (
                <div className='text-center py-10 flex items-center'>
                    <span className='text-white w-[40%]  bg-white h-[1px] justify-center'></span>
                    <button onClick={onClick} className="text-white bg-blue-500 py-2 rounded-full border w-[20%] sm:w-[36%]">
                        {label}
                    </button>
                    <span className='text-white w-[40%] bg-white h-[1px]'></span>
                </div>
            )}
        </>
    );
}

export default ShowMoreButton;
