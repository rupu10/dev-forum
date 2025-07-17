import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FacebookShareButton, FacebookIcon } from "react-share";
import useAxios from "../hooks/useAxios";
import { useNavigate, useParams } from "react-router";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";

const PostDetails = () => {
  const { postId } = useParams();
//   console.log(postId);
  const axiosInstance = useAxios();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [commentText, setCommentText] = useState("");
  const [voteLoading, setVoteLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  // Fetch post details
  const {
    data: post = [],
    isLoading: postLoading,
    error: postError,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/posts/${postId}`);
      return res.data;
    },
    enabled: !!postId,
  });

//   console.log(user);


  // Fetch comments for post
  const {
    data: comments = [],
    isLoading: commentsLoading,
    error: commentsError,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/comments?postId=${postId}`);
      return res.data;
    },
    enabled: !!postId,
  });

  // Mutation: Add Comment
  const addCommentMutation = useMutation({
    mutationFn: (newComment) => axiosInstance.post("/comments", newComment),
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  // Mutation: Vote (upvote/downvote)
  const voteMutation = useMutation({
    mutationFn: ({ voteType }) =>
      axiosInstance.patch(`/posts/vote/${postId}`, { voteType }),
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(["post", postId], updatedPost.data ?? updatedPost);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleAddComment = () => {
    if (!user) {
  Swal.fire({
    icon: 'warning',
    title: 'Login Required',
    text: 'You must be logged in to comment.',
    confirmButtonText: 'OK'
  });
  return;
}
    if (!commentText.trim()) {
  Swal.fire({
    icon: 'error',
    title: 'Empty Comment',
    text: 'Comment cannot be empty.',
    confirmButtonText: 'OK'
  });
  return;
}
    setCommentLoading(true);
    addCommentMutation.mutate(
      {
        postId,
        authorEmail: user.email,
        authorName: user.displayName,
        commentText: commentText.trim(),
        createdAt: new Date().toISOString(),
      },
      {
        onSettled: () => setCommentLoading(false),
      }
    );
  };

  const handleVote = (voteType) => {
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'You must be logged in to vote.',
        confirmButtonText: 'Login Now',
        confirmButtonColor: '#3B82F6',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/join'); // Redirect using React Router
        }
      });
      return;
    }
    if (voteMutation.isLoading) return;
    setVoteLoading(true);
    voteMutation.mutate(
      { voteType },
      {
        onSettled: () => setVoteLoading(false),
      }
    );
  };

  if (postLoading) return <p>Loading post...</p>;
  if (postError) return <p>Error loading post.</p>;

  const shareUrl = `${window.location.origin}/post/${postId}`;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Post Details */}
      <div className="border p-6 rounded shadow mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={post.authorImage || "/default-avatar.png"}
            alt={post.authorName || "Author"}
            className="w-14 h-14 rounded-full"
          />
          <div>
            <p className="font-semibold">{post.authorName || "Unknown Author"}</p>
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
        <p className="mb-2 text-gray-700">{post.description}</p>
        <p className="mb-4 italic text-sm text-gray-600">Tag: {post.tag}</p>

        <div className="flex items-center space-x-4">
          <button
            disabled={voteLoading}
            onClick={() => handleVote("upvote")}
            className="btn btn-sm btn-success"
            aria-label="Upvote"
          >
            👍 Upvote ({post.upVote || 0})
          </button>
          <button
            disabled={voteLoading}
            onClick={() => handleVote("downvote")}
            className="btn btn-sm btn-error"
            aria-label="Downvote"
          >
            👎 Downvote ({post.downVote || 0})
          </button>

          <FacebookShareButton url={shareUrl} quote={post.title}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
        </div>
      </div>

      {/* Comments Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Comments ({comments?.length ?? 0})
        </h2>

        {/* Comment Input */}
        {user ? (
          <div className="mb-6">
            <textarea
              className="textarea textarea-bordered w-full mb-2"
              rows={3}
              placeholder="Write your comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={commentLoading}
            />
            <button
              onClick={handleAddComment}
              className="btn btn-primary"
              disabled={commentLoading}
            >
              {commentLoading ? "Submitting..." : "Submit Comment"}
            </button>
          </div>
        ) : (
          <p className="mb-6 text-sm text-gray-600">
            Please log in to comment and vote.
          </p>
        )}

        {/* Comments List */}
        {commentsLoading ? (
          <p>Loading comments...</p>
        ) : commentsError ? (
          <p>Error loading comments.</p>
        ) : !comments || comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((c) => (
              <li key={c._id} className="border p-3 rounded shadow-sm">
                <p className="font-semibold">{c.authorName || "Anonymous"}</p>
                <p className="text-sm text-gray-600 mb-1">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
                <p>{c.commentText}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PostDetails;
