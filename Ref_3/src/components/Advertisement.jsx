import React from 'react'

const Advertisement = ({ item }) => {
    return (
        <div className="page_width container">
            <div className='text-white'>
                <h1 className='text-center'>{item?.name}</h1>
                <div className='pt-20'>
                    <div className='flex items-center gap-3'>
                        <h3 className='font-bold'>{item?.advertising}</h3>
                        <span className='text-xl'>{item?.size}</span>
                    </div>
                    <p className='font-medium'>{item?.para}</p>
                </div>
            </div>
        </div>
    )
}

export default Advertisement