import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import Login from '../pages/auth/Login'
import Home from '../pages/dashboard/Home'
import SignUp from '../pages/auth/SignUp'
import WithAuthLayout from '../layout/AuthLayout'
import HomeLayout from '../layout/HomeLayout'
import MyOrder from '../pages/dashboard/MyOrder'
import MyProfile from '../pages/dashboard/MyProfile'
import ProfileLayout from '../layout/ProfileLayout'
import Products from '../pages/dashboard/Products'
import { getLocalStorage } from '../utils/LocalStorageUtills'
import AuthProteced from '../authentication/AuthProteced'
import DashboardProtected from '../authentication/DashboardProtected'
import ThankYouPage from '../pages/dashboard/ThankYouPage'
import ViewOrders from '../pages/dashboard/ViewOrders'

const Root = () => {
    const navigate = useNavigate();
    const isAuthenticated = getLocalStorage('user')
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/user/dashboard')
        } else {
            navigate('/auth/login')
        }
    }, [isAuthenticated, navigate])
    // return null
}

const Routing = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Root />} />
                <Route path='/auth' element={<AuthProteced />}>
                    <Route path='login' element={<WithAuthLayout><Login /></WithAuthLayout>} />
                    <Route path='signup' element={<WithAuthLayout><SignUp /></WithAuthLayout>} />
                </Route>
                <Route path='/user' element={<DashboardProtected />}>
                    <Route path='dashboard' element={<HomeLayout><Home /></HomeLayout>} />
                    <Route path='myprofile' element={<ProfileLayout><MyProfile /></ProfileLayout>} />
                    <Route path='myorder' element={<HomeLayout><MyOrder /></HomeLayout>} />
                    <Route path='products' element={<HomeLayout><Products /></HomeLayout>} />
                    <Route path='myorder/:id' element={<HomeLayout><ViewOrders /></HomeLayout>} />
                    <Route path='thankupage' element={<HomeLayout><ThankYouPage /></HomeLayout>} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Routing
