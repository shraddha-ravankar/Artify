<template>
  <v-app>
    <v-row no-gutters style="height:100vh;overflow:hidden">

      <!-- LEFT — image panel -->
      <v-col cols="12" md="6" class="d-none d-md-flex" style="position:relative;overflow:hidden">
        <v-img
          src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&q=85&auto=format&fit=crop"
          height="100%"
          cover
        >
          <v-overlay absolute :opacity="0.68" color="#1A0806">
            <v-container fill-height fluid style="padding:0">
              <v-row style="height:100vh;margin:0;display:flex;flex-direction:column;justify-content:space-between;padding:40px 48px">

                <div style="flex:0 0 auto"></div>

                <!-- MIDDLE -->
                <div style="flex:1;display:flex;flex-direction:column;justify-content:center">

                  <router-link to="/" style="text-decoration:none;display:inline-block;margin-bottom:14px">
                    <span style="font-family:'Georgia',serif;font-size:18px;font-weight:700;color:rgba(255,255,255,0.75);letter-spacing:0.12em;text-transform:uppercase;">
                      ✦ Artify
                    </span>
                  </router-link>

                  <div style="font-family:'Georgia',serif;font-size:48px;font-weight:900;color:white;line-height:1.1;margin-bottom:18px;">
                    Where Art <span style="color:#BCAAA4;font-style:italic">Finds Its Home</span>
                  </div>

                  <div style="color:rgba(215,204,200,0.70);font-size:15px;line-height:1.8;max-width:340px;margin-bottom:28px;font-family:sans-serif;">
                    Discover, collect and sell extraordinary artworks from talented artists worldwide.
                  </div>

                  <div style="display:flex;gap:8px;flex-wrap:wrap">
                    <v-chip small outlined color="blue-grey lighten-3">
                      <v-icon x-small left>mdi-palette</v-icon>500+ Artworks
                    </v-chip>
                    <v-chip small outlined color="blue-grey lighten-3">
                      <v-icon x-small left>mdi-account-group</v-icon>120+ Artists
                    </v-chip>
                    <v-chip small outlined color="blue-grey lighten-3">
                      <v-icon x-small left>mdi-shield-check</v-icon>Secure Checkout
                    </v-chip>
                  </div>

                </div>

                <!-- BOTTOM -->
                <div style="flex:0 0 auto">
                  <span style="color:rgba(215,204,200,0.30);font-size:11px;font-family:sans-serif;">
                    © 2025 Artify. All rights reserved.
                  </span>
                </div>

              </v-row>
            </v-container>
          </v-overlay>
        </v-img>
      </v-col>

      <!-- RIGHT — form panel -->
      <v-col
        cols="12"
        md="6"
        class="d-flex align-center justify-center"
        style="background:#FDFAF8;overflow:hidden;height:100vh"
      >
        <v-container style="max-width:480px;padding:0 48px;width:100%">

          <!-- Mobile brand -->
          <v-row justify="center" class="mb-6 d-flex d-md-none">
            <span class="text-h6 font-weight-black brown--text text--darken-4" style="font-family:'Georgia',serif">✦ Artify</span>
          </v-row>

          <!-- Heading -->
          <div class="font-weight-black mb-1" style="color:#2C1810;font-family:'Georgia',serif;font-size:32px">Welcome Back</div>
          <div class="body-2 mb-5" style="color:#A1887F;font-size:14px">Sign in to access your dashboard</div>

          <!-- Role toggle -->
          <v-btn-toggle
            v-model="role"
            mandatory
            rounded
            class="mb-4 elevation-0"
            style="background:#F2EAE6;border:1.5px solid #DDD0CA;width:100%;border-radius:24px"
          >
            <v-btn value="artist" class="flex-grow-1" style="height:44px;border-radius:20px" :color="role==='artist'?'brown darken-1':''">
              <v-icon small left :color="role==='artist'?'white':'brown'">mdi-palette-outline</v-icon>
              <span :class="role==='artist'?'white--text':'brown--text text--darken-1'" class="font-weight-bold text-capitalize" style="font-size:14px">Artist</span>
            </v-btn>
            <v-btn value="user" class="flex-grow-1" style="height:44px;border-radius:20px" :color="role==='user'?'brown darken-1':''">
              <v-icon small left :color="role==='user'?'white':'brown'">mdi-account-outline</v-icon>
              <span :class="role==='user'?'white--text':'brown--text text--darken-1'" class="font-weight-bold text-capitalize" style="font-size:14px">User</span>
            </v-btn>
          </v-btn-toggle>

          <!-- Error alert -->
          <v-alert v-if="error" type="error" dense text class="mb-3" color="red darken-3">
            {{ error }}
          </v-alert>

          <!-- Email -->
          <div class="caption font-weight-bold mb-1" style="color:#6D4C41;letter-spacing:.08em;text-transform:uppercase;font-size:11px">Email Address</div>
          <v-text-field
            v-model="form.email"
            outlined
            placeholder="you@example.com"
            prepend-inner-icon="mdi-email-outline"
            background-color="white"
            color="brown darken-2"
            hide-details
            class="mb-3"
            style="font-size:15px"
            @keyup.enter="submit"
          />

          <!-- Password -->
          <div class="caption font-weight-bold mb-1" style="color:#6D4C41;letter-spacing:.08em;text-transform:uppercase;font-size:11px">Password</div>
          <v-text-field
            v-model="form.password"
            outlined
            placeholder="••••••••"
            prepend-inner-icon="mdi-lock-outline"
            :append-icon="showPass ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
            :type="showPass ? 'text' : 'password'"
            background-color="white"
            color="brown darken-2"
            hide-details
            class="mb-2"
            style="font-size:15px"
            @click:append="showPass = !showPass"
            @keyup.enter="submit"
          />

          <!-- Forgot password -->
          <div class="text-right mb-5">
            <router-link to="/forgot-password" class="caption font-weight-bold" style="color:#6D4C41;text-decoration:none;font-size:12px">
              Forgot password?
            </router-link>
          </div>

          <!-- Sign In button -->
          <v-btn
            block
            depressed
            color="brown darken-1"
            dark
            class="mb-4 text-uppercase font-weight-bold"
            style="letter-spacing:.08em;height:48px;font-size:14px"
            :loading="loading"
            @click="submit"
          >
            Sign In
          </v-btn>

          <!-- Divider -->
          <div class="d-flex align-center mb-4">
            <v-divider />
            <span class="caption px-3" style="color:#BCAAA4;white-space:nowrap;font-size:12px">Don't have an account?</span>
            <v-divider />
          </div>

          <!-- Create Account button -->
          <v-btn
            block
            outlined
            color="brown darken-1"
            style="height:48px;font-size:14px"
            class="font-weight-bold"
            to="/signup"
          >
            Create Account
          </v-btn>

        </v-container>
      </v-col>

    </v-row>
  </v-app>
</template>

<script>
export default {
  name: 'LoginView',
  data: function () {
    return {
      role:     'artist',
      form:     { email: '', password: '' },
      showPass: false,
    }
  },
  computed: {
    loading: function () { return this.$store.getters['auth/isLoading'] },
    error:   function () { return this.$store.getters['auth/authError'] },
  },
  created: function () {
    this.$store.commit('auth/SET_ERROR', null)
  },
  methods: {
    submit: function () {
      var self = this
      if (!self.form.email || !self.form.password) {
        self.$store.commit('auth/SET_ERROR', 'Please fill in all fields.')
        return
      }
      self.$store.dispatch('auth/login', self.form)
        .then(function (data) {
          var user = data.user
          if (user.role !== self.role && user.role !== 'admin') {
            self.$store.commit('auth/CLEAR_AUTH')
            self.$store.commit('auth/SET_ERROR',
              'This is a ' + user.role + ' account. Please select the correct role tab.')
            return
          }
          if (user.role === 'artist') self.$router.push('/artist/dashboard')
          else if (user.role === 'admin') self.$router.push('/admin')
          else self.$router.push('/dashboard')
        })
        .catch(function () {})
    },
  },
}
</script>