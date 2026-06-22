import api from '../lib/axios'

export const noteService = {
  getAll: () => api.get('/posts?_limit=20'),

  getById: (id) => api.get(`/posts/${id}`),

  create: (data) => api.post('/posts', data),

  update: (id, data) => api.put(`/posts/${id}`, data),

  delete: (id) => api.delete(`/posts/${id}`),
}
