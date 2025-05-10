import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client', // Changed to lowercase to match backend
    phoneNumber: '',
    businessName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('All fields are required');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.role === 'owner' && !formData.phoneNumber) { // Updated role check
      setError('Phone number is required for space owners');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      // Format the data according to backend expectations
      const registrationData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email.toLowerCase(),
        password: formData.password,
        role: formData.role.toLowerCase(), // Convert to lowercase to match backend expectations
        phone_number: formData.phoneNumber || null,
        business_name: formData.role === 'SPACE_OWNER' ? 
          (formData.businessName || `${formData.firstName}'s Business`) : null
      };

      console.log('Sending registration data:', registrationData); // Debug log
      await register(registrationData);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Create Account</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            required
            minLength={6}
          />
          <small>Password must be at least 6 characters long</small>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password *</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Register as *</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={loading}
            required
          >
            <option value="client">Client</option>
            <option value="owner">Space Owner</option>
          </select>
        </div>

        {formData.role === 'owner' && ( // Updated role check
          <>
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number *</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="e.g., 254712345678"
                disabled={loading}
                required
              />
            </div>
            {/* ... rest of space owner fields ... */}
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default Register;
