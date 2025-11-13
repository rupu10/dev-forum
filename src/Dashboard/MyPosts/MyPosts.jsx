import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaTrash, FaComments, FaEye, FaEdit, FaFileAlt, FaChartBar, FaArrowLeft, FaArrowRight, FaPlus, FaSearch } from "react-icons/fa";

const MyPosts = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;

  // 🔁 Get paginated user's posts
  const { data, isLoading } = useQuery({
    queryKey: ["myPosts", user?.email, page],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/posts?email=${user.email}&page=${page}&limit=${limit}`
      );
      return res.data;
    },
  });

  const myPosts = data?.posts || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);

  // Filter posts based on search term
  const filteredPosts = myPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🗑️ Delete post mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/posts/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myPosts", user.email, page]);
      Swal.fire("Deleted!", "Your post has been deleted.", "success");
    },
    onError: () => {
      Swal.fire("Error!", "Failed to delete the post.", "error");
    },
  });

  const handleDelete = (id, title) => {
    Swal.fire({
      title: "Delete Post?",
      text: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
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
            <FaFileAlt className="text-lg" />
            <span className="font-semibold">My Posts</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
            Manage Your <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Content</span>
          </h1>
          
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            View, manage, and track the performance of your published posts in the community.
          </p>
        </div>

        {/* Stats Card */}
        <div className="bg-base-100 rounded-2xl shadow-sm border border-base-300 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">{totalCount}</div>
              <div className="text-base-content/70 font-medium">Total Posts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">
                {myPosts.reduce((sum, post) => sum + (post.upVote - post.downVote), 0)}
              </div>
              <div className="text-base-content/70 font-medium">Total Votes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">
                {myPosts.reduce((sum, post) => sum + (post.commentCount || 0), 0)}
              </div>
              <div className="text-base-content/70 font-medium">Total Comments</div>
            </div>
          </div>
        </div>

        {/* Search and Actions Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="relative w-full lg:w-96">
            <input
              type="text"
              placeholder="Search your posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full bg-base-100 pl-10 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
          </div>
          
          <Link to="/dashboard/addPost">
            <button className="btn btn-primary rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
              <FaPlus />
              Create New Post
            </button>
          </Link>
        </div>

        {/* Posts Table */}
        <div className="bg-base-100 rounded-2xl shadow-lg border border-base-300 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-base-300 px-6 py-4">
            <h3 className="font-bold text-lg text-base-content flex items-center gap-2">
              <FaChartBar className="text-primary" />
              Your Published Posts
            </h3>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-200">
                <tr>
                  <th className="font-semibold text-base-content">Post</th>
                  <th className="font-semibold text-base-content">Votes</th>
                  <th className="font-semibold text-base-content">Comments</th>
                  <th className="font-semibold text-base-content">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <tr key={post._id} className="hover:bg-base-200 transition-colors duration-200">
                      <td>
                        <div className="max-w-md">
                          <h4 className="font-semibold text-base-content line-clamp-1">
                            {post.title}
                          </h4>
                          <p className="text-sm text-base-content/70 line-clamp-2 mt-1">
                            {post.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20">
                              {post.tag}
                            </span>
                            <span className="text-xs text-base-content/50">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className={`flex items-center gap-1 ${(post.upVote - post.downVote) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            <span className="font-bold text-lg">{post.upVote - post.downVote}</span>
                          </div>
                          <div className="text-xs text-base-content/50">
                            ({post.upVote}↑ / {post.downVote}↓)
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="font-medium text-base-content">
                          {post.commentCount || 0}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Link to={`/posts/${post._id}`}>
                            <button className="btn btn-sm btn-outline border-base-300 hover:border-primary hover:bg-primary/5 transition-all duration-300 flex items-center gap-1">
                              <FaEye className="text-sm" />
                              View
                            </button>
                          </Link>
                          <Link to={`/comments/${post._id}`}>
                            <button className="btn btn-sm btn-primary text-white shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-1">
                              <FaComments className="text-sm" />
                              Comments
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(post._id, post.title)}
                            className="btn btn-sm btn-error text-white shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-1"
                            disabled={deleteMutation.isLoading}
                          >
                            <FaTrash className="text-sm" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-12">
                      <div className="text-6xl mb-4">📝</div>
                      <h3 className="text-xl font-semibold text-base-content mb-2">
                        {searchTerm ? 'No matching posts found' : 'No posts yet'}
                      </h3>
                      <p className="text-base-content/70 mb-4">
                        {searchTerm 
                          ? 'Try adjusting your search terms' 
                          : 'Start sharing your knowledge with the community!'
                        }
                      </p>
                      {!searchTerm && (
                        <Link to="/dashboard/addPost">
                          <button className="btn btn-primary rounded-xl px-6 py-3 font-semibold">
                            <FaPlus className="mr-2" />
                            Create Your First Post
                          </button>
                        </Link>
                      )}
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
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalCount)} of {totalCount} posts
            </div>
            
            <div className="flex items-center gap-2">
              <button
                className="btn btn-outline btn-sm rounded-xl border-base-300 hover:border-primary transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                <FaArrowLeft className="text-sm" />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, idx) => {
                  const pageNum = idx + 1;
                  const isCurrent = pageNum === page;
                  const isNearCurrent = Math.abs(pageNum - page) <= 2;
                  
                  if (isNearCurrent || pageNum === 1 || pageNum === totalPages) {
                    return (
                      <button
                        key={pageNum}
                        className={`btn btn-sm min-w-12 rounded-xl ${
                          isCurrent 
                            ? 'btn-primary' 
                            : 'btn-outline border-base-300 hover:border-primary'
                        }`}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (Math.abs(pageNum - page) === 3) {
                    return <span key={pageNum} className="px-2 text-base-content/50">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                className="btn btn-outline btn-sm rounded-xl border-base-300 hover:border-primary transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
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

export default MyPosts;