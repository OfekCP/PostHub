import React, { useState, useEffect } from 'react';
import './PostDetails.css'; 
import PostContent from './PostContent';
import CommentForm from './CommentForm';
import { useNavigate } from 'react-router-dom'
const PostDetails = ({ post, onClose, user, updatePostLikedByUsers  }) => {
  const [comments, setComments] = useState([]);
  const [showAddComment, setShowAddComment] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const Nav = useNavigate()
  const isLoggedIn = user && user.username;
  useEffect(() => {
    if (user?.username) {
      const storedComments = JSON.parse(localStorage.getItem(`post_${post.id}_comments`)) || [];
      setComments(storedComments);
      const userLikedPosts = JSON.parse(localStorage.getItem(`users/${user.username}/likedpost`)) || [];
      setLiked(userLikedPosts.some((likedPost) => likedPost.id === post.id));
      const postLikedByUsers = JSON.parse(localStorage.getItem(`post_${post.id}_likes`)) || [];
      console.log(postLikedByUsers);
      setLikesCount(postLikedByUsers.length);
    }
  }, [post.id, user?.username, post.likes]);


  const handleCommentSubmit = (newComment) => {
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    localStorage.setItem(`post_${post.id}_comments`, JSON.stringify(updatedComments));
  };
  const handleLike = () => {
    if (!isLoggedIn) {
      Nav('/login'); 
      return;
    }
    setLiked(!liked);
    const postLikedByUsers = JSON.parse(localStorage.getItem(`post_${post.id}_likes`)) || [];
    if (liked) {
      const updatedLikes = postLikedByUsers.filter((username) => username !== user.username);
      localStorage.setItem(`post_${post.id}_likes`, JSON.stringify(updatedLikes));
      setLikesCount(updatedLikes.length);
    } else {
      postLikedByUsers.push(user.username);
      localStorage.setItem(`post_${post.id}_likes`, JSON.stringify(postLikedByUsers));
      setLikesCount(postLikedByUsers.length);
    }
    const userLikedPosts = JSON.parse(localStorage.getItem(`users/${user.username}/likedpost`)) || [];
    if (liked) {
      const updatedLikedPosts = userLikedPosts.filter((likedPost) => likedPost.id !== post.id);
      localStorage.setItem(`users/${user.username}/likedpost`, JSON.stringify(updatedLikedPosts));
    } else {
      const likedPost = {
        id: post.id,
        title: post.title,
        content: post.content,
        categories: post.categories,
        tags: post.tags,
      };
      userLikedPosts.push(likedPost);
      localStorage.setItem(`users/${user.username}/likedpost`, JSON.stringify(userLikedPosts));
    }
    updatePostLikedByUsers(post.id, user.username, liked);
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
      <div className="heart-container" title="Like">
        <input type="checkbox" className="checkbox" id="Give-It-An-Id" checked={liked} onChange={handleLike} />
        <div className="svg-container">
        <svg viewBox="0 0 24 24" class="svg-outline" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z">
                    </path>
                </svg>
                <svg viewBox="0 0 24 24" class="svg-filled" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z">
                    </path>
                </svg>
                <svg class="svg-celebrate" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="10,10 20,20"></polygon>
                    <polygon points="10,50 20,50"></polygon>
                    <polygon points="20,80 30,70"></polygon>
                    <polygon points="90,10 80,20"></polygon>
                    <polygon points="90,50 80,50"></polygon>
                    <polygon points="80,80 70,70"></polygon>
                </svg>
        </div>
        <span className="likes-count">{likesCount} Likes</span>
      </div>
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
