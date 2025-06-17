import React from 'react'
import AuthLayout from '../layout/AuthLayout'

const WithAuthLayout = (WrapperComponent) => {
    const WithAuth = (props) => {
        return (
            <AuthLayout>
                <WrapperComponent {...props} />
            </AuthLayout>
        );
    }
    return WithAuth;
}

export default WithAuthLayout;
