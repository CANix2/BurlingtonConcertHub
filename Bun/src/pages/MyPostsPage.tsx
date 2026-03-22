// pages/NewPost.tsx
import React, { useState, type FormEvent, type ChangeEvent } from 'react';
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

// Subcomponents?

const MyPostsPage: React.FC = () => {
  // Initial form state
  const [posts, setPosts] = useState<PostData[]>(MOCK_POSTS);
  const [errors, setErrors] = useState<FormErrors>({});


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
            <PostHolder key={post.id} post={post} />
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