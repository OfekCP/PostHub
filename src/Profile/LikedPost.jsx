import React, { useState, useEffect } from 'react';
import './LikedPost.css';

const LikedPost = ({ user }) => {
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    // Check if the user object is defined before accessing its properties
    if (user && user.username) {
      // Fetch the user's liked posts from local storage
      const userLikedPosts = JSON.parse(localStorage.getItem(`users/${user.username}/likedpost`)) || [];
      setLikedPosts(userLikedPosts);
    }
  }, [user]);

  const handleUnlike = (postId) => {
    if (user && user.username) {
      // Remove the post from the liked posts list
      const updatedLikedPosts = likedPosts.filter((likedPostId) => likedPostId !== postId);
      setLikedPosts(updatedLikedPosts);

      // Remove the post from the user's liked posts in local storage
      localStorage.setItem(`users/${user.username}/likedpost`, JSON.stringify(updatedLikedPosts));

      // Remove the user from the post's liked list in local storage
      const postLikedByUsers = JSON.parse(localStorage.getItem(`post_${postId}_likes`)) || [];
      const updatedLikes = postLikedByUsers.filter((username) => username !== user.username);
      localStorage.setItem(`post_${postId}_likes`, JSON.stringify(updatedLikes));
    }
  };

  return (
    <div className="liked-post-container">
      <h2>Liked Posts</h2>
      {likedPosts.length === 0 ? (
        <p>No liked posts yet.</p>
      ) : (
        <ul>
          {likedPosts.map((postId) => (
            <li key={postId}>
              <button onClick={() => handleUnlike(postId)}>Unlike</button> Post ID: {postId}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LikedPost;
