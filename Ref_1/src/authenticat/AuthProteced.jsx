import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { getLocalStorage } from '../utils/LocalStorageUtills'

const AuthProteced = () => {
    const admin = getLocalStorage('token')
    return (
        admin ? <Navigate to='/admin/user/' /> : <Outlet />
    )
}

export default AuthProteced