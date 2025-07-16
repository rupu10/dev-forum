import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import Swal from "sweetalert2";

const Reports = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["adminReports"],
    queryFn: async () => {
      const res = await axiosInstance.get("/reports");
      return res.data;
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      return axiosInstance.delete(`/comments/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminReports"] });
    },
  });

  const dismissReportMutation = useMutation({
    mutationFn: async (reportId) => {
      return axiosInstance.delete(`/reports/${reportId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminReports"] });
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
    confirmButtonText: "Yes, delete it!"
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

  if (isLoading) return <p className="text-center">Loading reports...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-6">Reported Comments</h2>

      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
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
      )}
    </div>
  );
};

export default Reports;
