import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { FaSearch, FaFire, FaClock, FaChevronDown, FaComment, FaArrowUp, FaArrowDown, FaTimes } from "react-icons/fa";
import useAxios from "../../hooks/useAxios";

const AllPosts = () => {
  const axiosInstance = useAxios();
  const [page, setPage] = useState(1);
  const [sortByPopularity, setSortByPopularity] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["posts", page, sortByPopularity, searchText],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/allPosts?page=${page}&sort=${
          sortByPopularity ? "popularity" : "latest"
        }&search=${searchText}`
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchText(inputValue);
    setPage(1);
  };

  const handleClearSearch = () => {
    setInputValue("");
    setSearchText("");
    setPage(1);
  };

  const calculateTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const getVoteCount = (post) => {
    return (post.upVote || 0) - (post.downVote || 0);
  };

  if (isLoading) return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="flex space-x-4">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <div className="loading loading-spinner loading-lg text-secondary"></div>
        <div className="loading loading-spinner loading-lg text-accent"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="alert alert-error max-w-md">
        <span>Error loading posts. Please try again.</span>
      </div>
    </div>
  );

  const { posts, total } = data;
  const totalPages = Math.ceil(total / 5);

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="md:w-10/12 lg:max-w-7xl mx-auto py-4">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-base-content mb-2">Developer Forum</h1>
              <p className="text-base-content/70">Connect, collaborate, and grow with fellow developers</p>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="w-full lg:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by tags, topics, or keywords..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="input input-bordered input-lg w-full lg:w-96 bg-base-100 border-base-300 pl-12 pr-12"
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                {inputValue && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Search Results Header */}
          {searchText && (
            <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <FaSearch className="text-primary" />
                  <div>
                    <h3 className="font-semibold text-base-content">
                      Showing results for: <span className="text-primary">"{searchText}"</span>
                    </h3>
                    <p className="text-sm text-base-content/70">
                      Found {total} post{total !== 1 ? 's' : ''} matching your search
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClearSearch}
                  className="btn btn-outline btn-sm border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}

          {/* Sort and Stats Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-base-100 rounded-xl shadow-sm border border-base-300">
            <div className="flex items-center gap-4">
              <span className="text-base-content/70 font-medium">Sort by:</span>
              
              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  className="btn btn-outline bg-base-100 border-base-300 hover:bg-base-200 hover:border-base-400 flex items-center gap-2"
                >
                  {sortByPopularity ? (
                    <>
                      <FaFire className="text-orange-500" />
                      Popularity
                    </>
                  ) : (
                    <>
                      <FaClock className="text-blue-500" />
                      Newest
                    </>
                  )}
                  <FaChevronDown className={`transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {sortDropdownOpen && (
                  <div className="absolute top-12 left-0 z-10 w-48 bg-base-100 border border-base-300 rounded-lg shadow-lg">
                    <button
                      onClick={() => {
                        setSortByPopularity(false);
                        setSortDropdownOpen(false);
                        setPage(1);
                      }}
                      className={`flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-base-200 transition-colors ${
                        !sortByPopularity ? 'bg-blue-50 text-blue-700' : ''
                      }`}
                    >
                      <FaClock className="text-blue-500" />
                      Newest First
                    </button>
                    <button
                      onClick={() => {
                        setSortByPopularity(true);
                        setSortDropdownOpen(false);
                        setPage(1);
                      }}
                      className={`flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-base-200 transition-colors ${
                        sortByPopularity ? 'bg-orange-50 text-orange-700' : ''
                      }`}
                    >
                      <FaFire className="text-orange-500" />
                      Most Popular
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="text-base-content/70">
              {searchText ? `Showing ${posts.length} of ${total} results` : `Showing ${posts.length} of ${total} posts`}
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-base-100 rounded-xl shadow-sm border border-base-300 hover:shadow-md hover:border-base-400 transition-all duration-300 group"
            >
              <Link to={`/posts/${post._id}`} className="block p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Vote Section */}
                  <div className="flex lg:flex-col items-center gap-2 lg:gap-1">
                    <div className="flex items-center gap-1 text-green-500">
                      <FaArrowUp />
                      <span className="text-sm font-semibold">{post.upVote || 0}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        {getVoteCount(post)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-red-500">
                      <FaArrowDown />
                      <span className="text-sm font-semibold">{post.downVote || 0}</span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1">
                    {/* Author Info - Top Left */}
                    <div className="flex items-center gap-3 mb-4">
                      {/* Author Image and Name */}
                      <div className="flex items-center gap-2">
                        <div className="avatar">
                          <div className="w-10 h-10 rounded-full border-2 border-base-300">
                            <img
                              src={post.authorImage || "/default-avatar.png"}
                              alt={post.authorName || "Author"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-base-content block">
                            {post.authorName || "Anonymous"}
                          </span>
                        </div>
                      </div>

                      {/* Tag and Time */}
                      <div className="flex items-center gap-3 ml-4">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20">
                          {post.tag}
                        </span>
                        <span className="text-sm text-base-content/70">
                          {calculateTimeAgo(post.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Post Content */}
                    <h2 className="text-xl font-bold text-base-content mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-base-content/80 mb-4 line-clamp-2">
                      {post.description}
                    </p>

                    {/* Post Stats */}
                    <div className="flex items-center gap-6 pt-4 border-t border-base-300">
                      <div className="flex items-center gap-2 text-sm text-base-content/70">
                        <FaComment className="text-base-content/50" />
                        <span>{post.commentCount || 0} comments</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-base-content/70">
                        <FaFire className="text-orange-500" />
                        <span>{getVoteCount(post)} votes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              disabled={page === 1}
              onClick={() => setPage((old) => Math.max(old - 1, 1))}
              className="btn btn-outline btn-sm border-base-300 hover:border-base-400 disabled:opacity-50"
            >
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
                      className={`btn btn-sm min-w-12 ${
                        isCurrent 
                          ? 'btn-primary' 
                          : 'btn-outline border-base-300 hover:border-base-400'
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
              disabled={page === totalPages}
              onClick={() => setPage((old) => Math.min(old + 1, totalPages))}
              className="btn btn-outline btn-sm border-base-300 hover:border-base-400 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-base-content mb-2">
              {searchText ? 'No posts found' : 'No posts available'}
            </h3>
            <p className="text-base-content/70 mb-4">
              {searchText 
                ? `No posts found for "${searchText}". Try adjusting your search terms.`
                : 'Be the first to start a discussion!'
              }
            </p>
            {searchText && (
              <button
                onClick={handleClearSearch}
                className="btn btn-primary"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPosts;