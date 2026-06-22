import axios from '../lib/axios'

export const noteService = {
  getAll: async () => {
    return axios.get('/posts?_limit=20')
  },

  getById: async (id) => {
    return axios.get(`/posts/${id}`)
  },

  create: async (newNote) => {
    return axios.post('/posts', newNote)
  },

  update: async (id, data) => {
    return axios.put(`/posts/${id}`, data)
  },

  delete: async (id) => {
    return axios.delete(`/posts/${id}`)
  },
}
