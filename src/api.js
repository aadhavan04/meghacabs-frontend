import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (
    import.meta.env.DEV ? '/api' : 'https://meghacabs-backend.onrender.com'
  ),
})

export default api
