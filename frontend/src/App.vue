<template>
  <v-app>
    <template v-if="!isAuthPage">
      <Navbar />
      <v-main style="background:#EFEBE9">
        <router-view />
      </v-main>
      <Footer />
    </template>
    <template v-else>
      <router-view />
    </template>
  </v-app>
</template>

<script>
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'

export default {
  name: 'App',
  components: { Navbar, Footer },

  computed: {
    isAuthenticated: function() { return this.$store.getters['auth/isAuthenticated'] },
    isAuthPage: function() {
      var p = this.$route && this.$route.path
      return p === '/login' || p === '/signup'
    },
  },

  created: function() {
    if (this.isAuthenticated) {
      this.$store.dispatch('auth/fetchMe')
        .catch(function() {
        })

      /* refresh cart count in navbar */
      this.$store.dispatch('cart/fetchCart')
      .catch(function() {})
    }
  },
}
</script>