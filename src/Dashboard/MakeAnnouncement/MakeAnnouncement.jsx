import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaBullhorn, FaPaperPlane, FaUser, FaExclamationCircle, FaInfoCircle } from "react-icons/fa";

const MakeAnnouncement = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

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
        Swal.fire({
          icon: "success",
          title: "Announcement Published!",
          text: "Your announcement has been successfully posted to the community.",
          confirmButtonColor: "#10B981",
        });
        reset();
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Publication Failed",
        text: "Failed to post announcement. Please try again.",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="md:w-10/12 lg:max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-6 py-3 rounded-full border border-primary/20 mb-6">
            <FaBullhorn className="text-xl" />
            <span className="font-semibold">Create Announcement</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
            Share <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Important Updates</span>
          </h1>
          
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Communicate important information, updates, and news with the entire developer community.
          </p>
        </div>

        {/* Author Info Card */}
        <div className="bg-base-100 rounded-2xl shadow-sm border border-base-300 p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="avatar">
              <div className="w-16 h-16 rounded-full border-2 border-base-300">
                <img
                  src={user?.photoURL || "/default-avatar.png"}
                  alt={user?.displayName || "Admin"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-base-content flex items-center gap-2">
                <FaUser className="text-base-content/50" />
                {user?.displayName || "Community Admin"}
              </h3>
              <p className="text-base-content/70 mt-1">
                You are creating an announcement that will be visible to all community members.
              </p>
            </div>
          </div>
        </div>

        {/* Announcement Form */}
        <div className="bg-base-100 rounded-2xl shadow-lg border border-base-300 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title Field */}
            <div className="space-y-3">
              <label className="font-semibold text-lg text-base-content flex items-center gap-2">
                <FaBullhorn className="text-primary" />
                Announcement Title
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                {...register('title', { 
                  required: "Announcement title is required",
                  minLength: {
                    value: 5,
                    message: "Title should be at least 5 characters long"
                  },
                  maxLength: {
                    value: 100,
                    message: "Title should not exceed 100 characters"
                  }
                })}
                placeholder="Enter a clear and concise title for your announcement..."
                className="input input-bordered w-full bg-base-200 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-lg py-4"
              />
              {errors.title && (
                <p className="text-red-500 flex items-center gap-2 text-sm">
                  <FaExclamationCircle className="text-red-500 text-sm" />
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div className="space-y-3">
              <label className="font-semibold text-lg text-base-content flex items-center gap-2">
                <FaInfoCircle className="text-primary" />
                Announcement Details
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                {...register('description', { 
                  required: "Announcement details are required",
                  minLength: {
                    value: 20,
                    message: "Description should be at least 20 characters long"
                  },
                  maxLength: {
                    value: 1000,
                    message: "Description should not exceed 1000 characters"
                  }
                })}
                placeholder="Provide detailed information about the announcement. Include all relevant details, dates, and any actions required from community members..."
                className="textarea textarea-bordered w-full bg-base-200 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none min-h-40 text-lg py-4"
                rows="6"
              ></textarea>
              {errors.description && (
                <p className="text-red-500 flex items-center gap-2 text-sm">
                  <FaExclamationCircle className="text-red-500 text-sm" />
                  {errors.description.message}
                </p>
              )}
              <div className="text-sm text-base-content/50 flex items-center gap-2">
                <FaInfoCircle className="text-base-content/50" />
                Be clear and concise. This announcement will be visible to all community members.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-base-300">
              <button
                className="btn btn-primary btn-lg rounded-xl px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 disabled:opacity-50 w-full sm:w-auto"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="loading loading-spinner loading-sm"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Publish Announcement
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => reset()}
                className="btn btn-outline btn-lg rounded-xl px-6 py-4 font-semibold border-base-300 hover:border-primary transition-all duration-300 w-full sm:w-auto"
                disabled={isSubmitting}
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>

        {/* Guidelines Section */}
        {/* <div className="bg-primary/5 rounded-2xl border border-primary/20 p-6 mt-8">
          <h3 className="font-semibold text-lg text-base-content mb-4 flex items-center gap-2">
            <FaInfoCircle className="text-primary" />
            Announcement Guidelines
          </h3>
          <ul className="text-base-content/70 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
              <span>Use clear and descriptive titles that summarize the announcement</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
              <span>Include all relevant dates, deadlines, and important information</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
              <span>Be professional and respectful in your communication</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
              <span>Double-check for accuracy before publishing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
              <span>Consider the impact and relevance to the entire community</span>
            </li>
          </ul>
        </div> */}
      </div>
    </div>
  );
};

export default MakeAnnouncement;