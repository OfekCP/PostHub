import React, { useState, useEffect } from 'react';
import JsonData from '../posts.json';
import './Home.css';
import PostDetails from './PostDetails';
const Home = ({user}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [displayedPosts, setDisplayedPosts] = useState([]);
    const [searching, setSearching] = useState(false); 
    const [showAlert, setShowAlert] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null); 
    const jsonData = JsonData;
const filterPosts = () => {
    const query = searchQuery.toLowerCase();
    const filteredFromJson = jsonData.filter((post) => {
        const { title, content, tags, categories, deleted } = post;
        return (
            !deleted &&
            (title.toLowerCase().includes(query) ||
            content.toLowerCase().includes(query) ||
            tags.some((tag) => tag.toLowerCase().includes(query)) ||
            categories.some((category) => category.toLowerCase().includes(query)))
        );
    });
    const localBlogs = JSON.parse(localStorage.getItem('blogs')) || [];
    const filteredFromLocalStorage = localBlogs.filter((post) => {
        const { title, content, tags, categories, deleted } = post;
        return (
            !deleted &&
            (title.toLowerCase().includes(query) ||
            content.toLowerCase().includes(query) ||
            tags.some((tag) => tag.toLowerCase().includes(query)) ||
            categories.some((category) => category.toLowerCase().includes(query)))
        );
    });

    return [...filteredFromJson, ...filteredFromLocalStorage];
};
    const handleSearchInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setShowAlert(false); 
    };
const handleSearch = () => {
    setSearching(true);
    if (searchQuery.trim() === '') {
        setShowAlert(true);
        return;
    }

    const filteredPosts = filterPosts();

    if (filteredPosts.length === 0) {
        setShowAlert(true);
    } else {
        setShowAlert(false);
        setDisplayedPosts(filteredPosts);
    }
};
    const handleSearchInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        if (!searching) {
            const shuffledPosts = [...jsonData].sort(() => 0.5 - Math.random());
            const selectedPosts = shuffledPosts.slice(0, 6); 
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
        setSearchQuery(''); 
        setShowAlert(false); 
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
                        <PostDetails post={selectedPost} onClose={handleClosePostDetails} user={user} />
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
            {searching && showAlert && ( 
                <button id="return-button" className="return-button" onClick={handleReturn}>
                    Return
                </button>
            )}
        </div>
    );
    

};

export default Home;
