import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { FaSearch, FaUserShield, FaUsers, FaCrown, FaUser, FaArrowLeft, FaArrowRight, FaChartBar, FaFilter } from 'react-icons/fa';

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [searchText, setSearchText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState('all');
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['allUsers', searchQuery, currentPage, roleFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (roleFilter !== 'all') params.append('role', roleFilter);
      params.append('page', currentPage);
      params.append('limit', limit);

      const res = await axiosSecure.get(`/allUsers?${params.toString()}`);
      return res.data;
    },
    keepPreviousData: true,
  });

  const users = data?.users || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);

  // Calculate role statistics
  const roleStats = {
    admin: users.filter(user => user.role === 'admin').length,
    gold_user: users.filter(user => user.role === 'gold_user').length,
    bronze_user: users.filter(user => user.role === 'bronze_user').length,
    total: users.length
  };

  const { mutate } = useMutation({
    mutationFn: async (userId) => {
      const res = await axiosSecure.patch(`/user/role/${userId}`, {
        role: 'admin',
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['allUsers']);
      Swal.fire({
        icon: 'success',
        title: 'Promotion Successful!',
        text: 'User has been promoted to admin.',
        confirmButtonColor: '#10B981',
      });
    },
    onError: () => {
      Swal.fire({
        icon: 'error',
        title: 'Promotion Failed',
        text: 'Failed to update user role.',
        confirmButtonColor: '#EF4444',
      });
    },
  });

  const handleMakeAdmin = (user) => {
    Swal.fire({
      title: 'Promote to Admin?',
      html: `
        <div class="text-left">
          <p class="mb-2">You are about to promote:</p>
          <p class="font-semibold">${user.name || 'User'}</p>
          <p class="text-sm text-gray-600">${user.email}</p>
          <p class="mt-3 text-sm text-amber-600">This user will gain administrative privileges.</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Promote to Admin',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        mutate(user._id);
      }
    });
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchQuery(searchText.trim());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { color: 'bg-red-100 text-red-800 border-red-300', icon: FaUserShield, label: 'Admin' },
      gold_user: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: FaCrown, label: 'Gold' },
      bronze_user: { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: FaUser, label: 'Bronze' },
      user: { color: 'bg-gray-100 text-gray-800 border-gray-300', icon: FaUser, label: 'User' }
    };

    const config = roleConfig[role] || roleConfig.user;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        <IconComponent className="text-xs" />
        {config.label}
      </span>
    );
  };

  if (isLoading) return (
    <div className="min-h-screen bg-base-200 pt-20 flex items-center justify-center">
      <div className="flex space-x-4">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <div className="loading loading-spinner loading-lg text-secondary"></div>
        <div className="loading loading-spinner loading-lg text-accent"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="md:w-10/12 lg:max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-6 py-3 rounded-full border border-primary/20 mb-6">
            <FaUsers className="text-lg" />
            <span className="font-semibold">User Management</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
            Manage <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Community</span>
          </h1>
          
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Oversee user accounts, manage roles, and maintain community standards.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-base-100 rounded-2xl p-6 text-center shadow-sm border border-base-300">
            <div className="text-2xl font-bold text-primary mb-2">{totalCount}</div>
            <div className="text-base-content/70 font-medium">Total Users</div>
          </div>
          <div className="bg-base-100 rounded-2xl p-6 text-center shadow-sm border border-base-300">
            <div className="text-2xl font-bold text-red-600 mb-2">{roleStats.admin}</div>
            <div className="text-base-content/70 font-medium">Administrators</div>
          </div>
          <div className="bg-base-100 rounded-2xl p-6 text-center shadow-sm border border-base-300">
            <div className="text-2xl font-bold text-yellow-600 mb-2">{roleStats.gold_user}</div>
            <div className="text-base-content/70 font-medium">Gold Members</div>
          </div>
          <div className="bg-base-100 rounded-2xl p-6 text-center shadow-sm border border-base-300">
            <div className="text-2xl font-bold text-blue-600 mb-2">{roleStats.bronze_user}</div>
            <div className="text-base-content/70 font-medium">Bronze Members</div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-base-100 rounded-2xl shadow-sm border border-base-300 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="input input-bordered w-full bg-base-200 pl-10 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="select select-bordered bg-base-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admins</option>
                  <option value="gold_user">Gold Members</option>
                  <option value="bronze_user">Bronze Members</option>
                </select>
                
                <button
                  onClick={handleSearch}
                  className="btn btn-primary px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <FaSearch />
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-base-100 rounded-2xl shadow-lg border border-base-300 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-base-300 px-6 py-4">
            <h3 className="font-bold text-lg text-base-content flex items-center gap-2">
              <FaUserShield className="text-primary" />
              User Accounts ({totalCount})
            </h3>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-200">
                <tr>
                  <th className="font-semibold text-base-content">User</th>
                  <th className="font-semibold text-base-content">Email</th>
                  <th className="font-semibold text-base-content">Membership</th>
                  <th className="font-semibold text-base-content">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user._id} className="hover:bg-base-200 transition-colors duration-200">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              {user.photoURL ? (
                                <img
                                  src={user.photoURL}
                                  alt={user.name}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <FaUser className="text-primary" />
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-base-content">
                              {user.name || 'Unnamed User'}
                            </div>
                            <div className="text-sm text-base-content/50">
                              #{(currentPage - 1) * limit + index + 1}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-base-content/90">{user.email}</div>
                      </td>
                      <td>
                        {getRoleBadge(user.role || 'user')}
                      </td>
                      <td>
                        <button
                          onClick={() => handleMakeAdmin(user)}
                          className="btn btn-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={user.role === 'admin'}
                        >
                          <FaUserShield />
                          {user.role === 'admin' ? 'Already Admin' : 'Make Admin'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-12">
                      <div className="text-6xl mb-4">👥</div>
                      <h3 className="text-xl font-semibold text-base-content mb-2">
                        {searchQuery || roleFilter !== 'all' ? 'No users found' : 'No users available'}
                      </h3>
                      <p className="text-base-content/70">
                        {searchQuery || roleFilter !== 'all' 
                          ? 'Try adjusting your search or filter criteria' 
                          : 'There are no users in the system yet'
                        }
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-base-300">
            <div className="text-sm text-base-content/70">
              Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} users
            </div>
            
            <div className="flex items-center gap-2">
              <button
                className="btn btn-outline btn-sm rounded-xl border-base-300 hover:border-primary transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                <FaArrowLeft className="text-sm" />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, idx) => {
                  const pageNum = idx + 1;
                  const isCurrent = pageNum === currentPage;
                  const isNearCurrent = Math.abs(pageNum - currentPage) <= 2;
                  
                  if (isNearCurrent || pageNum === 1 || pageNum === totalPages) {
                    return (
                      <button
                        key={pageNum}
                        className={`btn btn-sm min-w-12 rounded-xl ${
                          isCurrent 
                            ? 'btn-primary' 
                            : 'btn-outline border-base-300 hover:border-primary'
                        }`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (Math.abs(pageNum - currentPage) === 3) {
                    return <span key={pageNum} className="px-2 text-base-content/50">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                className="btn btn-outline btn-sm rounded-xl border-base-300 hover:border-primary transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
                <FaArrowRight className="text-sm" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;