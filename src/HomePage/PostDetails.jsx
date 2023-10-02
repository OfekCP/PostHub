import React, { useState, useEffect } from 'react';
import './PostDetails.css'; // Import the CSS file
import PostContent from './PostContent';
import CommentForm from './CommentForm';

const PostDetails = ({ post, onClose }) => {
  const [comments, setComments] = useState([]);
  const [showAddComment, setShowAddComment] = useState(false);

  useEffect(() => {
    // Fetch comments from local storage for the current post
    const storedComments = JSON.parse(localStorage.getItem(`post_${post.id}_comments`)) || [];
    setComments(storedComments);
  }, [post.id]);

  const handleCommentSubmit = (newComment) => {
    // Add the new comment to the comments array
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);

    // Store the updated comments in local storage
    localStorage.setItem(`post_${post.id}_comments`, JSON.stringify(updatedComments));
  };

  return (
    <div className="post-details-container">
      <button className="close-button" onClick={onClose}>
        Close
      </button>
      <PostContent userContent={post.content} />

      <button id='comment' onClick={() => setShowAddComment(!showAddComment)}>
        {showAddComment ? 'Hide Comment Form' : 'Add Comment'}
      </button>
      
      {showAddComment && (
        <CommentForm post={post} onCommentSubmit={handleCommentSubmit} />
      )}

      <h4>Comments:</h4>
      <div className="comments">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p>{comment.text}</p>
          </div>
        ))}
      </div>

      <p className="post-categories">Categories: {post.categories.join(', ')}</p>
      <p className="post-tags">Tags: {post.tags.join(', ')}</p>
    </div>
  );
};

export default PostDetails;
