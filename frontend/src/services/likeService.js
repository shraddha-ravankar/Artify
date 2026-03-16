import api from './api'

const likeService = {
  getUserLikes: function()         { return api.get('/likes/user/likes') },
  like:         function(id)       { return api.post('/likes/' + id) },
  unlike:       function(id)       { return api.delete('/likes/' + id) },
}

export default likeService