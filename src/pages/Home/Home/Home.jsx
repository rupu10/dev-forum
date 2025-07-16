import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import useAxios from "../../../hooks/useAxios";
import { Link } from "react-router";

const Home = () => {
  const axiosInstance = useAxios()
  const [page, setPage] = useState(1);
  const [sortByPopularity, setSortByPopularity] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["posts", page, sortByPopularity],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/allPosts?page=${page}&sort=${sortByPopularity ? "popularity" : "latest"}`
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  if (isLoading) return <p>Loading posts...</p>;
  if (error) return <p>Error loading posts</p>;

  const { posts, total } = data;
  console.log(posts);
  const totalPages = Math.ceil(total / 5);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">All Posts</h1>
        <button
          onClick={() => {
            setSortByPopularity((prev) => !prev);
            setPage(1);
          }}
          className="btn btn-outline"
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
            <Link to={`/posts/${post._id}`} className="flex items-center space-x-4">
              <img
                src={post.authorImage || "/default-avatar.png"}
                alt={post.authorName || "Author"}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-sm text-gray-600">
                  {post.tag} | {new Date(post.createdAt).toLocaleDateString()}{" "}
                  | Comments: {post.commentCount} | Votes: {(post.upVote || 0) - (post.downVote || 0)}
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
