<template>
  <v-app-bar app color="white" elevation="1" height="64">

   
    <v-row no-gutters align="center" class="mr-4" style="cursor:pointer;width:auto;flex:none" @click="$router.push('/')">
    <span class="text-h6 font-weight-black brown--text text--darken-4" style="font-family:'Georgia',serif;letter-spacing:.01em">Artify</span>
    </v-row>

    <!-- Nav links -->
    <div class="d-none d-md-flex align-center">
      <v-btn plain  to="/" class="brown--text text--darken-1 font-weight-bold text-capitalize mx-1">Home</v-btn>
      <v-btn plain  to="/explore" class="brown--text text--darken-1 font-weight-bold text-capitalize mx-1">Explore</v-btn>
      <v-btn plain class="brown--text text--darken-1 font-weight-bold text-capitalize mx-1" @click="goArtist">Artist Dashboard</v-btn>
      <v-btn plain  class="brown--text text--darken-1 font-weight-bold text-capitalize mx-1" @click="goUser">User Dashboard</v-btn>
    </div>

    <v-spacer />

    <!-- Cart -->
    <v-btn icon @click="goUser" class="mr-1">
      <v-icon color="brown darken-2">mdi-cart-outline</v-icon>
    </v-btn>

    <!-- NOT logged in -->
    <template v-if="!isAuth">
      <v-btn text small to="/login" class="brown--text text--darken-1 font-weight-bold text-capitalize mr-1">Login</v-btn>
      <v-btn small depressed color="brown darken-1" dark to="/signup" class="font-weight-bold text-capitalize">Signup</v-btn>
    </template>

    <!-- Logged in-->
    <template v-else>
      <v-menu v-model="menuOpen" offset-y left :close-on-content-click="true" rounded="lg" min-width="230">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" class="ml-2">
            <v-badge
              bottom overlap dot
              :color="userRole==='artist' ? 'brown darken-2' : userRole==='admin' ? 'orange darken-2' : 'blue darken-1'"
              offset-x="6" offset-y="6"
            >
              <v-avatar size="38" color="brown darken-1">
                <span class="white--text font-weight-bold caption">{{ initials }}</span>
              </v-avatar>
            </v-badge>
          </v-btn>
        </template>

        <v-card flat>
          <!-- User info header -->
          <v-list-item class="py-3">
            <v-list-item-avatar color="brown darken-1">
              <span class="white--text font-weight-bold body-2">{{ initials }}</span>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold brown--text text--darken-4">{{ userName }}</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip x-small label
                  :color="userRole==='artist' ? 'brown lighten-4' : userRole==='admin' ? 'orange lighten-4' : 'blue lighten-4'"
                  :text-color="userRole==='artist' ? 'brown darken-3' : userRole==='admin' ? 'orange darken-3' : 'blue darken-3'"
                  class="mt-1 font-weight-bold"
                >
                  <v-icon x-small left>{{ userRole==='artist' ? 'mdi-palette' : 'mdi-account' }}</v-icon>
                  {{ userRole === 'artist' ? 'Artist' : userRole === 'admin' ? 'Admin' : 'User' }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider />

          <v-list dense>
            <v-list-item link @click="goDashboard">
              <v-list-item-icon><v-icon small color="brown darken-1">{{ userRole==='artist' ? 'mdi-palette-outline' : 'mdi-view-dashboard-outline' }}</v-icon></v-list-item-icon>
              <v-list-item-title class="brown--text text--darken-2 font-weight-medium">
                {{ userRole==='artist' ? 'Artist Dashboard' : userRole==='admin' ? 'Admin Panel' : 'My Dashboard' }}
              </v-list-item-title>
            </v-list-item>
          </v-list>

          <v-divider />

          <v-list dense>
            <v-list-item link @click="logout">
              <v-list-item-icon><v-icon small color="red darken-2">mdi-logout</v-icon></v-list-item-icon>
              <v-list-item-title class="red--text text--darken-2 font-weight-medium">Sign Out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </template>

    <!-- Alert snackbar -->
    <v-snackbar v-model="alertShow" top right timeout="3500" color="brown darken-2">
      <v-icon left small color="white">mdi-information-outline</v-icon>
      {{ alertMsg }}
      <template v-slot:action="{ attrs }">
        <v-btn text small v-bind="attrs" @click="alertShow=false" color="white">Close</v-btn>
      </template>
    </v-snackbar>

  </v-app-bar>
</template>

<script>
export default {
  name: 'Navbar',
  data: function() {
    return {
       menuOpen: false, 
    alertShow: false,
     alertMsg: '' }
  },
  computed: {
    isAuth:   function() { return this.$store.getters['auth/isAuthenticated'] },
    userRole: function() {
      var u = this.$store.getters['auth/currentUser']
      return u ? u.role : 'user'
    },
    userName: function() {
      var u = this.$store.getters['auth/currentUser']
      return u ? u.name : ''
    },
    initials: function() {
      var n = this.userName
      if (!n) return '?'
      var parts = n.trim().split(' ')
      if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      return parts[0][0].toUpperCase()
    },
  },
  methods: {
    goDashboard: function() {
      if (this.userRole === 'artist') this.$router.push('/artist/dashboard')
      else if (this.userRole === 'admin') this.$router.push('/admin')
      else this.$router.push('/')
    },
    logout: function() {
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    },
    goArtist: function() {
      if (!this.isAuth) { this.$router.push('/signup'); return }
      if (this.userRole === 'user') { this.alertMsg = 'Please sign in as an Artist to access the Artist Dashboard.'; this.alertShow = true; return }
      this.$router.push('/artist/dashboard')
    },
    goUser: function() {
      if (!this.isAuth) { this.$router.push('/signup'); return }
      if (this.userRole === 'artist') { this.alertMsg = 'Please sign in as a User to access the User Dashboard.'; this.alertShow = true; return }
      this.$router.push('/dashboard')
    },
  },
}
</script>