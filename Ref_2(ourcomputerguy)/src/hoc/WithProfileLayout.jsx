import React from 'react'
import ProfileLayout from '../layout/ProfileLayout';

const WithProfileLayout = (WrapperComponent) => {
    const WithProfile = (props) => {
        return (
            <ProfileLayout>
                <WrapperComponent {...props} />
            </ProfileLayout>
        );
    }
    return WithProfile;
}

export default WithProfileLayout;
