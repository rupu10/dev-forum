import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';
import { useEffect } from 'react';
// import { useEffect } from 'react';
// import { Navigate } from 'react-router';
// import useAxios from './useAxios';

const useUserRole = () => {
  const { user, loading: authLoading} = useAuth();
  const axiosSecure = useAxiosSecure();

  // console.log(user);

  const {
    data: role = null,
    isLoading: roleLoading,
    refetch,
  } = useQuery({
    queryKey: ['userRole', user?.email],
    // enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}/role`);
      return res.data?.role;
    },
  });

  useEffect(()=>{
    if(user){
      axiosSecure.get(`/users/${user.email}/role`)
    }
  },[user,axiosSecure])

  return {
    role,
    roleLoading: authLoading || roleLoading,
    refetch,
    isBronze: role === 'bronze_user',
    isGold: role === 'gold_user',
    isAdmin: role === 'admin',
  };




//  const { data: userRole = "user", isLoading } = useQuery({
//     queryKey: ["user-role", user?.email],
//     enabled: !!user?.email,
//     queryFn: async () => {
//       const res = await axiosSecure.get(`/users/${user.email}/role`);
//       return res.data?.role || "user";
//     },
//   });

//   return {
//     userRole,
//     isLoading
//   }
};







// };


export default useUserRole;
