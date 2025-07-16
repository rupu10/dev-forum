import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";

const Announcement = () => {
  const axiosInstance = useAxios()

  const { data: announcements = [], isLoading, error } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await axiosInstance.get("/announcements");
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center mt-10">Loading announcements...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Failed to load announcements.</p>;

  if (announcements.length === 0)
    return <p className="text-center mt-10 text-gray-500">No announcements available.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 rounded shadow">
      <h2 className="text-3xl font-bold mb-6">Announcements</h2>
      <div className="space-y-6">
        {announcements.map((ann) => (
          <div key={ann._id} className="border p-4 rounded shadow-sm">
            <div className="flex items-center mb-4">
              {ann.authorImage ? (
                <img
                  src={ann.authorImage}
                  alt={ann.authorName || "Author"}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full mr-4 bg-gray-300 flex items-center justify-center text-gray-700">
                  {ann.authorName ? ann.authorName.charAt(0).toUpperCase() : "A"}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg">{ann.authorName || "Admin"}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(ann.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <h4 className="text-xl font-semibold mb-2">{ann.title}</h4>
            <p>{ann.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcement;
