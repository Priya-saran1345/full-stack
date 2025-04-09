/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importing icons
import toast from 'react-hot-toast';

interface User {
  id: number;
  name: string;
  email: string;
  phonenumber: number;
  age: number;
  bio: string;
}

interface Post {
  _id: string;
  title: string;
  name: string;
  weight: number;
  content?: string;
  weather?: string;
  price?: number;
  color?: string;
}

const DashboardPage = () => {
  const [user, setUser] = useState<User>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
const [editForm, seteditForm] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    weight: '',
    weather: '',
    price: '',
    color: ''
  });

  const userId = Cookies.get('user_id');
  useEffect(() => {
    const fetchUserAndPosts = async () => {
      if (!userId) {
        setError('User ID not found in cookies');
        setLoading(false);
        return;
      }
      try {
        const userRes = await fetch(`/api/profile?id=${userId}`);
        if (!userRes.ok) throw new Error('Failed to fetch user');
        const userData = await userRes.json();
        setUser(userData);
        
        const postRes = await fetch(`/api/post?user=${userId}`);
        if (!postRes.ok) throw new Error('Failed to fetch posts');
        const postData = await postRes.json();
        setPosts(postData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndPosts();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!userId) {
      alert('User ID not found');
      return;
    }
    const postPayload = {
      userId: userId,
      ...formData,
      weight: parseFloat(formData.weight),
      price: parseFloat(formData.price)
    };
    try {
      const res = await fetch('/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postPayload)
      });
      if (!res.ok) throw new Error('Failed to add post');
      toast.success('Post added successfully!');
      setShowForm(false)
      const newPost = await res.json();
      setPosts(prev => [...prev, newPost]);
      setFormData({ id: '', name: '', weight: '', weather: '', price: '', color: '' });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEdit = (post: Post) => {
    setFormData({
      id: post._id,
      name: post.name,
      weight: post.weight.toString(),
      weather: post.weather || '',
      price: post.price?.toString() || '',
      color: post.color || ''
    });
  };
  
  const handleDelete = async (_id: string) => {
    try {
      const res = await fetch(`/api/post`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('auth_token')}`, // Optional: Include token if required
        },
        body: JSON.stringify({ _id }),
      });

      if (!res.ok) throw new Error('Failed to delete post');

      toast.success('Post deleted successfully!');
      setPosts(posts.filter(post => post._id !== _id));
    } catch (err: any) {
      console.error(err);
      toast.error('An error occurred while deleting the post');
    }
  };
  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Dashboard Header */}
      <div className="bg-white p-4 rounded shadow w-full max-w-4xl mx-auto mb-6 flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user?.name} 👋</h1>
          <p className="text-sm text-gray-600">Email: {user?.email}</p>
          <p className="text-sm text-gray-600">Phone: {user?.phonenumber}</p>
        </div>
        <button
          onClick={() => setShowForm(prev => !prev)}
          className="mt-4 md:mt-0 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {showForm ? "Close Form" : "Add Post"}
        </button>
      </div>
  
      {/* Add/Edit Post Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <h2 className="text-xl font-semibold mb-4">Add/Edit Post</h2>
            <div
              onClick={() => setShowForm(false)}
              className="absolute top-3 cursor-pointer right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </div>

            <div className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Post Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="weight"
                placeholder="Weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="weather"
                placeholder="Weather"
                value={formData.weather}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="color"
                placeholder="Color"
                value={formData.color}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
              >
                Submit Post
              </button>
            </div>
          </div>
        </div>
      )}
      {editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <h2 className="text-xl font-semibold mb-4">Add/Edit Post</h2>
            <div
              onClick={() => seteditForm(false)}
              className="absolute top-3 cursor-pointer right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </div>

            <div className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Post Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="weight"
                placeholder="Weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="weather"
                placeholder="Weather"
                value={formData.weather}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="color"
                placeholder="Color"
                value={formData.color}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
              >
                Submit Post
              </button>
            </div>
          </div>
        </div>
      )}
  
      {/* Posts List */}
      <div className="bg-white p-4 rounded shadow w-full max-w-2xl mx-auto space-y-4">
        <h2 className="text-xl font-semibold mb-2">Your Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-600">No posts found.</p>
        ) : (
          posts.map((post: Post) => (
            <div key={post._id} className="border p-3 rounded bg-gray-50 flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">{post.name}</h3>
                <p className="text-sm text-gray-700">Weight: {post.weight}</p>
                <p className="text-sm text-gray-700">Weather: {post.weather}</p>
                <p className="text-sm text-gray-700">Price: {post.price}</p>
                <p className="text-sm text-gray-700">Color: {post.color}</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() =>{
                  seteditForm(true)
                  handleEdit(post)}} className="text-blue-600">
                  <FaEdit />
                </button>
                <button
                  onClick={() => {
                    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
                    if (confirmDelete) {
                      handleDelete(post._id);
                    }
                  }}
                  className="text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardPage;