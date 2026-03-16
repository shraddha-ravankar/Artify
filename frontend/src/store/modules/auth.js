import authService from '@/services/authService'

export default {
  namespaced: true,

  state: function() {
    return {
      token:   localStorage.getItem('token') || null,
      user:    JSON.parse(localStorage.getItem('user') || 'null'),
      loading: false,
      error:   null,
    }
  },

  getters: {
    isAuthenticated: function(s) { return !!s.token },
    isArtist:        function(s) { return !!(s.user && s.user.role === 'artist') },

    currentUser:     function(s) { return s.user },
    user:            function(s) { return s.user },   /* alias used by some components */
    isLoading:       function(s) { return s.loading },
    authError:       function(s) { return s.error },
  },

  mutations: {
    SET_TOKEN: function(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_USER: function(state, user) {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    CLEAR_AUTH: function(state) {
      state.token = null
      state.user  = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    SET_LOADING: function(state, v) { state.loading = v },
    SET_ERROR:   function(state, v) { state.error   = v },
  },

  actions: {

    register: function(context, payload) {
      context.commit('SET_LOADING', true)
      context.commit('SET_ERROR', null)
      return authService.register(payload)
        .then(function(res) {
          var data = res.data
          context.commit('SET_TOKEN', data.token)
          context.commit('SET_USER',  data.user)
          return data
        })
        .catch(function(e) {
          var msg = (e.response && e.response.data && e.response.data.message)
                    || 'Registration failed. Please try again.'
          context.commit('SET_ERROR', msg)
          throw e
        })
        .finally(function() {
          context.commit('SET_LOADING', false)
        })
    },

    login: function(context, credentials) {
      context.commit('SET_LOADING', true)
      context.commit('SET_ERROR', null)
      return authService.login(credentials)
        .then(function(res) {
          var data = res.data
          context.commit('SET_TOKEN', data.token)
          context.commit('SET_USER',  data.user)
          return data
        })
        .catch(function(e) {
          var msg = (e.response && e.response.data && e.response.data.message)
                    || 'Login failed. Please check your credentials.'
          context.commit('SET_ERROR', msg)
          throw e
        })
        .finally(function() {
          context.commit('SET_LOADING', false)
        })
    },

    
    fetchMe: function(context) {
      return authService.getMe()
        .then(function(res) {
          /* update user data with fresh info from server */
          context.commit('SET_USER', res.data)
        })
        .catch(function(e) {
          
          var status = e.response && e.response.status
          if (status === 401) {
            context.commit('CLEAR_AUTH')
          }
        
        })
    },

    logout: function(context) {
      context.commit('CLEAR_AUTH')
    },
  },
}