import api from './api'

const authService = {
  register: function(data) { return api.post('/auth/register', data) },
  login:    function(data) { return api.post('/auth/login', data) },
  getMe:    function()     { return api.get('/users/me') },
}

export default authService