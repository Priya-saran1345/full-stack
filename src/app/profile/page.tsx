
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import React, { useEffect, useState } from 'react'
import Cookies from "js-cookie"

interface User {
  id: number
  name: string
  email: string
  phonenumber: number
  age: number
  bio: string
  createdAt: string
}

interface Post {
  _id: string
  title: string
  content: string
  createdAt: string
  // Add more fields if needed
}

const DashboardPage = () => {
  const [user, setUser] = useState<User>()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      const userId = Cookies.get('user_id')
      console.log("userId ***************", userId)

      if (!userId) {
        setError('User ID not found in cookies')
        setLoading(false)
        return
      }

      try {
        // Fetch user data
        const userRes = await fetch(`/api/profile?id=${userId}`)
        if (!userRes.ok) throw new Error('Failed to fetch user')
        const userData = await userRes.json()
        setUser(userData)

        // Fetch posts
        const postRes = await fetch(`/api/post?user=${userId}`)
        if (!postRes.ok) throw new Error('Failed to fetch posts')
        const postData = await postRes.json()
        setPosts(postData)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndPosts()
  }, [])

  if (loading) return <div>Loading dashboard...</div>
  if (error) return <div>Error: {error}</div>
console.log('post data is ',posts)
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      {/* User Info */}
      <div className="bg-white p-4 rounded shadow w-full max-w-md mb-6 space-y-2">
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Phone: </strong> {user?.phonenumber}</p>
        <p><strong>Age:</strong> {user?.age}</p>
        <p><strong>Bio:</strong> {user?.bio}</p>
      </div>
      {/* User Posts */}
      <div className="bg-white p-4 rounded shadow w-full max-w-2xl space-y-4">
        <h2 className="text-xl font-semibold mb-2">Your Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-600">No posts found.</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="border p-3 rounded bg-gray-50">
              <h3 className="text-lg font-bold">{post.title}</h3>
              <p className="text-sm text-gray-700">{post.content}</p>
              <p className="text-xs text-gray-400 mt-1">
                Posted on {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DashboardPage
