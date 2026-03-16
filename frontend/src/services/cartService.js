
import api from './api'

const cartService = {
  getCart:    function()         { return api.get('/cart') },
  addToCart:  function(data)     { return api.post('/cart', data) },
  updateItem: function(id, data) { return api.put('/cart/' + id, data) },
  removeItem: function(id)       { return api.delete('/cart/' + id) },
}

export default cartService
