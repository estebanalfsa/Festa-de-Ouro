import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getUsers = () => api.get('/users/')
export const getUser = (id) => api.get(`/users/${id}/`)
export const getUserInfo = (id) => api.get(`/users-info/${id}/`)
export const getAllUsersInfo = () => api.get('/users-info/')
export const getPosts = () => api.get('/posts/')
export const getPost = (id) => api.get(`/posts/${id}/`)

export const isAuthenticated = () => !!localStorage.getItem('access_token')
export const logout = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user_id')
  localStorage.removeItem('user_email')
}

export default api
