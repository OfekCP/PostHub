// LikeProvider.js

import React, { createContext, useContext, useState, useEffect } from 'react';

const LikeContext = createContext();

export const useLikes = () => {
  return useContext(LikeContext);
};

export const LikeProvider = ({ children }) => {
  const [likes, setLikes] = useState({}); // Initialize likes as an empty object

  // Load initial likes from local storage when the component mounts
  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem('likes')) || {};
    setLikes(storedLikes);
  }, []);

  // Function to toggle a like
  const toggleLike = (postId) => {
    // Update the likes object based on the postId
    setLikes((prevLikes) => ({
      ...prevLikes,
      [postId]: !prevLikes[postId], // Toggle the like state
    }));

    // Save the updated likes to local storage
    localStorage.setItem('likes', JSON.stringify({ ...likes, [postId]: !likes[postId] }));
  };

  const contextValue = {
    likes,
    toggleLike,
  };

  return <LikeContext.Provider value={contextValue}>{children}</LikeContext.Provider>;
};
