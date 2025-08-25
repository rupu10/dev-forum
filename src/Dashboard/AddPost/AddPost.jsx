import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useUserRole from "../../hooks/useUserRole";
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
    return <div className="text-center  mt-10"><span className="loading loading-spinner text-primary"></span>
<span className="loading loading-spinner text-secondary"></span>
<span className="loading loading-spinner text-accent"></span>
<span className="loading loading-spinner text-neutral"></span>
<span className="loading loading-spinner text-info"></span>
<span className="loading loading-spinner text-success"></span>
<span className="loading loading-spinner text-warning"></span>
<span className="loading loading-spinner text-error"></span></div>;
  }

  if (role === "bronze_user" && postInfo.count >= 5) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl font-bold text-red-500 mb-4">
          You’ve reached the post limit (5 posts).
        </h2>
        <button
          className="btn bg-[#9ECAD6] text-black"
          onClick={() => navigate("/membership")}
        >
          Upgrade to Gold
        </button>
      </div>
    );
  }

  return (
    <div className="lg:w-120 mx-auto mt-10 p-5 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Add a New Post</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="font-semibold">Post Title</label>
          <input
            type="text"
            {...register("title", { required: true })}
            className="input input-bordered w-full"
          />
          {errors.title && <p className="text-red-500">Title is required</p>}
        </div>

        <div>
          <label className="font-semibold">Post Description</label>
          <textarea
            {...register("description", { required: true })}
            className="textarea textarea-bordered w-full"
            rows="4"
          ></textarea>
          {errors.description && (
            <p className="text-red-500">Description is required</p>
          )}
        </div>

        <div>
          <label className="font-semibold">Tag</label>
          <select
            {...register("tag", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select a tag</option>
            {allTags.map((tag, index) => (
              <option key={index} value={tag.tag}>
                {tag.tag}
              </option>
            ))}
          </select>
          {errors.tag && <p className="text-red-500">Tag is required</p>}
        </div>

        <button
          className="btn bg-[#9ECAD6] text-black"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Posting..." : "Add Post"}
        </button>
      </form>
    </div>
  );
};

export default AddPost;
