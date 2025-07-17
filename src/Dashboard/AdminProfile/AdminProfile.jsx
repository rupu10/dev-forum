import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

const AdminProfile = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [newTag, setNewTag] = useState("");

  const { user } = useAuth();
const { data: profile = {} } = useQuery({
  queryKey: ["adminProfile", user?.email],
  enabled: !!user?.email, // ensures the query only runs when user.email is available
  queryFn: async () => {
    const res = await axiosSecure.get(`/admin/profile?email=${user.email}`);
    return res.data;
  },
});


  // console.log(profile);

  const { data: stats = {} } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/stats");
      return res.data;
    },
  });

  // console.log(stats);

  const tagMutation = useMutation({
    mutationFn: async (tag) => {
      return axiosSecure.post("/tags", { tag });
    },
    onSuccess: () => {
      setNewTag("");
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    tagMutation.mutate(newTag);
  };

  const chartData = [
    { name: "Posts", value: stats.posts || 0 },
    { name: "Comments", value: stats.comments || 0 },
    { name: "Users", value: stats.users || 0 },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-6 mb-6">
        <img
          src={profile?.image || "/default-avatar.png"}
          alt={profile?.name}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold">{profile.name}</h2>
          <p>{profile.email}</p>
          <p>Total Posts: {stats.posts || 0}</p>
          <p>Total Comments: {stats.comments || 0}</p>
          <p>Total Users: {stats.users || 0}</p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="w-full h-72 mb-8">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Tag Form */}
      <form onSubmit={handleAddTag} className="flex space-x-2 items-center">
  <div className="flex flex-col w-full max-w-xs">
    <input
      type="text"
      value={newTag}
      onChange={(e) => setNewTag(e.target.value)}
      placeholder="Enter new tag"
      className="input input-bordered w-full"
      required
    />
  </div>
  <button
    type="submit"
    className="btn btn-primary"
    disabled={newTag.trim() === ""}
  >
    Add Tag
  </button>
</form>
    </div>
  );
};

export default AdminProfile;