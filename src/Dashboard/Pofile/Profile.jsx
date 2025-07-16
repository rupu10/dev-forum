import React from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";


const MyProfile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: userInfo = {}, isLoading } = useQuery({
    queryKey: ["userProfile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?email=${user.email}`);
      return res.data;
    },
  });

  if (isLoading) return <div className="text-center mt-10">Loading profile...</div>;

  return (
    <div className="w-full mx-auto mt-10 p-6 rounded shadow">
      {/* <div className="flex items-center gap-4 mb-6">
        <img
          src={user.photoURL}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-xl font-bold">{user.displayName}</h2>
          <p className="text-gray-600">{user.email}</p>
          <span className="badge badge-info mt-1 capitalize">{userInfo.role}</span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <p><strong>Account Created At:</strong> {new Date(userInfo.created_at).toLocaleString()}</p>
        <p><strong>Last Login:</strong> {new Date(userInfo.last_log_in).toLocaleString()}</p>
      </div> */}

      <div className="gap-x-30 flex justify-center items-center">
        <div>
            <img className="w-40 h-40 rounded-full" src={user.photoURL} alt="" />
        </div>
        <div>
            <h2 className="text-4xl">{user.displayName}</h2>
            <p className="text-2xl">{user.email}</p>
        </div>
        <div>
            {
                userInfo.role === 'bronze_user'? <span className="badge bg-[#92663E] text-white mt-1 capitalize">{userInfo.role}</span>:<span className="badge  bg-orange-400 text-black mt-1 capitalize">{userInfo.role}</span>
            }
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
