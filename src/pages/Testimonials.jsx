import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { testimonialsService } from '../services/testimonialsService'
import { useAuth } from '../context/AuthContext'
import './Testimonials.css'

function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const { isAuthenticated } = useAuth()
  
  // Form state
  const [userName, setUserName] = useState('')
  const [content, setContent] = useState('')
  const [formErrors, setFormErrors] = useState({})
  
  // Fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true)
        const data = await testimonialsService.getTestimonials()
        setTestimonials(data)
      } catch (err) {
        setError('Failed to fetch testimonials')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTestimonials()
  }, [])
  
  // Validate form
  const validateForm = () => {
    const errors = {}
    
    if (!userName.trim()) {
      errors.userName = 'Name is required'
    }
    
    if (!content.trim()) {
      errors.content = 'Testimonial content is required'
    } else if (content.length < 20) {
      errors.content = 'Testimonial must be at least 20 characters'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setSubmitting(true)
    setSuccessMessage('')
    
    try {
      await testimonialsService.addTestimonial({
        user_name: userName,
        content
      })
      
      setSuccessMessage('Your testimonial has been submitted successfully!')
      setUserName('')
      setContent('')
      
      // Refetch testimonials to include the new one
      const data = await testimonialsService.getTestimonials()
      setTestimonials(data)
    } catch (err) {
      setError('Failed to submit testimonial')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4
      }
    }
  }
  
  return (
    <div className="testimonials-page">
      <div className="container">
        <div className="testimonials-header">
          <h1 className="testimonials-title">User Testimonials</h1>
          <p className="testimonials-subtitle">See what our users have to say about their experiences</p>
        </div>
        
        {/* Add Testimonial Form */}
        <motion.div 
          className="testimonial-form-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="form-title">Share Your Experience</h2>
          
          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <form className="testimonial-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="userName" className="form-label">Your Name</label>
              <input
                type="text"
                id="userName"
                className={`form-input ${formErrors.userName ? 'error' : ''}`}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
              />
              {formErrors.userName && (
                <span className="form-error">{formErrors.userName}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="content" className="form-label">Your Testimonial</label>
              <textarea
                id="content"
                className={`form-input ${formErrors.content ? 'error' : ''}`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your experience with Spacer..."
                rows={5}
              ></textarea>
              {formErrors.content && (
                <span className="form-error">{formErrors.content}</span>
              )}
            </div>
            
            <button 
              type="submit" 
              className={`btn btn-primary ${submitting ? 'btn-disabled' : ''}`}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Testimonial'}
            </button>
          </form>
        </motion.div>
        
        {/* Testimonials List */}
        <div className="testimonials-section">
          <h2 className="section-title">What Our Users Say</h2>
          
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <motion.div 
              className="testimonials-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {testimonials.length > 0 ? (
                testimonials.map((testimonial) => (
                  <motion.div 
                    key={testimonial.id} 
                    className="testimonial-card"
                    variants={itemVariants}
                  >
                    <div className="quote-icon">"</div>
                    <p className="testimonial-content">{testimonial.content}</p>
                    <div className="testimonial-author">
                      <div className="author-avatar">
                        {testimonial.user_name.charAt(0)}
                      </div>
                      <div className="author-info">
                        <h4 className="author-name">{testimonial.user_name}</h4>
                        <p className="testimonial-date">
                          {new Date(testimonial.created_at || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="no-testimonials">
                  <p>No testimonials yet. Be the first to share your experience!</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Testimonials