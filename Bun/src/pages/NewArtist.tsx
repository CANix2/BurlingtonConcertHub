import React, {useState, type FormEvent, type ChangeEvent} from 'react';

interface ArtistFormData {
    artist: string;
}

interface FormErrors {
    artist?: string;
    general?: string;
  }

const NewArtist: React.FC = () => {
    const [formData, setFormData] = useState<ArtistFormData>({ artist: ''});
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    
    // Handle input changes
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };  
    // Validate form
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.artist.trim()) {
        newErrors.artist = 'Artist Name is required';
        } else if (formData.artist.length > 100) {
        newErrors.artist = 'Artist Name must be less than 100 characters';
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
        const response = await fetch('http://localhost:3001/api/artists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
           },
          body: JSON.stringify(formData),
        });
        
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to add artist.');
        }
  
        console.log('server response:', data);
  
        setSubmitSuccess(true);
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            artist: ''
          });
          setSubmitSuccess(false);
        }, 3000);
        
      } catch (error) {
        console.error('Error adding artist:', error);
        setErrors({
          general: 'Failed to add artist. Please try again.'
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
        <div className="new-post-container">
          <div className="new-post-header">
            <h2>Add New Artist</h2>
            <p className="subTitle">Add an artist to the Vermont Concert Hub</p>
          </div>
        
        {/* New Artist's Name */}
          <form onSubmit={handleSubmit} className="new-post-form">
            <div className="form-group">
              <label htmlFor="artist">
                Artist Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="artist"
                name="artist"
                value={formData.artist}
                onChange={handleInputChange}
                placeholder="Enter artist name"
                className={errors.artist ? 'error' : ''}
                disabled={isSubmitting}
                maxLength={100}
              />
              {errors.artist && <span className="error-text">{errors.artist}</span>}
              <span className="character-count">{formData.artist.length}/100</span>
            </div>
            {/* Success & Error messages */}
            {submitSuccess && (
              <div className="success-message">
                <span className="success-icon">✓</span>
                <p>Artist added successfully!</p>
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
              <button type="button" className="cancel-btn" onClick={() => window.history.back()} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? (<><span className="spinner"></span>Adding...</>) : 'Add Artist'}
              </button>
            </div>
          </form>
        </div>
      );
};

export default NewArtist;