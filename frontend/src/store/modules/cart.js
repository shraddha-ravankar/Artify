import cartService from '@/services/cartService'

export default {
  namespaced: true,

  state: {
    items:   [],
    loading: false,
    error:   null,
  },

  getters: {
    cartCount: function(state) {
      return state.items.length
    },
    cartTotal: function(state) {
      return state.items.reduce(function(sum, item) {
        return sum + (item.artwork ? item.artwork.price : 0) * item.quantity
      }, 0)
    },
  },

  mutations: {
    SET_ITEMS:   function(state, items) { state.items   = items },
    SET_LOADING: function(state, val)   { state.loading = val   },
    SET_ERROR:   function(state, err)   { state.error   = err   },
  },

  actions: {
    async fetchCart({ commit }) {
      commit('SET_LOADING', true)
      try {
        const { data } = await cartService.getCart()
        commit('SET_ITEMS', data)
      } catch (err) {
        commit('SET_ERROR', err.response && err.response.data ? err.response.data.message : 'Failed to load cart')
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async addToCart({ dispatch }, payload) {
      await cartService.addToCart(payload)
      dispatch('fetchCart')
    },

    async removeFromCart({ dispatch }, id) {
      await cartService.removeItem(id)
      dispatch('fetchCart')
    },

    async updateQuantity({ dispatch }, { id, quantity }) {
      await cartService.updateItem(id, { quantity })
      dispatch('fetchCart')
    },
  },
}