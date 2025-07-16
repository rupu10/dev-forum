import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MakeAnnouncement = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const announcement = {
      title: data.title,
      description: data.description,
      authorName: user.displayName,
      authorImage: user.photoURL,
      created_at: new Date(),
    };

    try {
      const res = await axiosSecure.post('/announcements', announcement);
      if (res.data.insertedId) {
        Swal.fire("Success", "Announcement posted!", "success");
        reset();
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to post announcement", "error");
    }
  };

  return (
    <div className="lg:w-120 border mx-auto mt-10 p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Make Announcement</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="font-semibold">Title</label>
          <input
            type="text"
            {...register('title', { required: true })}
            className="input input-bordered w-full"
          />
          {errors.title && <p className="text-red-500">Title is required</p>}
        </div>

        <div>
          <label className="font-semibold">Description</label>
          <textarea
            {...register('description', { required: true })}
            className="textarea textarea-bordered w-full"
            rows="4"
          ></textarea>
          {errors.description && <p className="text-red-500">Description is required</p>}
        </div>

        <button className="btn bg-[#9ECAD6] text-black" type="submit">
          Post Announcement
        </button>
      </form>
    </div>
  );
};

export default MakeAnnouncement;
