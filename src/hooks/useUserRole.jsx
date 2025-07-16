import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: role = null, // default role is null until fetched
    isLoading: roleLoading,
    refetch,
  } = useQuery({
    queryKey: ['userRole', user?.email],
    enabled: !authLoading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}/role`);
      return res.data.role; // expect backend to return { role: 'bronze_user' | 'gold_user' | 'admin' }
    },
  });

  return {
    role,
    roleLoading: authLoading || roleLoading,
    refetch,
    isBronze: role === 'bronze_user',
    isGold: role === 'gold_user',
    isAdmin: role === 'admin',
  };
};

export default useUserRole;
