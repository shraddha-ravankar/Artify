<!-- src/components/layout/Footer.vue -->
<template>
  <v-footer style="background:linear-gradient(135deg,#4E342E,#6D4C41)" dark class="py-8 mt-auto">
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <div class="d-flex align-center mb-3">

            <span class="white--text font-weight-bold" style="font-size:1.2rem; font-family:'Playfair Display',serif">Artify</span>
          </div>
          <p style="color:#D7CCC8; font-size:0.9rem">
            A curated marketplace connecting passionate artists with art lovers worldwide.
          </p>
        </v-col>
        <v-col cols="12" md="2">
          <p class="font-weight-bold white--text mb-2">Home</p>
          <div><router-link to="/explore" style="color:#D7CCC8; text-decoration:none; font-size:0.9rem">Explore</router-link></div>
          <div><router-link to="/signup" style="color:#D7CCC8; text-decoration:none; font-size:0.9rem">Join as Artist</router-link></div>
        </v-col>
        <v-col cols="12" md="2">
          <p class="font-weight-bold white--text mb-2">Account</p>
          <div><router-link to="/login" style="color:#D7CCC8; text-decoration:none; font-size:0.9rem">Login</router-link></div>
          <div><router-link to="/signup" style="color:#D7CCC8; text-decoration:none; font-size:0.9rem">Sign Up</router-link></div>
        </v-col>
        <v-col cols="12" md="4">
          <p class="font-weight-bold white--text mb-2">Stay Connected</p>
          <div class="d-flex">
            <v-btn icon dark small><v-icon>mdi-instagram</v-icon></v-btn>
            <v-btn icon dark small><v-icon>mdi-twitter</v-icon></v-btn>
            <v-btn icon dark small><v-icon>mdi-facebook</v-icon></v-btn>
          </div>
        </v-col>
      </v-row>
      <v-divider dark class="my-4" />
      <div class="text-center" style="color:#A1887F; font-size:0.85rem">
        © {{ new Date().getFullYear() }} Artify. All rights reserved.
      </div>
    </v-container>
  </v-footer>
</template>

<script>
export default { name: 'Footer' }
</script>
