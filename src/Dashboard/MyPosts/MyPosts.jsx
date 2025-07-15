import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MyPosts = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // 🔁 Get user's posts
  const { data: myPosts = [], isLoading } = useQuery({
    queryKey: ["myPosts", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/posts?email=${user.email}`);
      return res.data;
    },
  });

  // 🗑️ Delete post mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/posts/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myPosts", user.email]);
      Swal.fire("Deleted!", "Your post has been deleted.", "success");
    },
    onError: () => {
      Swal.fire("Error!", "Failed to delete the post.", "error");
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this post!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  if (isLoading) return <p className="text-center mt-10">Loading posts...</p>;


  return (
    <div className="overflow-x-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">My Posts</h2>
      <table className="table w-full border">
        <thead className="bg-[#9ECAD6] text-black">
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Votes</th>
            <th>Comment</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {myPosts.map((post, index) => (
            <tr key={post._id}>
              <td>{index + 1}</td>
              <td>{post.title}</td>
              <td>{post.upVote - post.downVote}</td>
              <td>
                <Link to={`/comments/${post._id}`}>
                  <button className="btn btn-sm bg-[#D6EAF8] text-black">Comments</button>
                </Link>
              </td>
              <td>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="btn btn-sm bg-red-400 text-white"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {myPosts.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                You haven’t posted anything yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyPosts;
