// src/services/adminService.js
// import api from './api'

// export default {
//   getStats: () => api.get('/admin/stats')
// }

import api from './api'

const adminService = {
  getStats:    function()     { return api.get('/admin/stats') },
  getUsers:    function()     { return api.get('/admin/users') },
  deleteUser:  function(id)   { return api.delete('/admin/users/' + id) },
  getOrders:   function()     { return api.get('/admin/orders') },
}

export default adminService