import React from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

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

  if (userLoading || postsLoading)
    return <div className="text-center mt-10">Loading profile...</div>;

  return (
    <div className="w-full mx-auto mt-10 p-6 rounded shadow">
      <div className="gap-x-5 md:gap-x-30 flex justify-center items-center">
        <div>
          <img
            className="h-20 w-20 md:w-40 md:h-40 rounded-full"
            src={user.photoURL}
            alt="profile"
          />
        </div>
        <div>
          <h2 className="text-4xl">{user.displayName}</h2>
          <p className="text-2xl">{user.email}</p>
        </div>
        <div>
          {userInfo.role === "bronze_user" ? (
            <span className="badge bg-[#92663E] text-white mt-1 capitalize">
              {userInfo.role}
            </span>
          ) : (
            <span className="badge bg-orange-400 text-black mt-1 capitalize">
              {userInfo.role}
            </span>
          )}
        </div>
      </div>

      {/* Recent 3 Posts */}
      <div className="mt-8 flex justify-center">
        <div>
            <h3 className="text-2xl font-semibold mb-4">Recent Posts</h3>
        {recentPosts.length === 0 ? (
          <p className="text-gray-500">No recent posts found.</p>
        ) : (
          <ul className="space-y-4">
            {recentPosts.map((post) => (
              <li
                key={post._id}
                className="p-4 border rounded shadow hover:shadow-md transition"
              >
                <h4 className="text-xl font-bold">{post.title}</h4>
                <p className="text-gray-600 mt-1">
                  {post.description.length > 100
                    ? post.description.slice(0, 100) + "..."
                    : post.description}
                </p>
                <p className="text-sm mt-1 text-gray-400">
                  Tag: <span className="capitalize">{post.tag}</span>
                </p>
                <Link
                  to={`/posts/${post._id}`}
                  className="text-blue-600 hover:underline mt-2 inline-block"
                >
                  Read more
                </Link>
              </li>
            ))}
          </ul>
        )}
        </div>
      </div>

      {userInfo.role === "bronze_user" && (
        <div className="flex justify-center items-center">
          <Link to="/membership">
            <button className="btn btn-warning mt-6">Upgrade to Gold</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyProfile;

