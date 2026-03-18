// pages/NewPost.tsx
import React, { useState, FormEvent, ChangeEvent } from 'react';
import './NewPost.css';

// Define types
interface PostFormData {
  artistName: string;
  content: string;
  venue?: string;
  artist?: string;
  concertDate?: string;
  rating: number;
  image?: File | null;
  tags: string[];
}

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

const NewPost: React.FC = () => {
  // Initial form state
  const [formData, setFormData] = useState<PostFormData>({
    artistName: '',
    content: '',
    venue: '',
    artist: '',
    concertDate: '',
    rating: 0,
    tags: []
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState<string>('');

  // VENUES
  const VENUES = [
    {value: 'higher_ground', label: 'Higher Ground'},
    {value: 'radio_bean', label: 'Radio Bean'},
  ];

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

  // Handle tags
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.artistName.trim()) {
      newErrors.artistName = 'Artist Name is required';
    } else if (formData.artistName.length > 100) {
      newErrors.artistName = 'Artist Name must be less than 100 characters';
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

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Post submitted:', formData);
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          artistName: '',
          content: '',
          venue: '',
          artist: '',
          concertDate: '',
          rating: 0,
          tags: []
        });
        setImagePreview(null);
        setSubmitSuccess(false);
      }, 3000);
      
    } catch (error) {
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

      <form onSubmit={handleSubmit} className="new-post-form">

        {/* Artist Name Field */}
        <div className="form-group">
          <label htmlFor="artistName">
            Artist Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="artistName"
            name="artistName"
            value={formData.artistName}
            onChange={handleInputChange}
            placeholder="Enter artist name"
            className={errors.artistName ? 'error' : ''}
            disabled={isSubmitting}
            maxLength={100}
          />
          {errors.artistName && <span className="error-text">{errors.artistName}</span>}
          <span className="character-count">
            {formData.artistName.length}/100
          </span>
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
            {VENUES.map(ven => (
              <option key={ven.value} value={ven.value}>
                {ven.label}
              </option>
            ))}
          </select>
          {errors.venue && <span className="error-text">{errors.venue}</span>}
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

        {/* Tags */}
        <div className="form-group">
          <label htmlFor="tags">Tags (Optional)</label>
          <div className="tags-input-container">
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleTagKeyPress}
              placeholder="Add tags and press Enter"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="add-tag-btn"
              disabled={isSubmitting || !tagInput.trim()}
            >
              Add Tag
            </button>
          </div>
          <div className="tags-container">
            {formData.tags.map(tag => (
              <span key={tag} className="tag">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="remove-tag"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

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