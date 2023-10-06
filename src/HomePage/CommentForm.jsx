import React, { useState } from 'react';
import { useUser } from '../Authentication/UserContext';
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
      return;
    }
    const newComment = {
      id: Date.now(),
      text: `${user ? user.username : 'anonymous'}: ${comment}`, 
    };
    onCommentSubmit(newComment);
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
