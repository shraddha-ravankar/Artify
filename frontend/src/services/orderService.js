import axios from 'axios'

const BASE = 'http://localhost:5000/api'
function auth() { return { Authorization: 'Bearer ' + (localStorage.getItem('token') || '') } }

const orderService = {
  createOrder:    function(data) { return axios.post(BASE + '/orders',               data, { headers: auth() }) },
  getMyOrders:    function()     { return axios.get(BASE  + '/orders/my-orders',           { headers: auth() }) },
  getArtistOrders:function()     { return axios.get(BASE  + '/orders/artist-orders',       { headers: auth() }) },
  getOrder:       function(id)   { return axios.get(BASE  + '/orders/' + id,               { headers: auth() }) },
  updateStatus:   function(id, status) { return axios.put(BASE + '/orders/' + id + '/status', { status }, { headers: auth() }) },
}

export default orderService