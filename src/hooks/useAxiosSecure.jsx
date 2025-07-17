import axios from 'axios';
import React from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';

export const axiosSecure = axios.create({
    baseURL: `http://localhost:3900`
})

const useAxiosSecure = () => {
    const {logOut} = useAuth()
    const navigate = useNavigate();
        axiosSecure.interceptors.request.use(config=>{
        return config
    },error=>{
        return Promise.reject(error)
    })


    axiosSecure.interceptors.response.use(res=>{
        return res;
    },error=>{
        const status = error.status;
        if(status === 403){
            // navigate('/forbidden')
        }
        else if(status === 401){
            logOut()
            .then(()=>{
                navigate('/join')
            })
            .catch(err=>console.log(err))          
        }
        return Promise.reject(error);
    })
    return axiosSecure
};

export default useAxiosSecure;