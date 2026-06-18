import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function MyBookings() {
  const { token } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('https://meghacabs-backend.onrender.com/api/bookings/mine', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(({ data }) => {
      setBookings(data)
      setLoading(false)
    })
  }, [token])

  if (loading) return <div className="mc-bookings-loading">Loading your bookings...</div>

  return (
    <div className="mc-bookings-wrap">
      <h2>My Bookings</h2>
      {bookings.length === 0
        ? <p className="mc-no-bookings">No bookings yet. Book your first ride!</p>
        : bookings.map(b => (
          <div key={b._id} className="mc-booking-card">
            <div className="mc-booking-header">
              <span className="mc-booking-service">{b.service || 'Cab Booking'}</span>
              
            </div>
            <div className="mc-booking-route">
              <span> {b.from}</span>
              <span className="mc-arrow">→</span>
              <span> {b.to}</span>
            </div>
            <div className="mc-booking-meta">
              <span>{b.date}</span>
              <span>{b.time}</span>
              <span>{b.vehicle || 'Any'}</span>
            </div>
          </div>
        ))
      }
    </div>
  )
}