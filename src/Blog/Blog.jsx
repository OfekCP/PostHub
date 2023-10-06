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
        if (user && user.username) {
            const savedBlogs = localStorage.getItem(`users/${user.username}/blogs`);
            const parsedBlogs = savedBlogs ? JSON.parse(savedBlogs) : [];
            const blogPostsWithTags = parsedBlogs.map((post) => ({
                ...post,
                tags: post.tags || [], 
            }));

            return blogPostsWithTags;
        } else {
            return [];
        }
    });
    const [newPost, setNewPost] = useState({ title: '', content: '', tags: [], categories: [] });
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
            if (newPost.content.trim() === '') {
                alert('Please fill in the content.');
                return; 
            }
            const post = {
                ...newPost,
                id: Date.now(),
                createdAt: new Date().toLocaleString(),
            };
            const updatedPosts = [...blogPosts, post];
            setBlogPosts(updatedPosts);

            // Clear the content field
            setNewPost({ title: '', content: '', tags: [], categories: [] });
            localStorage.setItem(`users/${user.username}/blogs`, JSON.stringify(updatedPosts));
            const allBlogs = JSON.parse(localStorage.getItem('blogs')) || [];
            const updatedAllBlogs = [...allBlogs, post];
            localStorage.setItem('blogs', JSON.stringify(updatedAllBlogs));
        }
    };


    const handleDeletePost = (postId) => {
        if (user && user.username) {
            const updatedPosts = blogPosts.filter((post) => post.id !== postId);
            setBlogPosts(updatedPosts);
            localStorage.setItem('blogs', JSON.stringify(updatedPosts));
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
