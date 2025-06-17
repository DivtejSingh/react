import React from 'react'
import HomeLayout from '../layout/HomeLayout';

const WithHomeLayout = (WrapperComponent) => {
    const WithHome = (props) => {
        return (
            <HomeLayout>
                <WrapperComponent {...props} />
            </HomeLayout>
        );
    }
    return WithHome;
}

export default WithHomeLayout;
