import Vue  from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import cart from './modules/cart'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { auth, cart },
  state: {
    featuredArtworks: [],
    featuredLoading:  false,
  },
  mutations: {
    SET_FEATURED:         function(state, artworks) { state.featuredArtworks = artworks },
    SET_FEATURED_LOADING: function(state, val)      { state.featuredLoading  = val },
  },
  actions: {
    fetchFeatured: function(context) {
      context.commit('SET_FEATURED_LOADING', true)
      return import('@/services/artworkService')
        .then(function(m) { return m.default.getAll({ isFeatured: true, limit: 6 }) })
        .then(function(res) { context.commit('SET_FEATURED', res.data.artworks || []) })
        .catch(function(e) { console.error('fetchFeatured failed', e) })
        .finally(function() { context.commit('SET_FEATURED_LOADING', false) })
    },
    fetchFeaturedArtworks: function(context) {
      return context.dispatch('fetchFeatured')
    },
  },
})