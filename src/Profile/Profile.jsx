import React, { useState, useEffect } from 'react';
import './Profile.css'
const Profile = ({ user }) => {
    const defaultProfilePicture = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
    const [userProfile, setUserProfile] = useState(null);
    const [blogPosts, setBlogPosts] = useState([]);
    const [newBio, setNewBio] = useState('');
    const [newProfilePicture, setNewProfilePicture] = useState(null);
    const [editingBio, setEditingBio] = useState(false);

    // Function to fetch user profile data
    const fetchUserProfile = () => {
        if (user && user.username) {
            // Fetch user profile data here
            // You can replace this with your logic to fetch the user's profile
            const userProfileData = {
                username: user.username,
                profilePicture: '', // Replace with actual profile picture URL
                bio: '', // Replace with the user's bio
            };
            setUserProfile(userProfileData);
        }
    };

    // Function to fetch user's profile data from local storage
    // Function to fetch user's profile data from local storage
    const fetchUserProfileFromLocalStorage = () => {
        if (user && user.username) {
            const savedProfile = localStorage.getItem(`users/${user.username}/profile`);
            if (savedProfile) {
                const parsedProfile = JSON.parse(savedProfile);
                setUserProfile(parsedProfile);

                // Set the profile picture from local storage or default if not available
                setNewProfilePicture(parsedProfile.profilePicture || defaultProfilePicture);
            }
        }
    };


    // Function to fetch and set user's published blog posts
    const fetchUserBlogPosts = () => {
        if (user && user.username) {
            // Read the user's blog posts from local storage
            const savedBlogs = localStorage.getItem(`users/${user.username}/blogs`);

            if (savedBlogs) {
                // If there are saved blog posts in local storage, parse and set them in the state
                setBlogPosts(JSON.parse(savedBlogs));
            } else {
                // If there are no saved blog posts, initialize with an empty array
                setBlogPosts([]);
            }
        }
    };

    // Fetch user profile and blog posts when the component mounts
    useEffect(() => {
        fetchUserProfile();
        fetchUserProfileFromLocalStorage();
        fetchUserBlogPosts();
    }, [user]);

    // Function to save user profile data to local storage
    const saveUserProfileToLocalStorage = () => {
        if (user && user.username) {
            const userProfileToSave = {
                ...userProfile,
                bio: newBio,
                profilePicture: newProfilePicture || defaultProfilePicture,
            };
            localStorage.setItem(`users/${user.username}/profile`, JSON.stringify(userProfileToSave));
        }
    };

    // Function to save user blog posts to local storage
    const saveUserBlogPostsToLocalStorage = () => {
        if (user && user.username) {
            localStorage.setItem(`users/${user.username}/blogs`, JSON.stringify(blogPosts));
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                // Set the new profile picture and display the uploaded image
                setNewProfilePicture(e.target.result);

                // Save the profile picture URL to local storage
                if (user && user.username) {
                    const userProfileData = JSON.parse(localStorage.getItem(`users/${user.username}/profile`)) || {};
                    userProfileData.profilePicture = e.target.result;
                    localStorage.setItem(`users/${user.username}/profile`, JSON.stringify(userProfileData));
                }
            };

            // Read the file as a data URL
            reader.readAsDataURL(file);
        }
    };

    const handleDeletePost = (postId) => {
        // Delete a blog post by its ID
        const updatedPosts = blogPosts.filter((post) => post.id !== postId);
        setBlogPosts(updatedPosts);

        // Update the local storage with the updated blog posts
        saveUserBlogPostsToLocalStorage();
    };

    const handleEditBio = () => {
        // Enable bio editing
        setEditingBio(true);
    };

    const handleSaveBio = () => {
        // Save the edited bio and disable editing
        setUserProfile({
            ...userProfile,
            bio: newBio,
            profilePicture: newProfilePicture || defaultProfilePicture,
        });
        setEditingBio(false);

        // Update the local storage with the updated profile data
        saveUserProfileToLocalStorage();
    };

    if (!userProfile) {
        return <div>User not found</div>;
    }

    const handleRemoveProfilePicture = () => {
        // Remove the newProfilePicture
        setNewProfilePicture(null);

        // Remove the profile picture URL from local storage
        if (user && user.username) {
            const userProfileData = JSON.parse(localStorage.getItem(`users/${user.username}/profile`)) || {};
            userProfileData.profilePicture = ''; // Clear the profile picture URL
            localStorage.setItem(`users/${user.username}/profile`, JSON.stringify(userProfileData));
        }
    };
    return (
        <div>
            <h2 id="user-profile-heading">User Profile Page</h2>
            <div>
                <h3 id="username-heading">Username: {userProfile.username}</h3>
                {newProfilePicture ? (
                    <div className="profile-picture-container">
                        <label htmlFor="profile-picture-input" className="profile-picture-label">
                            <img
                                src={newProfilePicture || defaultProfilePicture}
                                alt="Profile"
                                className="profile-picture"
                            />
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            id="profile-picture-input"
                            className="profile-picture-input"
                        />
                        <button
                            id="remove-profile-picture-button"
                            onClick={handleRemoveProfilePicture}
                        >
                            Remove Profile Picture
                        </button>
                    </div>
                ) : (
                    <div className="profile-picture-container">
                        <label htmlFor="profile-picture-input" className="profile-picture-label">
                            <img
                                src={defaultProfilePicture}
                                alt="Profile"
                                className="profile-picture"
                            />
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            id="profile-picture-input"
                            className="profile-picture-input"
                        />
                    </div>
                )}

                {editingBio ? (
                    <div className="bio-section">
                        <textarea
                            rows="4"
                            cols="50"
                            placeholder="Edit your bio..."
                            value={newBio}
                            onChange={(e) => setNewBio(e.target.value)}
                            id="bio-textarea"
                        ></textarea>
                        <button onClick={handleSaveBio} id="save-bio-button">
                            Save Bio
                        </button>
                    </div>
                ) : (
                    <div className="bio-section">
                        <p id="bio-paragraph">Bio: {userProfile.bio}</p>
                        <button onClick={handleEditBio} id="edit-bio-button">
                            Edit Bio
                        </button>
                    </div>
                )}

            </div>

            <h3 id="blog-posts-heading">Published Blog Posts:</h3>
            {blogPosts.map((post) => (
                <div className="blog-post" key={post.id}>
                    <h3 className="blog-post-title">{post.title}</h3>
                    <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: post.content }}></div>
                    <p className="blog-post-date">Created at: {post.createdAt}</p>
                    <p className="blog-post-categories">Categories: {post.categories.join(', ')}</p>
                        <p className="blog-post-tags">Tags: {post.tags.join(', ')}</p>
                    <button className="blog-post-button" onClick={() => handleDeletePost(post.id)}>Delete</button>
                </div>
            ))}

        </div>
    );
};

export default Profile;
