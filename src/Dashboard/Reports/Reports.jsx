import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Reports = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["adminReports", page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/reports?page=${page}&limit=${limit}`);
      return res.data;
    },
  });

  const reports = data?.reports || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      return axiosSecure.delete(`/comments/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminReports", page]);
    },
  });

  const dismissReportMutation = useMutation({
    mutationFn: async (reportId) => {
      return axiosSecure.delete(`/reports/${reportId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminReports", page]);
    },
  });

  const handleDeleteComment = (commentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCommentMutation.mutate(commentId);
        Swal.fire("Deleted!", "The comment has been deleted.", "success");
      }
    });
  };

  const handleDismissReport = (reportId) => {
    dismissReportMutation.mutate(reportId);
  };

  if (isLoading) return <div className="flex items-center justify-center">
    <div className="">
    <span className="loading loading-spinner text-primary"></span>
<span className="loading loading-spinner text-secondary"></span>
<span className="loading loading-spinner text-accent"></span>
<span className="loading loading-spinner text-neutral"></span>
<span className="loading loading-spinner text-info"></span>
<span className="loading loading-spinner text-success"></span>
<span className="loading loading-spinner text-warning"></span>
<span className="loading loading-spinner text-error"></span>
  </div>
  </div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-6">Reported Comments</h2>

      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <>
          <table className="table w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th>Commenter Email</th>
                <th>Comment</th>
                <th>Feedback</th>
                <th>Reported At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id} className="border-b">
                  <td>{report.commenterEmail}</td>
                  <td>{report.commentText}</td>
                  <td>{report.feedback}</td>
                  <td>{new Date(report.createdAt).toLocaleString()}</td>
                  <td className="space-x-2">
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDeleteComment(report.commentId)}
                    >
                      Delete Comment
                    </button>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => handleDismissReport(report._id)}
                    >
                      Dismiss Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6 gap-2">
            <button
              className="btn btn-sm"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </button>

            {[...Array(totalPages).keys()].map((p) => (
              <button
                key={p + 1}
                className={`btn btn-sm ${page === p + 1 ? "btn-active" : ""}`}
                onClick={() => setPage(p + 1)}
              >
                {p + 1}
              </button>
            ))}

            <button
              className="btn btn-sm"
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
