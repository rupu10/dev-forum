import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import { Link } from "react-router";

const Home = () => {
  const axiosInstance = useAxios();
  const [page, setPage] = useState(1);
  const [sortByPopularity, setSortByPopularity] = useState(false);
  const [searchText, setSearchText] = useState("");

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

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setPage(1);
  };

  if (isLoading) return <p>Loading posts...</p>;
  if (error) return <p>Error loading posts</p>;

  const { posts, total } = data;
  const totalPages = Math.ceil(total / 5);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Banner + Search */}
      <div className="bg-blue-100 rounded p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">Search Posts by Tag</h1>
        <input
          type="text"
          placeholder="Search by tag..."
          value={searchText}
          onChange={handleSearch}
          className="input input-bordered w-full max-w-sm"
        />
      </div>

      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">All Posts</h1>
        <button
          onClick={() => {
            setSortByPopularity((prev) => !prev);
            setPage(1);
          }}
          className="btn btn-outline bg-[#9ECAD6]"
        >
          Sort by {sortByPopularity ? "Newest" : "Popularity"}
        </button>
      </div>

      <ul>
        {posts.map((post) => (
          <li
            key={post._id}
            className="border p-4 mb-3 rounded shadow hover:shadow-lg transition cursor-pointer"
          >
            <Link
              to={`/posts/${post._id}`}
              className="flex items-center space-x-4"
            >
              <img
                src={post.authorImage || "/default-avatar.png"}
                alt={post.authorName || "Author"}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-sm text-gray-600">
                  {post.tag} | {new Date(post.createdAt).toLocaleDateString()} |
                  Comments: {post.commentCount} | Votes:{" "}
                  {(post.upVote || 0) - (post.downVote || 0)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="flex justify-center space-x-2 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          className="btn btn-sm"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, idx) => {
          const pageNum = idx + 1;
          return (
            <button
              key={pageNum}
              className={`btn btn-sm ${pageNum === page ? "btn-active" : ""}`}
              onClick={() => setPage(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          disabled={page === totalPages}
          onClick={() => setPage((old) => Math.min(old + 1, totalPages))}
          className="btn btn-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
