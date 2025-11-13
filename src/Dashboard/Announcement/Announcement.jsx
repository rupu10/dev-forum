import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import { FaBullhorn, FaCalendar, FaUser, FaExclamationCircle } from "react-icons/fa";

const Announcement = () => {
  const axiosInstance = useAxios()

  const { data: announcements = [], isLoading, error } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await axiosInstance.get("/announcements");
      return res.data;
    },
  });

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

  if (isLoading) return (
    <div className="min-h-screen bg-base-200 pt-20 flex items-center justify-center">
      <div className="flex space-x-4">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <div className="loading loading-spinner loading-lg text-secondary"></div>
        <div className="loading loading-spinner loading-lg text-accent"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-base-200 pt-20 flex items-center justify-center">
      <div className="alert alert-error max-w-md">
        <span>Failed to load announcements. Please try again.</span>
      </div>
    </div>
  );

  if (announcements.length === 0)
    return (
      <div className="min-h-screen bg-base-200 pt-20">
        <div className="md:w-10/12 lg:max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📢</div>
            <h3 className="text-2xl font-bold text-base-content mb-4">No Announcements Yet</h3>
            <p className="text-base-content/70 text-lg max-w-md mx-auto">
              Check back later for important updates and community announcements.
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="md:w-10/12 lg:max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-6 py-3 rounded-full border border-primary/20 mb-6">
            <FaBullhorn className="text-xl" />
            <span className="font-semibold text-lg">Community Announcements</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
            Latest <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Updates</span>
          </h1>
          
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
            Stay informed with the latest news, updates, and important information from our community.
          </p>
        </div>

        {/* Announcements Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {announcements.map((ann) => (
            <div 
              key={ann._id} 
              className="group bg-base-100 rounded-2xl shadow-lg border border-base-300 hover:shadow-xl hover:border-primary/20 transition-all duration-500 overflow-hidden"
            >
              {/* Announcement Header */}
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-base-300 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-14 h-14 rounded-full border-2 border-base-300">
                        {ann.authorImage ? (
                          <img
                            src={ann.authorImage}
                            alt={ann.authorName || "Author"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <FaUser className="text-xl" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-base-content flex items-center gap-2">
                        <FaUser className="text-base-content/50 text-sm" />
                        {ann.authorName || "Community Admin"}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-base-content/70 mt-1">
                        <span className="flex items-center gap-1">
                          <FaCalendar className="text-base-content/50" />
                          {new Date(ann.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaExclamationCircle className="text-base-content/50" />
                          {calculateTimeAgo(ann.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Announcement Title */}
                <h4 className="text-2xl font-bold text-base-content group-hover:text-primary transition-colors duration-300">
                  {ann.title}
                </h4>
              </div>

              {/* Announcement Content */}
              <div className="p-6">
                <p className="text-base-content/80 leading-relaxed text-lg">
                  {ann.description}
                </p>
                
                {/* Announcement Footer */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-base-300">
                  <div className="flex items-center gap-2 text-sm text-base-content/60">
                    <FaBullhorn className="text-primary" />
                    <span>Community Announcement</span>
                  </div>
                  <div className="text-sm text-base-content/50">
                    Posted {calculateTimeAgo(ann.created_at)}
                  </div>
                </div>
              </div>

              {/* Hover Effect Indicator */}
              <div className="w-0 h-1 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* Stats Footer */}
        <div className="text-center mt-16 pt-8 border-t border-base-300">
          <div className="inline-flex items-center gap-6 text-base-content/60">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">{announcements.length} Active Announcements</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">Updated Regularly</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcement;