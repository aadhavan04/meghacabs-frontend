import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Register({ onSwitch }) {
  const { login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

const handleSubmit = async () => {
  if (!form.name || !form.email || !form.phone || !form.password)
    return setError('All fields required!')

  setLoading(true)
  try {
    await axios.post("https://meghacabs-backend.onrender.com/api/auth/register", form)
    
 
    alert('Registration successful! Please login to continue.')
    onSwitch()   // login page ku pogum
    
  } catch (err) {
    setError(err.response?.data?.msg || 'Registration failed')
  }
  setLoading(false)
}

  return (
    <div className="mc-auth-wrap">
      <div className="mc-auth-card">
        <div className="mc-auth-logo">🚖 <span>MEGHA<span>CABS</span></span></div>
        <h2>Create Account</h2>
        <p className="mc-auth-sub">Book & track your rides easily</p>

        {error && <div className="mc-auth-error">{error}</div>}

        <div className="mc-form-group">
          <label>Full Name</label>
          <input placeholder="Your name" value={form.name}
            onChange={e => setForm({...form, name: e.target.value})} />
        </div>
        <div className="mc-form-group">
          <label>Email</label>
          <input placeholder="your@email.com" type="email" value={form.email}
            onChange={e => setForm({...form, email: e.target.value})} />
        </div>
        <div className="mc-form-group">
          <label>Phone</label>
          <input placeholder="+91 XXXXX XXXXX" type="tel" value={form.phone}
            onChange={e => setForm({...form, phone: e.target.value})} />
        </div>
        <div className="mc-form-group">
          <label>Password</label>
          <input placeholder="Min 6 characters" type="password" value={form.password}
            onChange={e => setForm({...form, password: e.target.value})} />
        </div>

        <button className="mc-submit-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p className="mc-auth-switch">
          Already have an account?{' '}
          <span onClick={onSwitch}>Login here</span>
        </p>
      </div>
    </div>
  )
}