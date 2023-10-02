import React, { useState, useEffect } from 'react';
import JsonData from '../posts.json';
import './Home.css';
import PostDetails from './PostDetails';
const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [displayedPosts, setDisplayedPosts] = useState([]);
    const [searching, setSearching] = useState(false); // Added searching state
    const [showAlert, setShowAlert] = useState(false); // Added showAlert state
    const [selectedPost, setSelectedPost] = useState(null); 
    // Simulated JSON data for 20 random blog posts
    const jsonData = JsonData;

    // Function to filter posts based on search query
    const filterPosts = () => {
        const query = searchQuery.toLowerCase();
        const filteredFromJson = jsonData.filter((post) => {
            const { title, content, tags, categories } = post;
            return (
                title.toLowerCase().includes(query) ||
                content.toLowerCase().includes(query) ||
                tags.some((tag) => tag.toLowerCase().includes(query)) ||
                categories.some((category) => category.toLowerCase().includes(query))
            );
        });

        // Fetch blogs from local storage and filter them
        const localBlogs = JSON.parse(localStorage.getItem('blogs')) || [];
        const filteredFromLocalStorage = localBlogs.filter((post) => {
            const { title, content, tags, categories } = post;
            return (
                title.toLowerCase().includes(query) ||
                content.toLowerCase().includes(query) ||
                tags.some((tag) => tag.toLowerCase().includes(query)) ||
                categories.some((category) => category.toLowerCase().includes(query))
            );
        });

        return [...filteredFromJson, ...filteredFromLocalStorage];
    };

    // Handle search input changes
    const handleSearchInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setShowAlert(false); // Reset showAlert when the user types a new query
    };

    // Function to handle search
    const handleSearch = () => {
        setSearching(true);
        const filteredPosts = filterPosts();

        if (filteredPosts.length === 0) {
            // No matching posts found, show an alert
            setShowAlert(true);
        } else {
            // Matching posts found, display them
            setShowAlert(false);
            setDisplayedPosts(filteredPosts);
        }
    };

    // Handle pressing Enter key in the search input
    const handleSearchInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        if (!searching) {
            // Fetch random posts when the component mounts
            const shuffledPosts = [...jsonData].sort(() => 0.5 - Math.random());
            const selectedPosts = shuffledPosts.slice(0, 6); // Display 6 random posts initially
            setDisplayedPosts(selectedPosts);
        }
    }, [searching, jsonData]);

    function stripHTMLTags(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.innerText || div.textContent || '';
    }
    const handleReturn = () => {
        setSearching(false);
        setSearchQuery(''); // Clear the search input
        setShowAlert(false); // Hide the alert
        // Fetch and display random posts (similar to the initial useEffect)
        const shuffledPosts = [...jsonData].sort(() => 0.5 - Math.random());
        const selectedPosts = shuffledPosts.slice(0, 6);
        setDisplayedPosts(selectedPosts);
    };
    const handlePostClick = (post) => {
        setSelectedPost(post);
        setSearching(false);
    };

    const handleClosePostDetails = () => {
        setSelectedPost(null);
        setSearching(true); 
    };
    return (
        <div className="home-container">
            <h1 id="posthub-title">PostHub</h1>
            <div className={`search-bar ${selectedPost ? 'hidden' : ''}`}>
                <input
                    type="text"
                    id="search-input"
                    className="search-input"
                    placeholder="Search blogs by tags or categories"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onKeyPress={handleSearchInputKeyPress}
                />
                <button id="search-button" className="search-button" onClick={handleSearch}>
                    Search
                </button>
            </div>
            {showAlert ? (
                <div className="alert">No posts found for your search.</div>
            ) : (
                <>
                    {selectedPost ? (
                        <PostDetails post={selectedPost} onClose={handleClosePostDetails} />
                    ) : (
                        <div className="post-list">
                            {displayedPosts.map((post) => (
                                <div key={post.id} className="post" onClick={() => handlePostClick(post)}>
                                    <h2 className="post-title">{post.title}</h2>
                                    <p className="post-content">{stripHTMLTags(post.content)}</p>
                                    <p className="post-categories">Categories: {post.categories.join(', ')}</p>
                                    <p className="post-tags">Tags: {post.tags.join(', ')}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            {searching && (
                <button id="return-button" className="return-button" onClick={handleReturn}>
                    Return
                </button>
            )}
        </div>
    );

};

export default Home;
