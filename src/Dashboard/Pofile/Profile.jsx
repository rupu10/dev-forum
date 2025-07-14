import React from 'react';
import useAuth from '../../hooks/useAuth';

const Profile = () => {
    const {user} = useAuth();
    // console.log(user);
    return (
        <div>
            <h1>Name: {user.displayName || 'quddus'}</h1>
            <h1>Email: {user.email}</h1>
        </div>
    );
};

export default Profile;