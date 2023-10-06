import React, { useState, useEffect } from 'react';
import './Profile.css'
import { Link } from 'react-router-dom'
const Profile = ({ user }) => {
    const defaultProfilePicture = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
    const [userProfile, setUserProfile] = useState(null);
    const [blogPosts, setBlogPosts] = useState([]);
    const [newBio, setNewBio] = useState('');
    const [newProfilePicture, setNewProfilePicture] = useState(null);
    const [editingBio, setEditingBio] = useState(false);
    const fetchUserProfile = () => {
        if (user && user.username) {
            const userProfileData = {
                username: user.username,
                profilePicture: '', 
                bio: '',
            };
            setUserProfile(userProfileData);
        }
    };
    const fetchUserProfileFromLocalStorage = () => {
        if (user && user.username) {
            const savedProfile = localStorage.getItem(`users/${user.username}/profile`);
            if (savedProfile) {
                const parsedProfile = JSON.parse(savedProfile);
                setUserProfile(parsedProfile);
                setNewProfilePicture(parsedProfile.profilePicture || defaultProfilePicture);
            }
        }
    };
    const fetchUserBlogPosts = () => {
        if (user && user.username) {
            const savedBlogs = localStorage.getItem(`users/${user.username}/blogs`);

            if (savedBlogs) {
                setBlogPosts(JSON.parse(savedBlogs));
            } else {
               
                setBlogPosts([]);
            }
        }
    };

   
    useEffect(() => {
        fetchUserProfile();
        fetchUserProfileFromLocalStorage();
        fetchUserBlogPosts();
    }, [user]);

   
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
                setNewProfilePicture(e.target.result);
                if (user && user.username) {
                    const userProfileData = JSON.parse(localStorage.getItem(`users/${user.username}/profile`)) || {};
                    userProfileData.profilePicture = e.target.result;
                    localStorage.setItem(`users/${user.username}/profile`, JSON.stringify(userProfileData));
                }
            };
            reader.readAsDataURL(file);
        }
    };



    const handleEditBio = () => {
        setEditingBio(true);
    };

    const handleSaveBio = () => {
        setUserProfile({
            ...userProfile,
            bio: newBio,
            profilePicture: newProfilePicture || defaultProfilePicture,
        });
        setEditingBio(false);
        saveUserProfileToLocalStorage();
    };

    if (!userProfile) {
        return <div>User not found</div>;
    }

    const handleRemoveProfilePicture = () => {
        setNewProfilePicture(null);
        if (user && user.username) {
            const userProfileData = JSON.parse(localStorage.getItem(`users/${user.username}/profile`)) || {};
            userProfileData.profilePicture = ''; 
            localStorage.setItem(`users/${user.username}/profile`, JSON.stringify(userProfileData));
        }
    };
    return (
        <div>
            <h2 id="user-profile-heading">User Profile Page</h2>
            <Link to='/profile/likedpost' className="liked-posts-button">
                <button className="liked-posts-button-text">Liked Posts</button>
            </Link>

            <div>
                <h3 id="username-heading">Username: {user.username}</h3>
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
                </div>
            ))}

        </div>
    );
};

export default Profile;
