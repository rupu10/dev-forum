import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const AddPost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // ✅ Fetch post count using TanStack Query
//   const { data: postInfo = {}, isLoading } = useQuery({
//     queryKey: ["postCount", user?.email],
//     enabled: !!user?.email,
//     queryFn: async () => {
//       const res = await axios.get(`/posts/count?email=${user.email}`);
//       return res.data; // should return { count: number, member: boolean }
//     },
//   });

  const onSubmit = async (data) => {
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

    try {
    //   const res = await axios.post("/posts", newPost);
    console.log(newPost);
    //   console.log(res.data);
      reset();
    //   navigate("/dashboard/my-posts");
    } catch (err) {
      console.error(err);
    }
  };

//   if (isLoading) {
//     return <div className="text-center mt-10">Loading...</div>;
//   }

//   if (postInfo.count >= 5 && !postInfo.member) {
//     return (
//       <div className="text-center mt-10">
//         <h2 className="text-xl font-bold text-red-500 mb-4">
//           You’ve reached the post limit (5 posts).
//         </h2>
//         <button
//           className="btn bg-[#9ECAD6] text-black"
//           onClick={() => navigate("/membership")}
//         >
//           Become a Member
//         </button>
//       </div>
//     );
//   }

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
            <option value="javascript">JavaScript</option>
            <option value="react">React</option>
            <option value="mongodb">MongoDB</option>
            <option value="nodejs">Node.js</option>
            <option value="career">Career</option>
          </select>
          {errors.tag && <p className="text-red-500">Tag is required</p>}
        </div>

        <button className="btn bg-[#9ECAD6] text-black" type="submit">
          Add Post
        </button>
      </form>
    </div>
  );
};

export default AddPost;
