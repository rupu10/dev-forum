import React from 'react';
import Banner from '../Home/Banner/Banner';
import Home from '../Home/Home/Home';
import WhyJoinUs from '../Shared/WhyJoinUs';

const HomeLayout = () => {
    return (
        <div>
            <Banner></Banner>
            <Home></Home>
            <WhyJoinUs></WhyJoinUs>
        </div>
    );
};

export default HomeLayout;