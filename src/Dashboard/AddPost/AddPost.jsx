import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useUserRole from "../../hooks/useUserRole";
import { FaPlus, FaTag, FaFileAlt, FaEdit, FaCrown, FaUser, FaChartBar } from "react-icons/fa";

const AddPost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const { role, roleLoading } = useUserRole();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { data: postInfo = {}, isLoading } = useQuery({
    queryKey: ["postCount", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/posts/count?email=${user.email}`);
      return res.data;
    },
  });

  const { data: allTags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const res = await axiosSecure.get("/tags");
      return res.data;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (newPost) => {
      const res = await axiosSecure.post("/posts", newPost);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["postCount", user.email]);
      Swal.fire({
        icon: "success",
        title: "Post Created!",
        text: "Your post has been successfully added.",
        confirmButtonColor: "#3085d6",
      });
      reset();
      navigate("/dashboard/myPost");
    },
    onError: (err) => {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while posting.",
        confirmButtonColor: "#d33",
      });
    },
  });

  const onSubmit = (data) => {
    const newPost = {
      title: data.title,
      description: data.description,
      tag: data.tag,
      upVote: 0,
      downVote: 0,
      authorEmail: user.email,
      authorImage: user.photoURL,
      authorName: user.displayName,
      createdAt: new Date().toISOString(),
    };

    mutate(newPost);
  };

  if (isLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-base-200 pt-20 flex items-center justify-center">
        <div className="flex space-x-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <div className="loading loading-spinner loading-lg text-secondary"></div>
          <div className="loading loading-spinner loading-lg text-accent"></div>
        </div>
      </div>
    );
  }

  if (role === "bronze_user" && postInfo.count >= 5) {
    return (
      <div className="min-h-screen bg-base-200 pt-20">
        <div className="md:w-10/12 lg:max-w-4xl mx-auto px-4 py-8">
          <div className="bg-base-100 rounded-2xl shadow-lg border border-base-300 p-8 text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl md:text-3xl font-bold text-base-content mb-4">
              Post Limit Reached
            </h2>
            <p className="text-base-content/70 text-lg mb-2">
              You've reached the maximum limit of <span className="font-bold text-primary">5 posts</span> for Bronze members.
            </p>
            <p className="text-base-content/60 mb-6">
              Upgrade to Gold for unlimited posting and premium features.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                className="btn btn-primary btn-lg rounded-xl px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                onClick={() => navigate("/membership")}
              >
                <FaCrown className="text-yellow-400" />
                Upgrade to Gold
              </button>
              <button
                className="btn btn-outline btn-lg rounded-xl px-8 py-4 font-semibold border-base-300 hover:border-primary transition-all duration-300"
                onClick={() => navigate("/dashboard/myPost")}
              >
                View My Posts
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="md:w-10/12 lg:max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-6 py-3 rounded-full border border-primary/20 mb-6">
            <FaPlus className="text-lg" />
            <span className="font-semibold">Create New Post</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
            Share Your <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Knowledge</span>
          </h1>
          
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Create engaging content and contribute to our developer community. Share your insights, ask questions, and help others grow.
          </p>
        </div>

        {/* User Stats */}
        <div className="bg-base-100 rounded-2xl shadow-sm border border-base-300 p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div className="w-14 h-14 rounded-full border-2 border-base-300">
                  <img
                    src={user?.photoURL || "/default-avatar.png"}
                    alt={user?.displayName || "User"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-base-content flex items-center gap-2">
                  <FaUser className="text-base-content/50" />
                  {user?.displayName || "User"}
                </h3>
                <div className="flex items-center gap-4 text-sm text-base-content/70 mt-1">
                  <span className="flex items-center gap-1">
                    <FaChartBar className="text-base-content/50" />
                    {postInfo.count || 0} posts created
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                    role === "admin" 
                      ? "bg-red-100 text-red-800 border-red-300" 
                      : role === "gold_user" 
                      ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                      : "bg-blue-100 text-blue-800 border-blue-300"
                  }`}>
                    {role === "admin" ? "Admin" : role === "gold_user" ? "Gold" : "Bronze"}
                  </span>
                </div>
              </div>
            </div>
            
            {role === "bronze_user" && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2">
                <p className="text-sm text-blue-700 font-medium">
                  {5 - (postInfo.count || 0)} posts remaining
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Post Form */}
        <div className="bg-base-100 rounded-2xl shadow-lg border border-base-300 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title Field */}
            <div className="space-y-3">
              <label className="font-semibold text-lg text-base-content flex items-center gap-2">
                <FaEdit className="text-primary" />
                Post Title
              </label>
              <input
                type="text"
                {...register("title", { required: true })}
                className="input input-bordered w-full bg-base-200 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-lg py-4"
                placeholder="Enter a compelling title for your post..."
              />
              {errors.title && (
                <p className="text-red-500 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Title is required
                </p>
              )}
            </div>

            {/* Description Field */}
            <div className="space-y-3">
              <label className="font-semibold text-lg text-base-content flex items-center gap-2">
                <FaFileAlt className="text-primary" />
                Post Description
              </label>
              <textarea
                {...register("description", { required: true })}
                className="textarea textarea-bordered w-full bg-base-200 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none min-h-32 text-lg py-4"
                placeholder="Share your thoughts, code snippets, or questions in detail..."
                rows="6"
              ></textarea>
              {errors.description && (
                <p className="text-red-500 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Description is required
                </p>
              )}
            </div>

            {/* Tag Field */}
            <div className="space-y-3">
              <label className="font-semibold text-lg text-base-content flex items-center gap-2">
                <FaTag className="text-primary" />
                Category Tag
              </label>
              <select
                {...register("tag", { required: true })}
                className="select select-bordered w-full bg-base-200 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-lg py-4"
              >
                <option value="">Select a category for your post</option>
                {allTags.map((tag, index) => (
                  <option key={index} value={tag.tag}>
                    {tag.tag}
                  </option>
                ))}
              </select>
              {errors.tag && (
                <p className="text-red-500 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Please select a category tag
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-base-300">
              <button
                className="btn btn-primary btn-lg rounded-xl px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 disabled:opacity-50"
                type="submit"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <div className="loading loading-spinner loading-sm"></div>
                    Creating Post...
                  </>
                ) : (
                  <>
                    <FaPlus />
                    Create Post
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => reset()}
                className="btn btn-outline btn-lg rounded-xl px-6 py-4 font-semibold border-base-300 hover:border-primary transition-all duration-300"
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="bg-primary/5 rounded-2xl border border-primary/20 p-6 mt-8">
          <h3 className="font-semibold text-lg text-base-content mb-3 flex items-center gap-2">
            💡 Posting Tips
          </h3>
          <ul className="text-base-content/70 space-y-2 text-sm">
            <li>• Be clear and descriptive in your title and description</li>
            <li>• Use proper code formatting for code snippets</li>
            <li>• Choose the most relevant category tag</li>
            <li>• Be respectful and follow community guidelines</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddPost;