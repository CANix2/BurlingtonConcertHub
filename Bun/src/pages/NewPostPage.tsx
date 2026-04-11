// pages/NewPost.tsx
import React, { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import './NewPost.css';

// Define types
interface PostFormData {
  artist_name: string;
  content: string;
  venue: string;
  rating: number;
}

// what can cause errors
interface FormErrors {
  artist_name?: string;
  content?: string;
  venue?: string;
  rating?: number;
  general?: string;
}

interface ArtistOption {
  id: number;
  artist: string;
}

interface VenueOption {
  id: number;
  venue: string;
}

const NewPost: React.FC = () => {
  // Initial form state
  const [formData, setFormData] = useState<PostFormData>({
    artist_name: '',
    venue: 'higher_ground',
    rating: 0,
    content: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const [artists, setArtists] = useState<ArtistOption[]>([]);
  const [venues, setVenues] = useState<VenueOption[]>([]);  

  useEffect(() => {
    fetch('http://localhost:3001/api/artists')
      .then(res => res.json())
      .then(data => {
        console.log('artists data:', data);
        setArtists(Array.isArray(data) ? data : []);
      })
      .catch(() => console.error('Failed to fetch artists'));
  
    fetch('http://localhost:3001/api/venues')
      .then(res => res.json())
      .then(data => {
        console.log('venues data:', data);
        setVenues(Array.isArray(data) ? data : []);
      })
      .catch(() => console.error('Failed to fetch venues'));
  }, []);

  // Handle input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Handle rating change
  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.artist_name.trim()) {
      newErrors.artist_name = 'Artist Name is required';
    } else if (formData.artist_name.length > 100) {
      newErrors.artist_name = 'Artist Name must be less than 100 characters';
    }

    if (formData.rating < 1) {
        newErrors.rating = 1;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    // NOTE: IP is stored as "proxy" in package.json
    try {
      const response = await fetch('http://localhost:3001/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
         },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Failed to create post.');
      }

      const data = await response.json();
      console.log('server response:', data);

      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          artist_name: '',
          venue: '',
          rating: 0,
          content: '',
          
        });
        setSubmitSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error creating post:', error);
      setErrors({
        general: 'Failed to create post. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render rating stars
  const renderRatingStars = () => {
    return (
      <div className="rating-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star-btn ${formData.rating >= star ? 'active' : ''}`}
            onClick={() => handleRatingChange(star)}
            disabled={isSubmitting}
          >
            ★
          </button>
        ))}
        <span className="rating-label">
          {formData.rating > 0 ? `${formData.rating}/5` : 'Rate your experience'}
        </span>
      </div>
    );
  };

  return (
    <div className="new-post-container">
      <div className="new-post-header">
        <h2>Create New Post</h2>
        <p className="subTitle">Share your Vermont concert experience with the community</p>
      </div>

      <form onSubmit={handleSubmit} className="new-post-form">

        {/* Artist Name Field */}
        <div className="form-group">
          <label htmlFor="artist_name">
            Artist Name <span className="required">*</span>
          </label>
          <select
            id="artist_name"
            name="artist_name"
            value={formData.artist_name}
            onChange={handleInputChange}
            className={errors.artist_name ? 'error' : ''}
            disabled={isSubmitting}
          >
            <option value="">— Select an artist —</option>
            {artists.map(a => (
              <option key={a.id} value={a.artist}>{a.artist}</option>
            ))}
          </select> 
          {errors.artist_name && <span className="error-text">{errors.artist_name}</span>}
          <p className="add-new-text">
            Don't see your artist? <Link to="/new-artist">Click here to add</Link>
          </p>
        </div>

        {/* Venue Field */}
        <div className="form-group">
          <label htmlFor="venue">
            Venue <span className="required">*</span>
          </label>
          <select
            id="venue"
            name="venue"
            value={formData.venue}
            onChange={handleInputChange}
            className={errors.venue ? 'error' : ''}
            disabled={isSubmitting}
          >
            <option value="">- Select a venue -</option>
            {venues.map(v => (
              <option key={v.id} value={v.venue}>
                {v.venue}
              </option>
            ))}
          </select>
          {errors.venue && <span className="error-text">{errors.venue}</span>}
          <p className="add-new-text">
            Don't see your venue? <Link to="/new-venue">Click here to add</Link>
          </p>
        </div>

        {/* Rating Field */}
        <div className="form-group">
          <label>
            Rating <span className="required">*</span>
            </label>
          {renderRatingStars()}
        </div>

        {/* Content Field */}
        <div className="form-group">
          <label htmlFor="content">
            Content (Optional)
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Share your experience, thoughts, and memories..."
            rows={8}
            className={errors.content ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.content && <span className="error-text">{errors.content}</span>}
          <span className="character-count">
            {formData.content.length} characters
          </span>
        </div>

        {/* Success & Error messages */}
        {submitSuccess && (
        <div className="success-message">
          <span className="success-icon">✓</span>
          <p>Post created successfully!</p>
        </div>
      )}
        {errors.general && (
        <div className="error-message">
          <span className="error-icon">⚠</span>
          <p>{errors.general}</p>
        </div>
      )}

        {/* Submit Button */}
        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => window.history.back()}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Creating Post...
              </>
            ) : (
              'Create Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPost;