import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog } from "@headlessui/react";
import { useParams } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const feedbackOptions = [
  "Offensive or inappropriate",
  "Spam or irrelevant",
  "Harassment or abuse",
];

const CommentList = () => {
  const { postId } = useParams();
  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient();
  const [selectedComment, setSelectedComment] = useState(null);
  const [reported, setReported] = useState({});
  const [selectedFeedback, setSelectedFeedback] = useState({});

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/comments?postId=${postId}`);
      return res.data;
    },
  });


  const reportMutation = useMutation({
    mutationFn: async (reportData) => {
      return axiosSecure.post("/reports", reportData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const handleReport = (comment) => {
    const commentId = comment._id;
    const feedback = selectedFeedback[commentId];

    if (!feedback) return;

    const reportData = {
      commentId,
      commenterEmail: comment.authorEmail,
      commentText: comment.commentText,
      feedback,
    };

    reportMutation.mutate(reportData);
    setReported((prev) => ({ ...prev, [commentId]: true }));
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
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Comments for this post</h2>

      <table className="table w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th>Email</th>
            <th>Comment</th>
            <th>Feedback</th>
            <th>Report</th>
          </tr>
        </thead>
        <tbody>
        {comments.length === 0 && (
  <div className="flex justify-center items-center h-32">
    <p className="text-gray-500 text-lg italic">No comments yet</p>
  </div>
)}
          {comments.map((comment) => {
            const commentId = comment._id;
            const fullText = comment.commentText || "";
            const shortText = fullText.length > 20 ? fullText.slice(0, 20) + "..." : fullText;
            const isReported = reported[commentId];
            const feedbackSelected = selectedFeedback[commentId];

            return (
              <tr key={commentId} className="border-b">
                <td>{comment.authorEmail}</td>
                <td>
                  {shortText}
                  {fullText.length > 20 && (
                    <button onClick={() => setSelectedComment(comment)} className="ml-1 text-blue-600 underline">
                      Read More
                    </button>
                  )}
                </td>
                <td>
                  <select
                    className="select select-sm"
                    value={feedbackSelected || ""}
                    onChange={(e) =>
                      setSelectedFeedback((prev) => ({ ...prev, [commentId]: e.target.value }))
                    }
                  >
                    <option value="">Select feedback</option>
                    {feedbackOptions.map((fb, idx) => (
                      <option key={idx} value={fb}>{fb}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-warning"
                    disabled={!feedbackSelected || isReported}
                    onClick={() => handleReport(comment)}
                  >
                    {isReported ? "Reported" : "Report"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal */}
      <Dialog open={!!selectedComment} onClose={() => setSelectedComment(null)} className="fixed inset-0 z-50">
        <div className="fixed inset-0 bg-black/40" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded-lg shadow max-w-md w-full">
            <Dialog.Title className="text-xl font-semibold mb-2">Full Comment</Dialog.Title>
            <p>{selectedComment?.commentText}</p>
            <button onClick={() => setSelectedComment(null)} className="mt-4 btn btn-sm btn-neutral">
              Close
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default CommentList;
