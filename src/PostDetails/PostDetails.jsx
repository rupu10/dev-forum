import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon, LinkedinShareButton, LinkedinIcon } from "react-share";
import useAxios from "../hooks/useAxios";
import { useNavigate, useParams } from "react-router";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { FaArrowUp, FaArrowDown, FaComment, FaShare, FaCalendar, FaTag, FaUser, FaFacebook, FaTwitter, FaLinkedin, FaRegClock, FaThumbsUp, FaThumbsDown, FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa";

const PostDetails = () => {
  const { postId } = useParams();
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
          navigate('/join');
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

  const calculateTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  if (postLoading) return (
    <div className="min-h-screen bg-base-200 pt-20 flex items-center justify-center">
      <div className="flex space-x-4">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <div className="loading loading-spinner loading-lg text-secondary"></div>
        <div className="loading loading-spinner loading-lg text-accent"></div>
      </div>
    </div>
  );

  if (postError) return (
    <div className="min-h-screen bg-base-200 pt-20 flex items-center justify-center">
      <div className="alert alert-error max-w-md">
        <span>Error loading post. Please try again.</span>
      </div>
    </div>
  );

  const shareUrl = `${window.location.origin}/post/${postId}`;

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="md:w-10/12 lg:max-w-7xl mx-auto px-4 py-8">
        {/* Post Details Card */}
        <div className="bg-base-100 rounded-2xl shadow-lg border border-base-300 mb-8 overflow-hidden">
          <div className="p-8">
            {/* Author Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="avatar">
                  <div className="w-14 h-14 rounded-full border-2 border-base-300">
                    <img
                      src={post.authorImage || "/default-avatar.png"}
                      alt={post.authorName || "Author"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-base-content flex items-center gap-2">
                    <FaUser className="text-base-content/50" />
                    {post.authorName || "Unknown Author"}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-base-content/70 mt-1">
                    <span className="flex items-center gap-1">
                      <FaRegClock className="text-base-content/50" />
                      {calculateTimeAgo(post.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaTag className="text-base-content/50" />
                      {post.tag}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-base-content mb-4 leading-tight">
                {post.title}
              </h1>
              <p className="text-lg text-base-content/80 leading-relaxed">
                {post.description}
              </p>
            </div>

            {/* Post Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-base-300">
              {/* Voting Section */}
              <div className="flex items-center gap-4">
                {/* Upvote Button */}
                <button
                  disabled={voteLoading}
                  onClick={() => handleVote("upvote")}
                  className="flex items-center gap-3 px-5 py-3 rounded-xl bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100 hover:border-green-300 hover:shadow-md transition-all duration-300 disabled:opacity-50 group"
                >
                  <div className="flex items-center gap-2">
                    {/* Solid thumb when user has upvoted, outline when not */}
                    {post.userUpvoted ? (
                      <FaThumbsUp className="text-green-600 text-xl group-hover:scale-110 transition-transform duration-200" />
                    ) : (
                      <FaRegThumbsUp className="text-green-600 text-xl group-hover:scale-110 transition-transform duration-200" />
                    )}
                    <span className="font-bold text-lg">{post.upVote || 0}</span>
                  </div>
                  <span className="text-sm font-medium">Like</span>
                </button>
                
                {/* Vote Count Display */}
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 shadow-sm">
                  <span className="text-xl font-bold text-primary">
                    {(post.upVote || 0) - (post.downVote || 0)}
                  </span>
                </div>

                {/* Downvote Button */}
                <button
                  disabled={voteLoading}
                  onClick={() => handleVote("downvote")}
                  className="flex items-center gap-3 px-5 py-3 rounded-xl bg-red-50 text-red-700 border-2 border-red-200 hover:bg-red-100 hover:border-red-300 hover:shadow-md transition-all duration-300 disabled:opacity-50 group"
                >
                  <div className="flex items-center gap-2">
                    {/* Solid thumb when user has downvoted, outline when not */}
                    {post.userDownvoted ? (
                      <FaThumbsDown className="text-red-600 text-xl group-hover:scale-110 transition-transform duration-200" />
                    ) : (
                      <FaRegThumbsDown className="text-red-600 text-xl group-hover:scale-110 transition-transform duration-200" />
                    )}
                    <span className="font-bold text-lg">{post.downVote || 0}</span>
                  </div>
                  <span className="text-sm font-medium">Dislike</span>
                </button>
              </div>

              {/* Share Section */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-base-content/70 font-medium flex items-center gap-2">
                  <FaShare className="text-base-content/50" />
                  Share:
                </span>
                <div className="flex gap-2">
                  <FacebookShareButton url={shareUrl} quote={post.title}>
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors duration-300">
                      <FaFacebook className="text-white text-lg" />
                    </div>
                  </FacebookShareButton>
                  <TwitterShareButton url={shareUrl} title={post.title}>
                    <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center hover:bg-sky-600 transition-colors duration-300">
                      <FaTwitter className="text-white text-lg" />
                    </div>
                  </TwitterShareButton>
                  <LinkedinShareButton url={shareUrl} title={post.title}>
                    <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-900 transition-colors duration-300">
                      <FaLinkedin className="text-white text-lg" />
                    </div>
                  </LinkedinShareButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-base-100 rounded-2xl shadow-lg border border-base-300 p-8">
          {/* Comments Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-base-content flex items-center gap-3">
              <FaComment className="text-primary" />
              Comments
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {comments?.length ?? 0}
              </span>
            </h2>
          </div>

          {/* Comment Input */}
          {user ? (
            <div className="mb-8 p-6 bg-base-200 rounded-xl border border-base-300">
              <div className="flex items-start gap-4">
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full border-2 border-base-300">
                    <img
                      src={user.photoURL || "/default-avatar.png"}
                      alt={user.displayName || "User"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <textarea
                    className="textarea textarea-bordered w-full bg-base-100 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none"
                    rows={4}
                    placeholder="Share your thoughts... (Be respectful and constructive)"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={commentLoading}
                  />
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleAddComment}
                      className="btn btn-primary rounded-xl px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                      disabled={commentLoading || !commentText.trim()}
                    >
                      {commentLoading ? (
                        <span className="flex items-center gap-2">
                          <div className="loading loading-spinner loading-sm"></div>
                          Posting...
                        </span>
                      ) : (
                        "Post Comment"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-warning/10 border border-warning/20 rounded-xl p-6 text-center mb-8">
              <p className="text-warning-content font-medium">
                Please log in to comment and vote on this post.
              </p>
              <button
                onClick={() => navigate('/join')}
                className="btn btn-warning mt-3 rounded-xl"
              >
                Join the Discussion
              </button>
            </div>
          )}

          {/* Comments List */}
          {commentsLoading ? (
            <div className="flex justify-center py-8">
              <div className="loading loading-spinner loading-lg text-primary"></div>
            </div>
          ) : commentsError ? (
            <div className="alert alert-error">
              <span>Error loading comments. Please try again.</span>
            </div>
          ) : !comments || comments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-base-content mb-2">No comments yet</h3>
              <p className="text-base-content/70">
                Be the first to share your thoughts on this post!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment._id} className="bg-base-200 rounded-xl p-6 border border-base-300 hover:border-base-400 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="avatar">
                      <div className="w-12 h-12 rounded-full border-2 border-base-300">
                        <img
                          src={comment.authorImage || "/default-avatar.png"}
                          alt={comment.authorName || "Commenter"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-base-content">
                          {comment.authorName || "Anonymous"}
                        </h4>
                        <span className="text-sm text-base-content/50 flex items-center gap-1">
                          <FaRegClock className="text-xs" />
                          {calculateTimeAgo(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-base-content/80 leading-relaxed">
                        {comment.commentText}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;