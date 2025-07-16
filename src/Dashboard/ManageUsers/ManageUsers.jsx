import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';


const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // ✅ Get all users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['allUsers'],
    queryFn: async () => {
      const res = await axiosSecure.get('/allUsers');
      return res.data;
    },
  });

  // ✅ Mutation to make admin
  const { mutate } = useMutation({
    mutationFn: async (userId) => {
      const res = await axiosSecure.patch(`/user/role/${userId}`, {
        role: 'admin',
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['allUsers']);
      Swal.fire('Success!', 'User has been promoted to admin.', 'success');
    },
    onError: () => {
      Swal.fire('Error!', 'Failed to update role.', 'error');
    },
  });

  const handleMakeAdmin = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are making this user an admin.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, make admin',
    }).then((result) => {
      if (result.isConfirmed) {
        mutate(id);
      }
    });
  };

  if (isLoading) return <div className="text-center mt-10">Loading users...</div>;

  return (
    <div className="mt-10 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
      <table className="table w-full border">
        <thead className="bg-[#9ECAD6] text-black">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Membership</th>
            <th>Make Admin</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            let badgeColor = '';
            if (user.role === 'bronze_user') badgeColor = 'bg-[#92663E] text-white';
            else if (user.role === 'gold_user') badgeColor = 'bg-yellow-500 text-black';
            else if (user.role === 'admin') badgeColor = 'bg-sky-400 text-black';

            return (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name || 'N/A'}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${badgeColor} capitalize`}>
                    {user.role || 'user'}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleMakeAdmin(user._id)}
                    className="btn btn-sm bg-blue-500 text-white"
                    disabled={user.role === 'admin'}
                  >
                    Make Admin
                  </button>
                </td>
              </tr>
            );
          })}
          {users.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-gray-500 py-4">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
