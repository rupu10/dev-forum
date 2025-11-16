import React from 'react';
import Home from '../pages/Home/Home/Home';
import Navbar from '../pages/Shared/Navbar';
import { Outlet, useLocation } from 'react-router';
import Footer from '../pages/Shared/Footer';
import { conditionalHeader } from '../conditionalLayout/ConditionalHeader';
import ThemeToggle from '../pages/Shared/ThemeToggle';

const RootLayOut = () => {
    const location = useLocation();
  const hideHeader = conditionalHeader(location.pathname)
    return (
        <div >
            {!hideHeader && <Navbar></Navbar>}
            <div className=''>
                <div className='fixed top-60 right-4 p-1.5 bg-base-200 rounded-l-xl z-50'>
                    <ThemeToggle></ThemeToggle>
                </div>
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default RootLayOut;