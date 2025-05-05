import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { spacesService } from '../services/spacesService'
import { testimonialsService } from '../services/testimonialsService'
import './Home.css'

function Home() {
  const [featuredSpaces, setFeaturedSpaces] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured spaces (first page, available only)
        const spacesData = await spacesService.getSpaces(1, 3, 'available')
        setFeaturedSpaces(spacesData)
        
        // Fetch testimonials
        const testimonialsData = await testimonialsService.getTestimonials()
        setTestimonials(testimonialsData.slice(0, 3)) // Take only the first 3
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  // Define how it works steps
  const howItWorksSteps = [
    {
      id: 1,
      icon: '👤',
      title: 'Register Account',
      description: 'Create your account to get started'
    },
    {
      id: 2,
      icon: '🔍',
      title: 'Browse Spaces',
      description: 'Find the perfect space for your needs'
    },
    {
      id: 3,
      icon: '📅',
      title: 'Book a Space',
      description: 'Reserve the space for your desired time'
    },
    {
      id: 4,
      icon: '🎉',
      title: 'Enjoy the Space',
      description: 'Show up and enjoy your booked space'
    }
  ]
  
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
        duration: 0.5
      }
    }
  }
  
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Find Your Perfect Space
            </motion.h1>
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Book work, event, and leisure spaces with ease
            </motion.p>
            <motion.div 
              className="hero-buttons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link to="/spaces" className="btn btn-primary btn-large">
                Browse Spaces
              </Link>
              <Link to="/register" className="btn btn-outline btn-large">
                Sign Up Free
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Featured Spaces Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Spaces</h2>
            <p className="section-subtitle">Discover our most popular spaces</p>
          </div>
          
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <motion.div 
              className="featured-spaces"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {featuredSpaces.length > 0 ? (
                featuredSpaces.map((space) => (
                  <motion.div 
                    key={space.id} 
                    className="space-card"
                    variants={itemVariants}
                  >
                    <div className="space-image">
                      <img 
                        src={`https://images.pexels.com/photos/${1000 + space.id}/pexels-photo-${1000 + space.id}.jpeg?auto=compress&cs=tinysrgb&w=600`} 
                        alt={space.name} 
                      />
                    </div>
                    <div className="space-details">
                      <h3 className="space-name">{space.name}</h3>
                      <p className="space-price">${space.price_per_hour}/hour</p>
                      <Link to={`/spaces/${space.id}`} className="btn btn-secondary btn-small">
                        View Details
                      </Link>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="no-results">No spaces available at the moment.</p>
              )}
            </motion.div>
          )}
          
          <div className="view-all">
            <Link to="/spaces" className="view-all-link">
              View All Spaces <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Simple steps to book your space</p>
          </div>
          
          <motion.div 
            className="steps-container"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {howItWorksSteps.map((step) => (
              <motion.div 
                key={step.id} 
                className="step"
                variants={itemVariants}
              >
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Users Say</h2>
            <p className="section-subtitle">Read testimonials from our customers</p>
          </div>
          
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <motion.div 
              className="testimonials-container"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
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
                      <h4 className="author-name">{testimonial.user_name}</h4>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="no-results">No testimonials available.</p>
              )}
            </motion.div>
          )}
          
          <div className="view-all">
            <Link to="/testimonials" className="view-all-link">
              View All Testimonials <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Find Your Space?</h2>
            <p className="cta-text">Join Spacer today and discover the perfect space for your needs</p>
            <Link to="/register" className="btn btn-primary btn-large">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home