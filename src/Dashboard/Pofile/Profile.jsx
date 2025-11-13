import React from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { FaUser, FaEnvelope, FaCrown, FaUserShield, FaFileAlt, FaArrowRight, FaCalendar, FaTag, FaFire, FaComments, FaEdit, FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const MyProfile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: userInfo = {}, isLoading: userLoading } = useQuery({
    queryKey: ["userProfile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?email=${user.email}`);
      return res.data;
    },
  });

  // Query to get latest 3 posts by user
  const { data: recentPosts = [], isLoading: postsLoading } = useQuery({
    queryKey: ["recentPosts", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/posts/recent?email=${user.email}&limit=3`);
      return res.data;
    },
  });

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { 
        color: "bg-red-100 text-red-800 border-red-300", 
        icon: FaUserShield, 
        label: "Administrator" 
      },
      gold_user: { 
        color: "bg-yellow-100 text-yellow-800 border-yellow-300", 
        icon: FaCrown, 
        label: "Gold Member" 
      },
      bronze_user: { 
        color: "bg-blue-100 text-blue-800 border-blue-300", 
        icon: FaUser, 
        label: "Bronze Member" 
      },
    };

    const config = roleConfig[role] || roleConfig.bronze_user;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${config.color}`}>
        <IconComponent className="text-sm" />
        {config.label}
      </span>
    );
  };

  const calculateTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  // Calculate stats from recent posts
  const totalPosts = recentPosts.length;
  const totalVotes = recentPosts.reduce((sum, post) => sum + ((post.upVote || 0) - (post.downVote || 0)), 0);
  const totalComments = recentPosts.reduce((sum, post) => sum + (post.commentCount || 0), 0);

  if (userLoading || postsLoading)
    return (
      <div className="min-h-screen bg-base-200 pt-20 flex items-center justify-center">
        <div className="flex space-x-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <div className="loading loading-spinner loading-lg text-secondary"></div>
          <div className="loading loading-spinner loading-lg text-accent"></div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="md:w-10/12 lg:max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-6 py-3 rounded-full border border-primary/20 mb-6">
            <FaUser className="text-lg" />
            <span className="font-semibold">My Profile</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
            Welcome, <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{user?.displayName}</span>
          </h1>
          
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Manage your profile, track your activity, and engage with the community.
          </p>
        </div>

        {/* Profile Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* User Info Card */}
          <div className="lg:col-span-2 bg-base-100 rounded-2xl shadow-lg border border-base-300 p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl border-4 border-base-300 shadow-lg">
                  <img
                    className="w-full h-full rounded-2xl object-cover"
                    src={user?.photoURL || "/default-avatar.png"}
                    alt="profile"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-base-100"></div>
              </div>

              {/* User Details */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-base-content">
                    {user?.displayName}
                  </h2>
                  {getRoleBadge(userInfo?.role || "bronze_user")}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-base-content/70">
                    <FaEnvelope className="text-base-content/50" />
                    <span className="text-lg">{user?.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-base-content/70">
                    <FaCalendar className="text-base-content/50" />
                    <span className="text-lg">
                      Joined {new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}
                    </span>
                  </div>
                </div>

                {/* Quick Stats from Recent Posts */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-base-300">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{totalPosts}</div>
                    <div className="text-sm text-base-content/70">Recent Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">{totalVotes}</div>
                    <div className="text-sm text-base-content/70">Total Votes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{totalComments}</div>
                    <div className="text-sm text-base-content/70">Comments</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upgrade Card - Only show for bronze users */}
          {userInfo?.role === "bronze_user" && (
            <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl shadow-lg p-8 text-white">
              <div className="text-center">
                <FaCrown className="text-4xl mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2">Upgrade to Gold</h3>
                <p className="text-yellow-100 mb-4 text-sm">
                  Unlock unlimited posts, premium features, and enhanced visibility.
                </p>
                <Link to="/membership">
                  <button className="btn btn-lg bg-white text-amber-600 border-none hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 w-full">
                    Upgrade Now
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Recent Posts Section */}
        <div className="bg-base-100 rounded-2xl shadow-lg border border-base-300 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-base-content flex items-center gap-3">
              <FaFileAlt className="text-primary" />
              Recent Posts
            </h2>
            {recentPosts.length > 0 && (
              <Link to="/dashboard/myPost">
                <button className="btn btn-outline btn-sm rounded-xl border-base-300 hover:border-primary transition-all duration-300 flex items-center gap-2">
                  View All Posts
                  <FaArrowRight className="text-sm" />
                </button>
              </Link>
            )}
          </div>

          {recentPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-base-content mb-2">No Posts Yet</h3>
              <p className="text-base-content/70 mb-6">
                Start sharing your knowledge with the community!
              </p>
              <Link to="/dashboard/addPost">
                <button className="btn btn-primary rounded-xl px-6 py-3 font-semibold flex items-center gap-2">
                  <FaEdit />
                  Create Your First Post
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <div 
                  key={post._id} 
                  className="group bg-base-200 rounded-xl border border-base-300 hover:border-primary/30 hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  <Link to={`/posts/${post._id}`}>
                    <div className="p-6">
                      {/* Post Header */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20">
                          {post.tag}
                        </span>
                        <span className="text-xs text-base-content/50 flex items-center gap-1">
                          <FaCalendar className="text-xs" />
                          {calculateTimeAgo(post.createdAt)}
                        </span>
                      </div>

                      {/* Post Title */}
                      <h3 className="font-bold text-base-content mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Post Description */}
                      <p className="text-base-content/70 text-sm leading-relaxed line-clamp-3 mb-4">
                        {post.description}
                      </p>

                      {/* Post Stats */}
                      <div className="flex items-center justify-between pt-4 border-t border-base-300">
                        <div className="flex items-center gap-4 text-sm text-base-content/60">
                          <div className="flex items-center gap-1">
                            <FaThumbsUp className="text-green-500" />
                            <span>{post.upVote || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaThumbsDown className="text-red-500" />
                            <span>{post.downVote || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaComments className="text-blue-500" />
                            <span>{post.commentCount || 0}</span>
                          </div>
                        </div>
                        <div className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                          Read More
                          <FaArrowRight className="text-xs" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Link to="/dashboard/addPost">
            <div className="bg-base-100 rounded-2xl p-6 border border-base-300 hover:border-primary/30 hover:shadow-md transition-all duration-300 group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FaEdit className="text-primary text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-base-content">Create Post</h3>
                  <p className="text-sm text-base-content/70">Share your knowledge</p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/dashboard/myPost">
            <div className="bg-base-100 rounded-2xl p-6 border border-base-300 hover:border-primary/30 hover:shadow-md transition-all duration-300 group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FaFileAlt className="text-secondary text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-base-content">My Posts</h3>
                  <p className="text-sm text-base-content/70">Manage your content</p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/allPosts">
            <div className="bg-base-100 rounded-2xl p-6 border border-base-300 hover:border-primary/30 hover:shadow-md transition-all duration-300 group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FaComments className="text-accent text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-base-content">Browse Posts</h3>
                  <p className="text-sm text-base-content/70">Explore community</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;