import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { spacesService } from '../services/spacesService'
import { bookingsService } from '../services/bookingsService'
import { useAuth } from '../context/AuthContext'
import './SpaceDetails.css'

function SpaceDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  
  const [space, setSpace] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date(new Date().setHours(new Date().getHours() + 2)))
  const [totalHours, setTotalHours] = useState(2)
  const [totalCost, setTotalCost] = useState(0)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [bookingError, setBookingError] = useState(null)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  
  // Fetch space details
  useEffect(() => {
    const fetchSpaceDetails = async () => {
      try {
        setLoading(true)
        const data = await spacesService.getSpaceById(id)
        // Defensive: ensure images array exists
        if (!data.images) {
          data.images = []
        }
        setSpace(data)
      } catch (err) {
        setError('Failed to fetch space details')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchSpaceDetails()
  }, [id])
  
  // Add useEffect to refresh space details after image upload or other changes
  useEffect(() => {
    if (space) {
      const interval = setInterval(async () => {
        try {
          const updatedSpace = await spacesService.getSpaceById(id)
          if (JSON.stringify(updatedSpace.images) !== JSON.stringify(space.images)) {
            setSpace(updatedSpace)
          }
        } catch (err) {
          console.error('Failed to refresh space images:', err)
        }
      }, 5000) // Refresh every 5 seconds

      return () => clearInterval(interval)
    }
  }, [space, id])
  
  // Calculate total hours and cost when dates change
  useEffect(() => {
    if (startDate && endDate && space) {
      const diffMs = endDate - startDate
      const diffHours = diffMs / (1000 * 60 * 60)
      setTotalHours(diffHours)
      setTotalCost(diffHours * space.price_per_hour)
    }
  }, [startDate, endDate, space])
  
  const handleStartDateChange = (date) => {
    setStartDate(date)
    // Ensure end date is after start date
    if (date >= endDate) {
      setEndDate(new Date(date.getTime() + 2 * 60 * 60 * 1000)) // Start date + 2 hours
    }
  }
  
  const handleEndDateChange = (date) => {
    if (date > startDate) {
      setEndDate(date)
    }
  }
  
  const handleBookSpace = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setBookingError(null)
    setIsBooking(true)

    try {
      // Prepare booking data
      const bookingData = {
        space_id: parseInt(id),
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        phone_number: phoneNumber // For M-Pesa payment
      }

      // Call booking service
      const response = await bookingsService.createBooking(bookingData)
      setBookingSuccess(true)
      console.log('Booking response:', response)

      // In a real app, handle payment response and redirect to payment status page
    } catch (err) {
      setBookingError(err.message || 'Failed to book space')
      console.error(err)
    } finally {
      setIsBooking(false)
    }
  }

  const handleImageUpload = async (event) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    const file = event.target.files[0]
    if (!file) return

    try {
      // Use updated spacesService to upload image
      await spacesService.uploadSpaceImage(parseInt(id), file, true)
      // Refresh space details to show new image
      const updatedSpace = await spacesService.getSpaceById(id)
      setSpace(updatedSpace)
    } catch (error) {
      console.error('Image upload failed:', error)
    }
  }
  
  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    )
  }
  
  if (error || !space) {
    return (
      <div className="container">
        <div className="error-message">
          {error || 'Space not found'}
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-details-page">
      <div className="container">
        <motion.div 
          className="space-details-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-details-image">
            {space.images && space.images.length > 0 ? (
              <img
                src={space.images[0].url}
                alt={space.name}
              />
            ) : (
              <img 
                src={`https://images.pexels.com/photos/${1000 + parseInt(id)}/pexels-photo-${1000 + parseInt(id)}.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`} 
                alt={space.name} 
              />
            )}
            <div className="space-status">{space.status}</div>
          </div>
          
          <div className="space-details-content">
            <div className="space-details-header">
              <h1 className="space-name">{space.name}</h1>
              <div className="space-price">${space.price_per_hour}/hour</div>
            </div>

            <div className="space-details-description">
              <p>This beautiful space is perfect for your needs. Spacious, well-lit, and conveniently located.</p>
              <p>Book now to secure your spot!</p>
            </div>

            <div className="form-group">
              <label htmlFor="imageUpload" className="form-label">Upload Image</label>
              <input
                type="file"
                id="imageUpload"
                className="form-input"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            {space.status === 'AVAILABLE' && (
              <div className="booking-form">
                <h2 className="booking-form-title">Book This Space</h2>

                {bookingSuccess ? (
                  <div className="booking-success">
                    <h3>Booking Successful!</h3>
                    <p>Your booking has been confirmed. Check your email for details.</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate('/bookings')}
                    >
                      View My Bookings
                    </button>
                  </div>
                ) : (
                  <>
                    {bookingError && (
                      <div className="booking-error">
                        {bookingError}
                      </div>
                    )}

                    <div className="form-group">
                      <label htmlFor="startDate" className="form-label">Start Date & Time</label>
                      <DatePicker
                        selected={startDate}
                        onChange={handleStartDateChange}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={30}
                        timeCaption="Time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        minDate={new Date()}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="endDate" className="form-label">End Date & Time</label>
                      <DatePicker
                        selected={endDate}
                        onChange={handleEndDateChange}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={30}
                        timeCaption="Time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        minDate={startDate}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phoneNumber" className="form-label">Phone Number (for payment)</label>
                      <input
                        type="text"
                        id="phoneNumber"
                        className="form-input"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter phone number e.g. 254712345678"
                      />
                    </div>

                    <div className="booking-summary">
                      <div className="summary-row">
                        <span>Total Hours:</span>
                        <span>{totalHours.toFixed(1)} hours</span>
                      </div>
                      <div className="summary-row total">
                        <span>Total Cost:</span>
                        <span>${totalCost.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      className={`btn btn-primary btn-block ${isBooking ? 'btn-disabled' : ''}`}
                      onClick={handleBookSpace}
                      disabled={isBooking || !phoneNumber}
                    >
                      {isBooking ? 'Processing...' : 'Book Now'}
                    </button>
                  </>
                )}
              </div>
            )}

            {space.status !== 'AVAILABLE' && (
              <div className="space-unavailable">
                <p>This space is currently unavailable for booking.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/spaces')}
                >
                  Browse Other Spaces
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SpaceDetails
