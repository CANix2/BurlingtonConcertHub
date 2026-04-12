import React, {useState, type FormEvent, type ChangeEvent} from 'react';

interface VenueFormData {
    venue: string;
}

interface FormErrors {
    venue?: string;
    general?: string;
  }

const NewVenue: React.FC = () => {
    const [formData, setFormData] = useState<VenueFormData>({ venue: ''});
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

    if (!formData.venue.trim()) {
      newErrors.venue = 'Venue Name is required';
    } else if (formData.venue.length > 100) {
      newErrors.venue = 'Venue Name must be less than 100 characters';
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
        const response = await fetch('http://localhost:3001/api/venues', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
           },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error || 'Failed to add venue.');
        }
  
        const data = await response.json();
        console.log('server response:', data);
  
        setSubmitSuccess(true);
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            venue: ''
          });
          setSubmitSuccess(false);
        }, 3000);
        
      } catch (error) {
        console.error('Error adding venue:', error);
        setErrors({
          general: 'Failed to add venue. Please try again.'
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
        <div className="new-post-container">
          <div className="new-post-header">
            <h2>Add New Venue</h2>
            <p className="subTitle">Add a venue to the Vermont Concert Hub</p>
          </div>
        { /* New Venue Field */}
          <form onSubmit={handleSubmit} className="new-post-form">
            <div className="form-group">
              <label htmlFor="venue">
                Venue Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                placeholder="Enter venue name"
                className={errors.venue ? 'error' : ''}
                disabled={isSubmitting}
                maxLength={100}
              />
              {errors.venue && <span className="error-text">{errors.venue}</span>}
              <span className="character-count">{formData.venue.length}/100</span>
            </div>
    
            {submitSuccess && (
              <div className="success-message">
                <span className="success-icon">✓</span>
                <p>Venue added successfully!</p>
              </div>
            )}
            {errors.general && (
              <div className="error-message">
                <span className="error-icon">⚠</span>
                <p>{errors.general}</p>
              </div>
            )}
    
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => window.history.back()} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? (<><span className="spinner"></span>Adding...</>) : 'Add Venue'}
              </button>
            </div>
          </form>
        </div>
      );
};

export default NewVenue;