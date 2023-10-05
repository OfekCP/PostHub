import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Blog.css'
const Blog = ({ user }) => {
    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
            ['clean']
        ],
    };
    const [likesCount, setLikesCount] = useState({});
    const [blogPosts, setBlogPosts] = useState(() => {
        // Load blog posts from local storage when the component mounts
        if (user && user.username) {
            const savedBlogs = localStorage.getItem(`users/${user.username}/blogs`);
            const parsedBlogs = savedBlogs ? JSON.parse(savedBlogs) : [];

            // Ensure all blog posts have the 'tags' property defined as an array
            const blogPostsWithTags = parsedBlogs.map((post) => ({
                ...post,
                tags: post.tags || [], // Ensure tags is an array or set it as an empty array
            }));

            return blogPostsWithTags;
        } else {
            return [];
        }
    });

    const [newPost, setNewPost] = useState({ title: '', content: '', tags: [], categories: [] });


    // Function to fetch and set blog posts from local storage
    const fetchBlogPosts = () => {
        if (user && user.username) {
            const storedPosts = JSON.parse(localStorage.getItem(`users/${user.username}/blogs`)) || [];
            setBlogPosts(storedPosts);
        }
    };
    const fetchLikesCount = () => {
        if (user && user.username) {
          blogPosts.forEach((post) => {
            const postLikedByUsers = JSON.parse(localStorage.getItem(`post_${post.id}_likes`)) || [];
            const likesCountForPost = postLikedByUsers.length;
            setLikesCount((prevLikesCount) => ({
              ...prevLikesCount,
              [post.id]: likesCountForPost,
            }));
          });
        }
      };

    // Fetch blog posts from localStorage when the component mounts
    useEffect(() => {
        console.log('Blog component mounted');
        fetchBlogPosts();
        fetchLikesCount();
    }, [user]);

    useEffect(() => {
        console.log('Blog component updated');
        if (user && user.username) {
            localStorage.setItem(`users/${user.username}/blogs`, JSON.stringify(blogPosts));
        }
    }, [user, blogPosts]);

    const handleAddPost = () => {
        if (user && user.username) {
            // Check if the content is not empty
            if (newPost.content.trim() === '') {
                alert('Please fill in the content.');
                return; // Do not proceed if the content field is empty
            }

            // Add a new blog post with the current date and time
            const post = {
                ...newPost,
                id: Date.now(),
                createdAt: new Date().toLocaleString(),
            };

            // Update the blogPosts state by merging the new post with the existing posts
            const updatedPosts = [...blogPosts, post];
            setBlogPosts(updatedPosts);

            // Clear the content field
            setNewPost({ title: '', content: '', tags: [], categories: [] });

            // Save all blogs to local storage
            localStorage.setItem(`users/${user.username}/blogs`, JSON.stringify(updatedPosts));

            // If you want to save all blogs from all users under 'blogs', you can do this:
            const allBlogs = JSON.parse(localStorage.getItem('blogs')) || [];
            const updatedAllBlogs = [...allBlogs, post];
            localStorage.setItem('blogs', JSON.stringify(updatedAllBlogs));
        }
    };


    const handleDeletePost = (postId) => {
        if (user && user.username) {
            // Delete a blog post by its ID
            const updatedPosts = blogPosts.filter((post) => post.id !== postId);
            setBlogPosts(updatedPosts);
            localStorage.setItem('blogs', JSON.stringify(updatedPosts));
            // Remove the deleted post from local storage
            localStorage.setItem(`users/${user.username}/blogs`, JSON.stringify(updatedPosts));
        }
    };
    
    const getCommentsForPost = (postId) => {
        const commentsKey = `post_${postId}_comments`;
        const storedComments = JSON.parse(localStorage.getItem(commentsKey)) || [];
        return storedComments;
    };

    return (
        <div className="blog-container">
            <h2 className="blog-title">Create a Blog Post</h2>
            <ReactQuill
                value={newPost.content}
                onChange={(value) => setNewPost({ ...newPost, content: value })}
                placeholder="Write something..."
                modules={modules}
                formats={['header', 'bold', 'italic', 'underline', 'strike', 'list', 'link']}
            />
            {/* Tags input */}
            <input
                type="text"
                placeholder="Categories (comma-separated)"
                value={newPost.categories.join(', ')}
                onChange={(e) => setNewPost({ ...newPost, categories: e.target.value.split(',').map(category => category.trim()) })}
                className="blog-input"
            />
            <input
                type="text"
                placeholder="Tags (comma-separated)"
                value={newPost.tags.join(', ')}
                onChange={(e) => setNewPost({ ...newPost, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                className="blog-input"
            />

            {/* Categories input */}


            <button className="blog-button" onClick={handleAddPost}>Create Post</button>

            <div className="blog-posts">
                {blogPosts.map((post) => (
                    <div className="blog-post" key={post.id}>
                           <p className="blog-post-likes">Likes: {likesCount[post.id] || 0}</p>
                        <h3 className="blog-post-title">{post.title}</h3>
                        <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: post.content }}></div>
                        <p className="blog-post-date">Created at: {post.createdAt}</p>
                        <p className="blog-post-categories">Categories: {post.categories.join(', ')}</p>
                        <p className="blog-post-tags">Tags: {post.tags.join(', ')}</p>
                        <button className="blog-post-button" onClick={() => handleDeletePost(post.id)}>Delete</button>
                        <div className="blog-post-comments">
                            <h4>Comments:</h4>
                            {getCommentsForPost(post.id).map((comment) => (
                                <div key={comment.id} className="comment">
                                    <p>{comment.text}</p>
                                    
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default Blog;
