import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Login({ onSwitch }) {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

const handleSubmit = async () => {
  if (!form.email || !form.password)
    return setError('Email and password required!')

  setLoading(true)
  try {
    const { data } = await axios.post("https://meghacabs-backend.onrender.com/api/auth/login", form)
    login(data.user, data.token)

    window.location.reload()
  } catch (err) {
    setError(err.response?.data?.msg || 'Login failed')
  }
  setLoading(false)
}

  return (
    <div className="mc-auth-wrap">
      <div className="mc-auth-card">
        <div className="mc-auth-logo">🚖 <span>MEGHA<span>CABS</span></span></div>
        <h2>Welcome Back</h2>
        <p className="mc-auth-sub">Login to manage your bookings</p>

        {error && <div className="mc-auth-error">{error}</div>}

        <div className="mc-form-group">
          <label>Email</label>
          <input placeholder="your@email.com" type="email" value={form.email}
            onChange={e => setForm({...form, email: e.target.value})} />
        </div>
        <div className="mc-form-group">
          <label>Password</label>
          <input placeholder="Your password" type="password" value={form.password}
            onChange={e => setForm({...form, password: e.target.value})} />
        </div>

        <button className="mc-submit-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="mc-auth-switch">
          New user?{' '}
          <span onClick={onSwitch}>Register here</span>
        </p>
      </div>
    </div>
  )
}