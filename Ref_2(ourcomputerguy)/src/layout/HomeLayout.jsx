import React from 'react'
import Header from '../components/header/Header'

const HomeLayout = ({ children, childrens }) => {
    return (
        <div className=''>
            <Header />
            <div>
                {children}
            </div>
        </div>
    )
}

export default HomeLayout