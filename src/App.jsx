import { useState } from 'react'
import './App.css'
import cabImg from './assets/cab.png';
import emailjs from '@emailjs/browser';
emailjs.init('g_XWVw7BEVg_2_H5m');
import { useAuth } from './context/AuthContext'
import Login from './Pages/Login'
import Register from './Pages/Register'
import MyBookings from './Pages/MyBookings'
import axios from 'axios'


function App() {
  const { user, logout, token } = useAuth()
  
const [authPage, setAuthPage] = useState(null) // 'login' | 'register' | null
const [showBookings, setShowBookings] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  
  const [bookingStatus, setBookingStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [formData, setFormData] = useState({
  name: '', phone: '', email: '', service: '', from: '', to: '', date: '', time: '', vehicle: '', notes: ''
})


  useState(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }))
    }
  }, [user])

const handleSubmit = async () => {
  if (!formData.name || !formData.phone || !formData.from || !formData.to) {
    alert('Please fill Name, Phone, Pickup & Destination')
    return
  }

  setBookingStatus('loading')

  try {
    // EmailJS
    await emailjs.send('service_zfc5lvo', 'template_ehqbp3k', {
      from_name: formData.name,
      phone: formData.phone,
      user_email: formData.email,
      service: formData.service,
      from_location: formData.from,
      to_location: formData.to,
      date: formData.date,
      time: formData.time,
      vehicle: formData.vehicle,
      notes: formData.notes,
    }, 'g_XWVw7BEVg_2_H5m')

    // EmailJS — customer 
    await emailjs.send('service_zfc5lvo', 'template_rg8jcxu', {
      from_name: formData.name,
      user_email: formData.email,
      service: formData.service,
      from_location: formData.from,
      to_location: formData.to,
      date: formData.date,
      time: formData.time,
      vehicle: formData.vehicle,
    }, 'g_XWVw7BEVg_2_H5m')

    
    setBookingStatus('success')
    setFormData({
      name: user?.name || '', phone: user?.phone || '', email: user?.email || '',
      service: '', from: '', to: '', date: '', time: '', vehicle: '', notes: ''
    })
    setTimeout(() => setBookingStatus('idle'), 15000)

  
    if (user && token) {
      axios.post('https://meghacabs-backend.onrender.com/api/bookings', formData, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 15000, // 15 sec max wait, atharkku mela give up
      }).catch(err => {
        console.error('Backend save failed (non-critical):', err)
      })
    }

  } catch (err) {
    console.error(err)
    setBookingStatus('error')
    setTimeout(() => setBookingStatus('idle'), 1000)
  }
}


  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
    setActiveSection(id)
  }

  return (
    <div className="mc-root">
      <style>{`
        @keyframes mc-slide-in {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {authPage === 'login' && (
        <Login onSwitch={() => setAuthPage('register')} />
      )}
      {authPage === 'register' && (
        <Register onSwitch={() => setAuthPage('login')} />
      )}
      {showBookings && user && (
        <div className="mc-modal-overlay" onClick={() => setShowBookings(false)}>
          <div className="mc-modal" onClick={e => e.stopPropagation()}>
            <button className="mc-modal-close" onClick={() => setShowBookings(false)}>✕</button>
            <MyBookings />
          </div>
        </div>
      )}


      <nav className="mc-nav">
        <div className="mc-nav-inner">
          <div className="mc-logo" onClick={() => scrollTo('home')}>
            
            <span className="mc-logo-text">MEGHA<span>CABS</span></span>
          </div>
          <ul className={`mc-nav-links ${menuOpen ? 'open' : ''}`}>
            {['home','about','services','fleet','pricing','contact'].map(s => (
              <li key={s} className={activeSection === s ? 'active' : ''} onClick={() => scrollTo(s)}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </li>
            ))}
           {user ? (
  <>
    <li onClick={() => { setShowBookings(true); setAuthPage(null) }}>My Bookings</li>
    <li className="mc-nav-book" onClick={logout}>Logout ({user.name.split(' ')[0]})</li>
  </>
) : (
  <li className="mc-nav-book" onClick={() => setAuthPage('login')}>Login / Book</li>
)}
          </ul>
          <button className="mc-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>


      <section id="home" className="mc-hero">
        <div className="mc-hero-overlay" />
        <div className="mc-hero-content">
          <span className="mc-hero-badge">✦ Trusted Since 2024 · Chennai</span>
          <h1>MEGHA CABS</h1>
          <p className="mc-hero-tag">Your Comfort Is Our First Priority.</p>
          <p className="mc-hero-sub">
            Reliable, safe and comfortable travel across Chennai —<br />
            Local rides, airport transfers & outstation journeys.
          </p>
          <div className="mc-hero-btns">
            <button className="mc-btn-gold" onClick={() => scrollTo('contact')}>Book a Ride</button>
            <button className="mc-btn-outline" onClick={() => scrollTo('services')}>Our Services</button>
          </div>
          <div className="mc-hero-stats">
            <div><span className="mc-stat-n">15+</span><span className="mc-stat-l">Years Experience</span></div>
            <div><span className="mc-stat-n">10K+</span><span className="mc-stat-l">Happy Customers</span></div>
            <div><span className="mc-stat-n">50+</span><span className="mc-stat-l">Vehicles</span></div>
            <div><span className="mc-stat-n">24/7</span><span className="mc-stat-l">Available</span></div>
          </div>
        </div>

    
        <div className="mc-hero-img-wrap">
          <div className="mc-hero-img-wrap">
  <img
    src={cabImg}
    alt="Megha Cabs"
    style={{
      width: "150%",
      height: "300px",
      //objectFit: "cover",
      borderRadius: "10px",
      //display: "block",
    }}
  />
</div>
        </div>
      </section>

    
      <section id="about" className="mc-about">
        <div className="mc-container mc-about-grid">
          <div className="mc-about-img">
            <div className="mc-about-badge">
              <span className="mc-badge-num">15</span>
              <span className="mc-badge-txt">Years of<br/>Excellence</span>
            </div>
            <div className="mc-about-card">
              <span>🏆</span>
              <p>Best Cab Service<br/>Chennai 2023</p>
            </div>
          </div>
          <div className="mc-about-text">
            <p className="mc-label">About Us</p>
            <h2>Chennai's Most Trusted<br/>Cab Service</h2>
            <p>
              With over 15 years of experience, MEGHA CABS has been the go-to travel partner
              for thousands of families, professionals, and tourists across Chennai.
            </p>
            <p>
              Whether you need a quick local ride, a comfortable airport transfer, or a
              long-distance outstation trip — we deliver punctuality, safety, and comfort every single time.
            </p>
            <div className="mc-about-points">
              {['Police-verified drivers','GPS tracked vehicles','24/7 customer support','Clean & sanitized cabs'].map(p => (
                <div key={p} className="mc-point"><span>✓</span><span>{p}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

    
      <section id="services" className="mc-services">
        <div className="mc-container">
          <div className="mc-sec-head">
            <p className="mc-label">What We Offer</p>
            <h2>Our Services</h2>
            <p className="mc-sec-sub">From city rides to outstation journeys — we've got you covered.</p>
          </div>
          <div className="mc-services-grid">
            {[
              {  title: 'Chennai Local', desc: 'Quick and comfortable rides within Chennai for office commutes, shopping, hospital visits and more.' },
              {  title: 'Outstation Travel', desc: 'Long distance trips to Pondicherry, Coimbatore, Madurai, Ooty, Trichy and all of Tamil Nadu & All over South India.' },
              {  title: 'Airport Transfers', desc: 'On-time pickups and drops to Chennai International Airport. Flight tracking & early morning service available.' },
              {  title: 'Corporate Bookings', desc: 'Monthly packages, dedicated vehicles, and professional drivers for your business travel needs.' },
            ].map(s => (
              <div key={s.title} className="mc-service-card">
                <div className="mc-service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section id="fleet" className="mc-fleet">
        <div className="mc-container">
          <div className="mc-sec-head">
            <p className="mc-label">Our Vehicles</p>
            <h2>Handpicked Fleet</h2>
            <p className="mc-sec-sub">Clean, well-maintained, and sanitized vehicles for every group size.</p>
          </div>
          <div className="mc-fleet-grid">
            {[
              { icon: '', name: 'Sedan', desc: 'Ideal for solo or couple travel and family. Fuel efficient and comfortable.', tags: ['5 Seater','AC','Music'], price: '₹16/km onwards' },
              { icon: '', name: 'Innova Crysta', desc: 'The favourite for family trips and outstation journeys. Spacious and powerful.', tags: ['7 Seater','AC','Boot Space'], price: '₹22/km onwards', popular: true },
              { icon: '', name: 'SUV', desc: 'For large groups, corporate tours, and pilgrimages. Ample luggage space.', tags: ['AC','Group Travel'], price: '₹20/km onwards' },
            ].map(f => (
              <div key={f.name} className={`mc-fleet-card ${f.popular ? 'popular' : ''}`}>
                {f.popular && <span className="mc-popular-tag">Most Booked</span>}
                <div className="mc-fleet-icon">{f.icon}</div>
                <div className="mc-fleet-body">
                  <h3>{f.name}</h3>
                  <p>{f.desc}</p>
                  <div className="mc-fleet-tags">
                    {f.tags.map(t => <span key={t} className="mc-tag">{t}</span>)}
                  </div>
                  <div className="mc-fleet-price">{f.price}</div>
                  <button className="mc-fleet-btn" onClick={() => scrollTo('contact')}>Book This</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

   
      <section id="pricing" className="mc-pricing">
        <div className="mc-container">
          <div className="mc-sec-head">
            <p className="mc-label" style={{color:'#F5C518'}}>Transparent Rates</p>
            <h2 style={{color:'white'}}>Simple Pricing</h2>
            <p className="mc-sec-sub" style={{color:'#94A3B8'}}>No hidden charges. No surprises. What you see is what you pay.</p>
          </div>
          <div className="mc-pricing-grid">
            {[
              { title: 'Chennai Local', route: 'Within city limits', price: '₹350', unit: '1 Hour', features: ['Toll & parking extra','Night surcharge applies','Driver batta included'], featured: false },
              { title: 'Outstation', route: 'Tamil Nadu & Beyond', price: '₹16', unit: 'per km · Both ways', features: ['250 km/day minimum','Driver allowance extra','Tolls & parking extra','One-way options available'], featured: true },
              { title: 'Airport Transfer', route: 'Chennai Airport', price: '₹999', unit: 'Starting From', features: ['Free 30 min wait','Early morning available','24/7 service'], featured: false },
            ].map(p => (
              <div key={p.title} className={`mc-price-card ${p.featured ? 'featured' : ''}`}>
                {p.featured && <span className="mc-price-badge">Most Popular</span>}
                <h3>{p.title}</h3>
                <p className="mc-price-route">{p.route}</p>
                <div className="mc-price-amount">{p.price}</div>
                <p className="mc-price-unit">{p.unit}</p>
                <ul className="mc-price-list">
                  {p.features.map(f => <li key={f}>{f}</li>)}
                </ul>
                <button className={`mc-price-btn ${p.featured ? 'filled' : ''}`} onClick={() => scrollTo('contact')}>
                  Book Now
                </button>
              </div>
            ))}
          </div>
          <p className="mc-price-note">***Terms & Conditions: Billing Calculation: Distance and time are strictly
calculated garage-to-garage (starting and ending at the operator's depot in Chennai, not your home address).
Minimum Usage: Outstation packages usually
require a minimum billing limit of 250 kilometers per day. Local city rentals typically enforce an 4-hour/40kilometer 8-hour / 80-kilometer or 12-hour /120-kilometer minimum slab.
Additional Costs: You are entirely responsible for Driver Allowance and  all toll taxes, state entry taxes, and parking fees incurred during the trip.</p>
        </div>
      </section>

      <section id="contact" className="mc-contact">
        <div className="mc-container mc-contact-grid">
          <div className="mc-contact-info">
            <p className="mc-label">Book a Ride</p>
            <h2>Get In Touch</h2>
            <p>Fill the form or reach us via phone or WhatsApp. We confirm your booking within minutes.</p>
            <div className="mc-contact-items">
              {[
                { icon: '📞', label: 'Call Us', value: '+91 95859 23990' , value2: '+91 73972 88311' },
                { icon: '💬', label: 'WhatsApp', value: '+91 9585923990', green: true },
                { icon: '✉️', label: 'Email', value: 'meghacabs7953@gmail.com' },
              ].map(c => (
                <div key={c.label} className="mc-contact-item">
                  <div className={`mc-c-icon ${c.green ? 'green' : ''}`}>{c.icon}</div>
                  <div>
                    <p className="mc-c-label">{c.label}</p>
                    <p className="mc-c-value">{c.value}</p>
                    {c.value2 && <p className="mc-c-value">{c.value2}</p>}


                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mc-form">
            <h3>Request a Booking</h3>
            <div className="mc-form-row">
  <div className="mc-form-group">
    <label>Full Name</label>
    <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Your name" />
  </div>
  <div className="mc-form-group">
    <label>Mobile</label>
    <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 XXXXX XXXXX" type="tel" />
  </div>
</div>

<div className="mc-form-group">
  <label>Your Email</label>
  <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="your@email.com" type="email" />
</div>
            <div className="mc-form-group">
              <label>Service Type</label>
              <select value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})}>
                <option value="">Select service...</option>
                <option>Chennai Local</option>
                <option>Outstation (One Way)</option>
                <option>Outstation (Round Trip)</option>
                <option>Airport Pickup</option>
                <option>Airport Drop</option>
                <option>Corporate Booking</option>
              </select>
            </div>
            <div className="mc-form-row">
              <div className="mc-form-group">
                <label>Pickup Location</label>
                <input value={formData.from} onChange={e => setFormData({...formData, from: e.target.value})} placeholder="From where?" />
              </div>
              <div className="mc-form-group">
                <label>Destination</label>
                <input value={formData.to} onChange={e => setFormData({...formData, to: e.target.value})} placeholder="Going to?" />
              </div>
            </div>
            <div className="mc-form-row">
              <div className="mc-form-group">
                <label>Travel Date</label>
                <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className="mc-form-group">
                <label>Pickup Time</label>
                <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
              </div>
            </div>
            <div className="mc-form-group">
              <label>Vehicle</label>
              <select value={formData.vehicle} onChange={e => setFormData({...formData, vehicle: e.target.value})}>
                <option value="">Any available</option>
                <option>Sedan (Swift Dzire / Etios)</option>
                <option>SUV (Toyota Innova)</option>
                <option>Tempo Traveller (12 seater)</option>
              </select>
            </div>
            <div className="mc-form-group">
              <label>Additional Notes</label>
              <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Special requirements, luggage info, etc." />
            </div>
            <button
              className="mc-submit-btn"
              onClick={handleSubmit}
              disabled={bookingStatus === 'loading'}
              style={{ opacity: bookingStatus === 'loading' ? 0.7 : 1, cursor: bookingStatus === 'loading' ? 'not-allowed' : 'pointer' }}
            >
              {bookingStatus === 'loading' ? '⏳ Sending your booking...' : 'Confirm Booking Request'}
            </button>
            <a href="https://wa.me/919585923990" className="mc-wa-btn" target="_blank" rel="noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Book via WhatsApp
            </a>

            {bookingStatus === 'success' && (
              <div style={{
                marginTop: '16px',
                padding: '18px 20px',
                background: 'linear-gradient(135deg, #0f5132, #198754)',
                border: '1px solid #75b798',
                borderRadius: '12px',
                color: '#fff',
                animation: 'mc-slide-in 0.4s ease',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ fontSize: '28px', lineHeight: 1 }}>✅</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '16px' }}>Booking Sent Successfully!</p>
                    <p style={{ margin: '6px 0 0', fontSize: '13px', opacity: 0.9 }}>
                      Your booking request sent successfully. Please check your mail inbox for confirmation mail. Our drivers will shortly reach out to you
                    </p>
                    {user && (
                      <p style={{ margin: '8px 0 0', fontSize: '12px', opacity: 0.8, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '8px' }}>
                        Your booking history was saved please check it on <strong>My Bookings</strong> THANK YOU, HAVE A NICE DAY
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {bookingStatus === 'error' && (
              <div style={{
                marginTop: '16px',
                padding: '16px 20px',
                background: 'linear-gradient(135deg, #5c1a1a, #842029)',
                border: '1px solid #f1aeb5',
                borderRadius: '12px',
                color: '#fff',
                animation: 'mc-slide-in 0.4s ease',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ fontSize: '24px', lineHeight: 1 }}>⚠️</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '15px' }}>Booking Failed!</p>
                    <p style={{ margin: '5px 0 0', fontSize: '13px', opacity: 0.9 }}>
                      Please try again later or message us in WhatsApp or make a call: <strong>+91 95859 23990</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="mc-footer">
        <div className="mc-container">
          <div className="mc-footer-grid">
            <div>
              <div className="mc-logo" style={{marginBottom:'12px'}}>
                <span className="mc-logo-icon">🚖</span>
                <span className="mc-logo-text">MEGHA<span>CABS</span></span>
              </div>
              <p className="mc-footer-desc">Your trusted travel partner in Chennai since 2024. Safe, comfortable, and always on time.</p>
            </div>
            <div>
              <h4>Services</h4>
              <ul>{['Chennai Local','Outstation Cabs','Airport Transfers','Corporate Booking'].map(s=><li key={s}>{s}</li>)}</ul>
            </div>
            <div>
              <h4>Popular Routes</h4>
              <ul>{['Chennai → Pondicherry','Chennai → Coimbatore','Chennai → Madurai','Chennai → Ooty','Chennai → Trichy' , 'Chennai → Out Stations' ].map(r=><li key={r}>{r}</li>)}</ul>
            </div>
            <div>
              <h4>Contact</h4>
              <ul>
                <li>📞 +91 95859 23990</li>
                <li>💬 WhatsApp Us</li>
                <li>✉️ meghacabs7953@gmail.com</li>
              </ul>
            </div>
          </div>
          <div className="mc-footer-bottom">
            <span>© 2026 Megha Cabs. All rights reserved.</span>
            <span>Made with ❤️ in Chennai</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
