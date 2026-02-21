import React, { useState, useEffect } from 'react';
import { getPosts, deletePost } from '../api/posts';
import PostForm from './PostForm';
import './PostList.css';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(id);
        fetchPosts();
      } catch (err) {
        alert('Failed to delete post');
      }
    }
  };

  const handlePostCreated = () => {
    setShowForm(false);
    fetchPosts();
  };

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="post-list-container">
      <div className="header">
        <h1>📝 Blog Posts</h1>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'New Post'}
        </button>
      </div>

      {showForm && <PostForm onPostCreated={handlePostCreated} />}

      <div className="posts-grid">
        {posts.length === 0 ? (
          <p className="no-posts">No posts yet. Create your first post!</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <h2>{post.title}</h2>
              <p className="post-meta">
                By {post.author} • {new Date(post.created_at).toLocaleDateString()}
              </p>
              <p className="post-content">{post.content}</p>
              <button 
                className="btn-delete" 
                onClick={() => handleDelete(post.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PostList;