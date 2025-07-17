import React from 'react';
import image from '../assets/1aa207a3-c9f5-4694-ac58-481cb64e177a.jpg'
import { Link } from 'react-router';
const Error = () => {
    return (
        <div className=' w-10/12 mx-auto mt-20'>
            <div className='flex justify-center items-center mb-8'>
            <img src={image} alt="" />
            </div>
            <h1 className='text-3xl font-bold underline text-center mb-8 text-red-600'>Error! 404 not found</h1>
            <div className='flex justify-center items-center mb-15'>
                <Link to='/'>
                <button className='bg-violet-500 px-7 py-4 rounded-3xl text-white font-semibold text-2xl hover:bg-white hover:text-violet-500 border border-violet-500 cursor-pointer'>Back To Homepage</button>
                </Link>
            </div>

        </div>
    );
};

export default Error;