import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { FaSearch } from 'react-icons/fa';

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [searchText, setSearchText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // 🔄 Added
  const limit = 10; // 🔄 Items per page

  const { data, isLoading } = useQuery({
    queryKey: ['allUsers', searchQuery, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      params.append('page', currentPage);
      params.append('limit', limit);

      const res = await axiosSecure.get(`/allUsers?${params.toString()}`);
      return res.data; // { users, totalCount }
    },
    keepPreviousData: true,
  });

  const users = data?.users || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);

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

  const handleSearch = () => {
    setCurrentPage(1); // Reset to page 1
    setSearchQuery(searchText.trim());
  };

  if (isLoading) return <div className="flex items-center justify-center">
    <div className="">
    <span className="loading loading-spinner text-primary"></span>
<span className="loading loading-spinner text-secondary"></span>
<span className="loading loading-spinner text-accent"></span>
<span className="loading loading-spinner text-neutral"></span>
<span className="loading loading-spinner text-info"></span>
<span className="loading loading-spinner text-success"></span>
<span className="loading loading-spinner text-warning"></span>
<span className="loading loading-spinner text-error"></span>
  </div>
  </div>;

  return (
    <div className="mt-10 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-6">Manage Users</h2>

      {/* 🔍 Search input */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search by name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="input input-bordered w-full max-w-xs"
        />
        <button onClick={handleSearch} className="btn bg-[#9ECAD6]">
          <FaSearch />
        </button>
      </div>

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
                <td>{(currentPage - 1) * limit + index + 1}</td>
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

      {/* 🔢 Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx + 1}
            onClick={() => setCurrentPage(idx + 1)}
            className={`btn btn-sm ${
              currentPage === idx + 1 ? 'bg-[#748DAE]' : 'btn-outline border-0'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;
