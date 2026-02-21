import React, { useState } from 'react';
import { createPost } from '../api/posts';
import './PostForm.css';

function PostForm({ onPostCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createPost(formData);
      setFormData({ title: '', content: '', author: '' });
      onPostCreated();
    } catch (err) {
      alert('Failed to create post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-form">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter post title"
          />
        </div>

        <div className="form-group">
          <label>Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            placeholder="Your name"
          />
        </div>

        <div className="form-group">
          <label>Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="6"
            placeholder="Write your post content..."
          />
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}

export default PostForm;