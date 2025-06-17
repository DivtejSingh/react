import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { getLocalStorage } from '../utils/LocalStorageUtills'

const AuthProteced = () => {
    const user = getLocalStorage('user')
    return (
        user ? <Navigate to='/user/dashboard/' /> : <Outlet />
    )
}

export default AuthProteced
