import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getPosts = async () => {
  const response = await api.get('/posts/');
  return response.data;
};

export const getPost = async (id) => {
  const response = await api.get(`/posts/${id}/`);
  return response.data;
};

export const createPost = async (post) => {
  const response = await api.post('/posts/', post);
  return response.data;
};

export const updatePost = async (id, post) => {
  const response = await api.put(`/posts/${id}/`, post);
  return response.data;
};

export const deletePost = async (id) => {
  await api.delete(`/posts/${id}/`);
};

export default api;