// pages/NewPost.tsx
import React, { useState, type FormEvent, type ChangeEvent, useEffect } from 'react';
import type { PostData } from '../types';
import { MOCK_POSTS } from '../data/MockPosts.tsx';

import './MyPosts.css';
import PostHolder from './PostHolder.tsx';



// what can cause errors
interface FormErrors {
  artistName?: string;
  content?: string;
  venue?: string;
  artist?: string;
  concertDate?: string;
  rating?: number;
  general?: string;
}


interface Props {
  currentUser: { name: string; email: string } | null;
}


const MyPostsPage: React.FC<Props> = ({ currentUser }) => {
  // Initial form state
  const [posts, setPosts] = useState<PostData[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // if no token, skip fetching
    if (!token) {
      setLoading(false);
      return;
    }

    fetch('http://localhost:3001/api/my-posts', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

    // for liking a post
  const handleLike = (id: string) => {
    setPosts(prev =>
      prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p)
    );
  };
  if (!currentUser) return <p>You must be logged in to view your posts.</p>;
  if (loading) return <p>Loading...</p>;

  const hasPosts = posts.length > 0;

  


  return (

    <div className="my-posts-container">
      {/* Header */}
      <div className="my-posts-header">
        <h2>My Posts</h2>
        <p className="subTitle">Your Vermont concert experiences</p>
      </div>
      {/* Controls (for later maybe?) */}

      {/* Posts List */}
      {hasPosts ? (
        <div className="posts-list">
          {posts.map(post => (
            <PostHolder key={post.id} post={post} onLike={handleLike} />
            
            // <div key={post.id}>{post.artistName}</div> // placeholder until PostCard exists
          ))}
        </div>
      ) : (
        // <EmptyState />
        <p>No posts yet.</p> // placeholder until EmptyState exists
      )}

    </div>
  );
};


export default MyPostsPage;