import React, { useState } from 'react';
import { useUser } from '../Authentication/UserContext'; // Ensure the correct path to UserContext
import './CommentForm.css'
const CommentForm = ({ post, onCommentSubmit }) => {
  const { user } = useUser();
  const [comment, setComment] = useState('');

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (comment.trim() === '') {
      // Prevent submitting empty comments
      return;
    }
  
    // Create a new comment with the format "username: comment"
    const newComment = {
      id: Date.now(), // Unique identifier for the comment
      text: `${user ? user.username : 'anonymous'}: ${comment}`,  // Include the username
    };
  
    // Call the callback function to submit the comment
    onCommentSubmit(newComment);
  
    // Clear the comment input
    setComment('');
  };

  return (
    <div className="comment-form" id="comment-form">
      <h3 className="comment-form-title">Add a Comment</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="4"
          cols="50"
          placeholder="Write your comment here..."
          value={comment}
          onChange={handleCommentChange}
          className="comment-textarea"
          id="comment-textarea"
          required
        ></textarea>
        <button type="submit" className="comment-submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
