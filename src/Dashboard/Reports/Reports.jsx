import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaFlag, FaTrash, FaTimes, FaEye, FaUser, FaComment, FaCalendar, FaExclamationTriangle, FaArrowLeft, FaArrowRight, FaShieldAlt } from "react-icons/fa";

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

  const handleDeleteComment = (report) => {
    Swal.fire({
      title: "Delete Comment?",
      html: `
        <div class="text-left">
          <p class="mb-3 text-red-600 font-semibold">This action cannot be undone.</p>
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p class="text-sm text-gray-600 mb-2"><strong>Comment by:</strong> ${report.commenterEmail}</p>
            <p class="text-sm text-gray-800"><strong>Content:</strong> "${report.commentText}"</p>
          </div>
          <p class="text-sm text-gray-600">The comment will be permanently removed from the system.</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Delete Comment",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCommentMutation.mutate(report.commentId);
        Swal.fire("Deleted!", "The comment has been permanently deleted.", "success");
      }
    });
  };

  const handleDismissReport = (report) => {
    Swal.fire({
      title: "Dismiss Report?",
      html: `
        <div class="text-left">
          <p class="mb-3 text-amber-600">This report will be removed from the queue.</p>
          <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p class="text-sm text-gray-600 mb-1"><strong>Reported Comment:</strong></p>
            <p class="text-sm text-gray-800">"${report.commentText}"</p>
          </div>
          <p class="text-sm text-gray-600">The comment will remain visible to users.</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3B82F6",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Dismiss Report",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dismissReportMutation.mutate(report._id);
        Swal.fire("Dismissed!", "The report has been dismissed.", "success");
      }
    });
  };

  const calculateTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays === 1) return "Yesterday";
    return `${diffInDays} days ago`;
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

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="md:w-10/12 lg:max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-red-100 text-red-800 px-6 py-3 rounded-full border border-red-200 mb-6">
            <FaFlag className="text-lg" />
            <span className="font-semibold">Content Moderation</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
            Reported <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Content</span>
          </h1>
          
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Review and take action on reported comments to maintain community standards.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-base-100 rounded-2xl p-6 text-center shadow-sm border border-base-300">
            <div className="text-3xl font-bold text-red-600 mb-2">{totalCount}</div>
            <div className="text-base-content/70 font-medium">Total Reports</div>
          </div>
          <div className="bg-base-100 rounded-2xl p-6 text-center shadow-sm border border-base-300">
            <div className="text-3xl font-bold text-orange-600 mb-2">{reports.length}</div>
            <div className="text-base-content/70 font-medium">Active Reports</div>
          </div>
          <div className="bg-base-100 rounded-2xl p-6 text-center shadow-sm border border-base-300">
            <div className="text-3xl font-bold text-blue-600 mb-2">{totalPages}</div>
            <div className="text-base-content/70 font-medium">Total Pages</div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-base-100 rounded-2xl shadow-lg border border-base-300 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-b border-base-300 px-6 py-4">
            <h3 className="font-bold text-lg text-base-content flex items-center gap-2">
              <FaShieldAlt className="text-red-600" />
              Reported Comments ({totalCount})
            </h3>
          </div>

          {/* Table Content */}
          {reports.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-base-content mb-2">No Active Reports</h3>
              <p className="text-base-content/70">
                All reported content has been reviewed and resolved.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-base-200">
                  <tr>
                    <th className="font-semibold text-base-content">Report Details</th>
                    <th className="font-semibold text-base-content">Comment Content</th>
                    <th className="font-semibold text-base-content">Feedback</th>
                    <th className="font-semibold text-base-content">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report._id} className="hover:bg-base-200 transition-colors duration-200 border-b border-base-300 last:border-b-0">
                      <td>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <FaUser className="text-base-content/50 text-sm" />
                            <span className="font-medium text-base-content text-sm">
                              {report.commenterEmail}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-base-content/60">
                            <FaCalendar className="text-base-content/40" />
                            <span>{calculateTimeAgo(report.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-base-content/60">
                            <FaExclamationTriangle className="text-red-500" />
                            <span>Reported</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="max-w-xs">
                          <p className="text-base-content/90 text-sm leading-relaxed line-clamp-3">
                            "{report.commentText}"
                          </p>
                        </div>
                      </td>
                      <td>
                        <div className="max-w-xs">
                          <p className="text-base-content/80 text-sm leading-relaxed line-clamp-3">
                            {report.feedback}
                          </p>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col gap-2">
                          <button
                            className="btn btn-sm btn-error text-white shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2"
                            onClick={() => handleDeleteComment(report)}
                            disabled={deleteCommentMutation.isLoading}
                          >
                            <FaTrash className="text-sm" />
                            Delete Comment
                          </button>
                          <button
                            className="btn btn-sm btn-outline border-base-300 hover:border-green-500 hover:text-green-600 transition-all duration-300 flex items-center gap-2"
                            onClick={() => handleDismissReport(report)}
                            disabled={dismissReportMutation.isLoading}
                          >
                            <FaTimes className="text-sm" />
                            Dismiss Report
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-base-300">
            <div className="text-sm text-base-content/70">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalCount)} of {totalCount} reports
            </div>
            
            <div className="flex items-center gap-2">
              <button
                className="btn btn-outline btn-sm rounded-xl border-base-300 hover:border-primary transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                disabled={page === 1}
                onClick={() => setPage(prev => prev - 1)}
              >
                <FaArrowLeft className="text-sm" />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, idx) => {
                  const pageNum = idx + 1;
                  const isCurrent = pageNum === page;
                  const isNearCurrent = Math.abs(pageNum - page) <= 2;
                  
                  if (isNearCurrent || pageNum === 1 || pageNum === totalPages) {
                    return (
                      <button
                        key={pageNum}
                        className={`btn btn-sm min-w-12 rounded-xl ${
                          isCurrent 
                            ? 'btn-primary' 
                            : 'btn-outline border-base-300 hover:border-primary'
                        }`}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (Math.abs(pageNum - page) === 3) {
                    return <span key={pageNum} className="px-2 text-base-content/50">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                className="btn btn-outline btn-sm rounded-xl border-base-300 hover:border-primary transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                disabled={page === totalPages}
                onClick={() => setPage(prev => prev + 1)}
              >
                Next
                <FaArrowRight className="text-sm" />
              </button>
            </div>
          </div>
        )}

        {/* Guidelines */}
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 mt-8">
          <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
            <FaShieldAlt className="text-amber-600" />
            Moderation Guidelines
          </h3>
          <ul className="text-amber-700 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>Review each report carefully before taking action</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>Delete comments that violate community guidelines</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>Dismiss reports for comments that don't violate guidelines</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
              <span>Maintain consistent and fair moderation standards</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Reports;