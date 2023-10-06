import React, { useState, useEffect } from 'react';
import './LikedPost.css';
import PostContent from '../HomePage/PostContent';

const LikedPost = ({ user }) => {
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    if (user && user.username) {
      const userLikedPosts = JSON.parse(localStorage.getItem(`users/${user.username}/likedpost`)) || [];
      setLikedPosts(userLikedPosts);
    }
  }, [user]);

  const handleUnlike = (postId) => {
    if (user && user.username) {
      const updatedLikedPosts = likedPosts.filter((likedPost) => likedPost.id !== postId);
      setLikedPosts(updatedLikedPosts);
      const postLikedByUsers = JSON.parse(localStorage.getItem(`post_${postId}_likes`)) || [];
      const updatedLikes = postLikedByUsers.filter((username) => username !== user.username);
      localStorage.setItem(`post_${postId}_likes`, JSON.stringify(updatedLikes));
      localStorage.setItem(`users/${user.username}/likedpost`, JSON.stringify(updatedLikedPosts));
    }
  };
  

  return (
    <div className="liked-post-container">
      <h2>Liked Posts</h2>
      {likedPosts.length === 0 ? (
        <p>No liked posts yet.</p>
      ) : (
        <ul>
          {likedPosts.map((post) => (
            <li key={post.id}>
             <button className="unlike-button" onClick={() => handleUnlike(post.id)}>Unlike</button>
              <div className="post">
                <PostContent userContent={post.content} />
                {post.categories && (
                  <p className="post-categories">Categories: {post.categories.join(', ')}</p>
                )}
                {post.tags && (
                  <p className="post-tags">Tags: {post.tags.join(', ')}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LikedPost;
