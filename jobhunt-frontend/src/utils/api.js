import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

const API = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const { data } = await axios.post(
          `${API_BASE}/auth/refresh`,
          {},
          { withCredentials: true }
        )
        localStorage.setItem('accessToken', data.data.accessToken)
        original.headers.Authorization = `Bearer ${data.data.accessToken}`
        return API(original)
      } catch {
        localStorage.removeItem('accessToken')
      }
    }
    return Promise.reject(err)
  }
)

export default API
