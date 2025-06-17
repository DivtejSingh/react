import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { getLocalStorage } from '../utils/LocalStorageUtills'

const DashboardProtected = () => {
    const admin = getLocalStorage('user')
    return (
        admin ? <Outlet /> : <Navigate to='/auth/login/' />
    )
}

export default DashboardProtected
