import axios from 'axios'

const BASE = 'http://localhost:5000/api'
function auth() { return { Authorization: 'Bearer ' + (localStorage.getItem('token') || '') } }

const chatService = {

  // Get all chats for logged-in user (works for both user and artist)
  getChats: function() {
    return axios.get(BASE + '/chat', { headers: auth() })
  },

  // Alias used by ChatView
  getUserChats: function() {
    return axios.get(BASE + '/chat', { headers: auth() })
  },

  // Get full conversation between two people about an artwork
  getConversation: function(artworkId, userId) {
    return axios.get(BASE + '/chat/' + artworkId + '/' + userId, { headers: auth() })
  },


  // chatService.sendMessage({ artworkId, message, receiverId }) ← ChatPanel
  sendMessage: function(artworkIdOrData, text) {
    var payload
    if (typeof artworkIdOrData === 'object' && artworkIdOrData !== null) {
      payload = artworkIdOrData
    } else {
      payload = { artworkId: artworkIdOrData, message: text }
    }
    return axios.post(BASE + '/chat', payload, { headers: auth() })
  },
}

export default chatService