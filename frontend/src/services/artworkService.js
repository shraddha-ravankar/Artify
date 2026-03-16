import axios from 'axios'

// Separate axios instance for multipart — bypasses the default api.js interceptor
const BASE = 'http://localhost:5000/api'

function getToken() {
  return localStorage.getItem('token') || ''
}

const artworkService = {

  getAll: function(params) {
    return axios.get(BASE + '/artworks', {
      params: params,
      headers: { Authorization: 'Bearer ' + getToken() }
    })
  },

  getOne: function(id) {
    return axios.get(BASE + '/artworks/' + id, {
      headers: { Authorization: 'Bearer ' + getToken() }
    })
  },

  getMyArtworks: function() {
    return axios.get(BASE + '/artworks/my-artworks', {
      headers: { Authorization: 'Bearer ' + getToken() }
    })
  },

  getMyOwn: function() {
    return axios.get(BASE + '/artworks/my-artworks', {
      headers: { Authorization: 'Bearer ' + getToken() }
    })
  },

  // CREATE — sends as true multipart/form-data
  create: function(formData) {
    return axios.post(BASE + '/artworks', formData, {
      headers: {
        Authorization: 'Bearer ' + getToken(),
        // Do NOT set Content-Type — axios sets multipart/form-data + boundary automatically
      }
    })
  },

  // UPDATE — multipart if FormData, JSON otherwise
  update: function(id, data) {
    if (data instanceof FormData) {
      return axios.put(BASE + '/artworks/' + id, data, {
        headers: {
          Authorization: 'Bearer ' + getToken(),
        }
      })
    }
    return axios.put(BASE + '/artworks/' + id, data, {
      headers: {
        Authorization: 'Bearer ' + getToken(),
        'Content-Type': 'application/json'
      }
    })
  },

  remove: function(id) {
    return axios.delete(BASE + '/artworks/' + id, {
      headers: { Authorization: 'Bearer ' + getToken() }
    })
  },

  delete: function(id) {
    return axios.delete(BASE + '/artworks/' + id, {
      headers: { Authorization: 'Bearer ' + getToken() }
    })
  },
}

export default artworkService