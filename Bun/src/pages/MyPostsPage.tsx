// pages/MyPostsPage.tsx
import React, { useState, useEffect } from 'react';
import type { PostData } from '../types';
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
  const [posts, setPosts] = useState<PostData[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<PostData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
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
        setErrors({ general: 'Failed to load posts. Please try again.' });
        setLoading(false);
      });
  };

  const handleDelete = async (postId: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:3001/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete post');
      }

      // Remove post from state
      setPosts(posts.filter(post => post.id !== postId));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Error deleting post:', err);
      setErrors({ general: 'Failed to delete post. Please try again.' });
    }
  };

  const handleEdit = (post: PostData) => {
    setEditingPost(post);
  };

  const handleUpdatePost = async (updatedPost: PostData) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:3001/api/posts/${updatedPost.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          artist_name: updatedPost.artist_name,
          venue: updatedPost.venue,
          rating: updatedPost.rating,
          content: updatedPost.content
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update post');
      }

      // Update post in state
      setPosts(posts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      ));
      setEditingPost(null);
    } catch (err) {
      console.error('Error updating post:', err);
      setErrors({ general: 'Failed to update post. Please try again.' });
    }
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  const hasPosts = posts.length > 0;

  if (loading) {
    return (
      <div className="my-posts-container">
        <div className="loading-state">Loading your posts...</div>
      </div>
    );
  }

  return (
    <div className="my-posts-container">
      {/* Header */}
      <div className="my-posts-header">
        <h2 className="text-3xl mb-1">My Posts</h2>
        <p className="subTitle">Your Vermont concert experiences</p>
      </div>

      {/* Error display */}
      {errors.general && (
        <div className="error-message">
          <span className="error-icon">⚠</span>
          <p>{errors.general}</p>
        </div>
      )}

      {/* Edit Modal/Form */}
      {editingPost && (
        <EditPostForm
          post={editingPost}
          onSave={handleUpdatePost}
          onCancel={handleCancelEdit}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <DeleteConfirmModal
          onConfirm={() => handleDelete(deleteConfirmId)}
          onCancel={() => setDeleteConfirmId(null)}
        />
      )}

      {/* Posts List */}
      {hasPosts ? (
        <div className="posts-list">
          {posts.map(post => (
            <div key={post.id} className="post-item-wrapper">
              <h3>{post.artist_name}</h3>
              {post.venue && <p className="venue">{post.venue}</p>}
                            <p className="rating">
                                {'★'.repeat(post.rating)}{'☆'.repeat(5 - post.rating)}
                            </p>
                            {post.content && <p className="content">{post.content}</p>}
                            <p className="created-at">
                                {new Date(post.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
              </p>
              <div className="post-actions">
                <button 
                  className="edit-btn"
                  onClick={() => handleEdit(post)}
                  aria-label="Edit post"
                >
                  <span className="btn-icon">✎</span>
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => setDeleteConfirmId(post.id)}
                  aria-label="Delete post"
                >
                  <span className="btn-icon">🗑</span>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No posts yet.</p>
          <a href="/new-post" className="create-post-link">Create your first post</a>
        </div>
      )}
    </div>
  );
};

// Edit Post Form Component
interface EditPostFormProps {
  post: PostData;
  onSave: (post: PostData) => void;
  onCancel: () => void;
}

const EditPostForm: React.FC<EditPostFormProps> = ({ post, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    artist_name: post.artist_name || '',
    venue: post.venue || 'higher_ground',
    rating: post.rating || 0,
    content: post.content || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const VENUES = [
    { value: 'higher_ground', label: 'Higher Ground' },
    { value: 'radio_bean', label: 'Radio Bean' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updatedPost = {
      ...post,
      artist_name: formData.artist_name,
      venue: formData.venue,
      rating: formData.rating,
      content: formData.content
    };

    await onSave(updatedPost);
    setIsSubmitting(false);
  };

  return (
    <div className="modal-overlay">
      <div className="edit-modal">
        <div className="modal-header">
          <h3 className="text-2xl ">Edit Post</h3>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="artist_name">Artist Name *</label>
            <input
              type="text"
              id="artist_name"
              name="artist_name"
              value={formData.artist_name}
              onChange={handleChange}
              required
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="venue">Venue *</label>
            <select
              id="venue"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              required
            >
              {VENUES.map(ven => (
                <option key={ven.value} value={ven.value}>
                  {ven.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Rating *</label>
            <div className="rating-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${formData.rating >= star ? 'active' : ''}`}
                  onClick={() => handleRatingChange(star)}
                >
                  ★
                </button>
              ))}
              <span className="rating-label">
                {formData.rating > 0 ? `${formData.rating}/5` : 'Rate your experience'}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="content">Content (Optional)</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Share your experience, thoughts, and memories..."
              rows={6}
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="cursor-pointer rounded-xl bg-green-600 min-w-24 text-blue-50 font-semibold transition duration-300 hover:bg-green-400 hover:text-stone-700" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Confirmation Modal Component
interface DeleteConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="confirm-modal">
        <div className="modal-header">
          <h3>Delete Post</h3>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete this post? This action cannot be undone.</p>
        </div>
        <div className="modal-actions">
          <button onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
          <button onClick={onConfirm} className="cursor-pointer rounded-xl bg-red-600 min-w-28 text-blue-50 font-semibold transition duration-300 hover:bg-red-400 hover:text-stone-700">
            Delete Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPostsPage;