<template>
  <v-app style="background:#F8F3F0">

    <!-- HEADER -->
    <v-sheet dark color="brown darken-3" class="py-7">
      <v-container>
        <v-row align="center" no-gutters>
          <v-avatar color="brown darken-1" size="48" class="mr-4" style="border:2px solid rgba(255,255,255,0.2)">
            <span class="white--text font-weight-black title">{{ initials }}</span>
          </v-avatar>
          <div>
            <div class="text-h5 font-weight-black white--text" style="font-family:'Georgia',serif">My Account</div>
            <div class="body-2 mt-1" style="color:rgba(255,255,255,0.6)">
              Welcome back, <strong style="color:#FFCCBC">{{ user && user.name }}</strong>
            </div>
          </div>
        </v-row>
      </v-container>
    </v-sheet>

    <!-- TABS -->
    <v-container class="pt-4 pb-0">
      <v-tabs v-model="activeTab" color="brown darken-2" background-color="transparent" slider-color="brown darken-2">
        <v-tab style="font-weight:700;text-transform:capitalize;letter-spacing:0">
          <v-icon left size="18">mdi-heart-outline</v-icon>Liked Artworks
        </v-tab>
        <v-tab style="font-weight:700;text-transform:capitalize;letter-spacing:0">
          <v-icon left size="18">mdi-package-variant-closed</v-icon>My Orders
          <v-badge v-if="activeOrders > 0" :content="String(activeOrders)" color="orange darken-2" class="ml-2" inline />
        </v-tab>
        <v-tab style="font-weight:700;text-transform:capitalize;letter-spacing:0">
          <v-icon left size="18">mdi-account-outline</v-icon>Profile
        </v-tab>
        <v-tab style="font-weight:700;text-transform:capitalize;letter-spacing:0">
          <v-icon left size="18">mdi-chat-outline</v-icon>Messages
        </v-tab>
      </v-tabs>
      <v-divider />
    </v-container>

    <!-- ══════════ TAB: LIKED ARTWORKS ══════════ -->
    <v-container v-if="activeTab === 0" class="py-6">
      <v-row v-if="likedLoading" justify="center" class="py-10">
        <v-progress-circular indeterminate color="brown darken-1" size="40" />
      </v-row>
      <v-row v-else-if="likedArtworks.length === 0" justify="center">
        <v-col cols="12" class="text-center py-16">
          <v-avatar size="90" color="brown lighten-5" style="border:2px solid #D7CCC8" class="mb-5">
            <v-icon size="52" color="brown lighten-3">mdi-heart-off-outline</v-icon>
          </v-avatar>
          <div class="font-weight-black mb-2" style="font-family:'Georgia',serif;font-size:1.5rem;color:#5D4037">No liked artworks yet</div>
          <div class="body-2 mb-6" style="color:#A1887F">Browse the gallery and like artworks you love</div>
          <v-btn rounded depressed dark color="brown darken-1" class="font-weight-bold" style="letter-spacing:0" to="/explore">
            <v-icon left size="16">mdi-compass-outline</v-icon>Explore Gallery
          </v-btn>
        </v-col>
      </v-row>

      <!-- ArtworkCard with red heart + unlike on click -->
      <v-row v-else>
        <v-col v-for="item in likedArtworks" :key="item._id || (item.artwork && item.artwork._id)" cols="12" sm="6" md="4" lg="3">
          <artwork-card
            :artwork="item.artwork || item"
            :is-liked="true"
            show-unlike
            @unlike="removeLike"
          />
        </v-col>
      </v-row>
    </v-container>

    <!-- ══════════ TAB: MY ORDERS ══════════ -->
    <v-container v-if="activeTab === 1" class="py-6">

      <v-row align="center" justify="space-between" no-gutters class="mb-4">
        <span class="font-weight-black" style="font-family:'Georgia',serif;font-size:1.2rem;color:#5D4037">My Orders</span>
        <v-btn icon small @click="fetchOrders" :loading="ordersLoading">
          <v-icon color="brown darken-1">mdi-refresh</v-icon>
        </v-btn>
      </v-row>

      <v-row v-if="ordersLoading" justify="center" class="py-10">
        <v-progress-circular indeterminate color="brown darken-1" size="40" />
      </v-row>

      <v-row v-else-if="orders.length === 0" justify="center">
        <v-col cols="12" class="text-center py-16">
          <v-avatar size="90" color="brown lighten-5" style="border:2px solid #D7CCC8" class="mb-5">
            <v-icon size="52" color="brown lighten-3">mdi-package-variant-closed</v-icon>
          </v-avatar>
          <div class="font-weight-black mb-2" style="font-family:'Georgia',serif;font-size:1.5rem;color:#5D4037">No orders yet</div>
          <div class="body-2 mb-6" style="color:#A1887F">When you purchase artworks, your orders will appear here</div>
          <v-btn rounded depressed dark color="brown darken-1" class="font-weight-bold" style="letter-spacing:0" to="/explore">
            <v-icon left size="16">mdi-compass-outline</v-icon>Shop Now
          </v-btn>
        </v-col>
      </v-row>

      <div v-else>
        <v-card v-for="order in orders" :key="order._id"
          flat class="mb-5"
          style="border-radius:16px;border:1.5px solid #F0E8E4;overflow:hidden">

          <v-sheet color="brown lighten-5" class="pa-4">
            <v-row align="center" justify="space-between" no-gutters style="flex-wrap:wrap;gap:12px">
              <div>
                <div class="caption font-weight-bold" style="color:#A1887F;text-transform:uppercase;letter-spacing:0.06em">Order ID</div>
                <div class="font-weight-bold body-2" style="color:#2C1810;font-family:monospace">
                  #{{ order._id.toString().slice(-8).toUpperCase() }}
                </div>
              </div>
              <div>
                <div class="caption font-weight-bold" style="color:#A1887F;text-transform:uppercase;letter-spacing:0.06em">Date</div>
                <div class="caption" style="color:#6D4C41">{{ formatDate(order.createdAt) }}</div>
              </div>
              <div>
                <div class="caption font-weight-bold" style="color:#A1887F;text-transform:uppercase;letter-spacing:0.06em">Payment</div>
                <v-chip x-small :color="order.paymentMethod === 'razorpay' ? 'blue lighten-4' : 'green lighten-4'"
                  :text-color="order.paymentMethod === 'razorpay' ? 'blue darken-3' : 'green darken-3'"
                  class="font-weight-bold">
                  <v-icon x-small left>{{ order.paymentMethod === 'razorpay' ? 'mdi-lightning-bolt' : 'mdi-cash' }}</v-icon>
                  {{ order.paymentMethod === 'razorpay' ? 'Online' : 'COD' }}
                </v-chip>
              </div>
              <div>
                <div class="caption font-weight-bold" style="color:#A1887F;text-transform:uppercase;letter-spacing:0.06em">Total</div>
                <div class="font-weight-black" style="font-family:'Georgia',serif;font-size:1.1rem;color:#5D4037">
                  ₹{{ Number(order.totalPrice || 0).toLocaleString('en-IN') }}
                </div>
              </div>
              <div>
                <div class="caption font-weight-bold mb-1" style="color:#A1887F;text-transform:uppercase;letter-spacing:0.06em">Status</div>
                <v-chip small :color="statusColor(order.status).bg" :text-color="statusColor(order.status).text" class="font-weight-bold">
                  <v-icon x-small left>{{ statusColor(order.status).icon }}</v-icon>
                  {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
                </v-chip>
              </div>
            </v-row>
          </v-sheet>

          <v-card-text class="pa-4 pb-2">
            <div class="caption font-weight-bold mb-3" style="color:#A1887F;text-transform:uppercase;letter-spacing:0.06em">Order Progress</div>
            <v-row no-gutters align="center" class="mb-4">
              <template v-for="(step, i) in orderSteps(order.status)">
                <v-col :key="'step'+i" cols="auto" class="text-center" style="min-width:60px">
                  <v-avatar size="30"
                    :color="step.done ? 'brown darken-1' : step.active ? 'orange darken-1' : 'brown lighten-5'"
                    :style="step.done || step.active ? '' : 'border:1.5px solid #D7CCC8'">
                    <v-icon size="14" :color="step.done || step.active ? 'white' : '#BCAAA4'">{{ step.icon }}</v-icon>
                  </v-avatar>
                  <div class="mt-1" style="font-size:0.65rem;line-height:1.2"
                    :style="{ color: step.done ? '#5D4037' : step.active ? '#E65100' : '#BCAAA4', fontWeight: step.active ? '700' : '400' }">
                    {{ step.label }}
                  </div>
                </v-col>
                <v-col v-if="i < orderSteps(order.status).length - 1" :key="'line'+i" style="padding:0 2px;padding-bottom:18px">
                  <v-divider :style="'border-color:' + (step.done ? '#5D4037' : '#D7CCC8')" />
                </v-col>
              </template>
            </v-row>
          </v-card-text>

          <v-card-text class="pa-4 pt-0">
            <v-divider class="mb-3" />
            <div v-for="item in order.items" :key="item._id"
              class="d-flex align-center mb-3"
              style="gap:14px;padding:10px;background:#FDFAF8;border-radius:12px;border:1px solid #F0E8E4">
              <div style="width:64px;height:64px;flex-shrink:0;border-radius:10px;overflow:hidden;border:1.5px solid #EDE0DA">
                <img :src="item.image || fallback" :alt="item.title"
                  style="width:64px;height:64px;object-fit:cover;display:block" />
              </div>
              <div class="flex-grow-1">
                <div class="font-weight-bold body-2" style="color:#2C1810">{{ item.title }}</div>
                <div class="caption mt-1" style="color:#A1887F">
                  Qty: <strong style="color:#5D4037">{{ item.quantity }}</strong>
                  <span v-if="item.artist"> · by {{ item.artist.name || 'Artist' }}</span>
                </div>
                <div class="caption" style="color:#A1887F">Unit: ₹{{ Number(item.price).toLocaleString('en-IN') }}</div>
              </div>
              <div class="font-weight-black" style="color:#5D4037;font-family:'Georgia',serif;flex-shrink:0">
                ₹{{ Number(item.price * item.quantity).toLocaleString('en-IN') }}
              </div>
            </div>
            <v-divider class="my-3" />
            <div class="caption font-weight-bold mb-1" style="color:#A1887F;text-transform:uppercase;letter-spacing:0.06em">
              <v-icon x-small color="#A1887F" class="mr-1">mdi-map-marker-outline</v-icon>Delivery Address
            </div>
            <div class="caption" style="color:#6D4C41;line-height:1.8" v-if="order.address">
              {{ order.address.fullName }} · {{ order.address.line1 }}
              <span v-if="order.address.line2">, {{ order.address.line2 }}</span>
              · {{ order.address.city }}, {{ order.address.state }} - {{ order.address.pincode }}
              · 📞 {{ order.address.phone }}
            </div>
          </v-card-text>

        </v-card>
      </div>
    </v-container>

    <!-- ══════════ TAB: PROFILE ══════════ -->
    <v-container v-if="activeTab === 2" class="py-6" style="max-width:500px">
      <v-card flat style="border-radius:20px;border:1.5px solid #F0E8E4">
        <v-card-text class="pa-8 text-center">
          <v-avatar size="80" color="brown darken-1" class="mb-4">
            <span class="white--text font-weight-black" style="font-size:1.8rem">{{ initials }}</span>
          </v-avatar>
          <div class="font-weight-black mb-1" style="font-family:'Georgia',serif;font-size:1.5rem;color:#2C1810">
            {{ user && user.name }}
          </div>
          <div class="body-2 mb-3" style="color:#A1887F">{{ user && user.email }}</div>
          <v-chip small color="brown lighten-4" text-color="brown darken-3" class="font-weight-bold mb-6">
            <v-icon x-small left>mdi-account</v-icon>
            {{ user && user.role === 'artist' ? 'Artist' : 'Buyer' }}
          </v-chip>
          <v-divider class="mb-6" />
          <v-list dense>
            <v-list-item link to="/cart">
              <v-list-item-icon><v-icon color="brown darken-1">mdi-cart-outline</v-icon></v-list-item-icon>
              <v-list-item-title class="font-weight-medium" style="color:#5D4037">My Cart</v-list-item-title>
              <v-list-item-action v-if="cartCount > 0">
                <v-chip x-small color="brown darken-1" dark>{{ cartCount }}</v-chip>
              </v-list-item-action>
            </v-list-item>
            <v-list-item link @click="activeTab=1">
              <v-list-item-icon><v-icon color="brown darken-1">mdi-package-variant-closed</v-icon></v-list-item-icon>
              <v-list-item-title class="font-weight-medium" style="color:#5D4037">My Orders</v-list-item-title>
            </v-list-item>
            <v-list-item link to="/chat">
              <v-list-item-icon><v-icon color="brown darken-1">mdi-chat-outline</v-icon></v-list-item-icon>
              <v-list-item-title class="font-weight-medium" style="color:#5D4037">Messages</v-list-item-title>
            </v-list-item>
            <v-divider class="my-2" />
            <v-list-item link @click="handleLogout">
              <v-list-item-icon><v-icon color="red darken-2">mdi-logout</v-icon></v-list-item-icon>
              <v-list-item-title class="font-weight-medium red--text text--darken-2">Sign Out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- ══ TAB 3: MESSAGES ══ -->
    <v-container v-if="activeTab === 3" class="pb-16 pt-0" style="max-width:1100px">
      <v-card flat style="border-radius:16px;border:1.5px solid #F0E8E4;overflow:hidden">
        <chat-panel :is-artist="false" />
      </v-card>
    </v-container>

    <!-- Toast -->
    <v-snackbar v-model="toast.show" :color="toast.color" top right timeout="3000">
      <v-icon left size="16">{{ toast.icon }}</v-icon>{{ toast.msg }}
      <template v-slot:action="{ attrs }">
        <v-btn text small v-bind="attrs" @click="toast.show=false">Close</v-btn>
      </template>
    </v-snackbar>

  </v-app>
</template>

<script>
import ArtworkCard  from '@/components/ui/ArtworkCard.vue'
import ChatPanel    from '@/components/ui/ChatPanel.vue'
import likeService  from '@/services/likeService'
import orderService from '@/services/orderService'

export default {
  name: 'UserDashboardView',
  components: { ArtworkCard, ChatPanel },

  data: function() {
    return {
      activeTab:     0,
      likedArtworks: [],
      likedLoading:  false,
      orders:        [],
      ordersLoading: false,
      fallback: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80',
      toast: { show: false, msg: '', color: 'success', icon: 'mdi-check' },
    }
  },

  computed: {
    user:      function() { return this.$store.getters['auth/currentUser'] },
    cartCount: function() { return this.$store.getters['cart/cartCount'] },
    initials:  function() {
      var n = this.user && this.user.name
      if (!n) return '?'
      var parts = n.trim().split(' ')
      if (parts.length >= 2) return (parts[0][0] + parts[parts.length-1][0]).toUpperCase()
      return parts[0][0].toUpperCase()
    },
    activeOrders: function() {
      return this.orders.filter(function(o) { return o.status === 'pending' }).length
    },
  },

  watch: {
    activeTab: function(val) {
      if (val === 1 && this.orders.length === 0) this.fetchOrders()
    },
  },

  created: function() {
    this.fetchLiked()
    this.$store.dispatch('cart/fetchCart')
    this.fetchOrders()
  },

  methods: {
    fetchLiked: function() {
      var self = this
      self.likedLoading = true
      likeService.getUserLikes()
        .then(function(res) { self.likedArtworks = res.data || [] })
        .catch(function() {})
        .finally(function() { self.likedLoading = false })
    },

    // ✦ called when ArtworkCard emits @unlike ✦
    removeLike: function(art) {
      var self = this
      var id = art._id || art.id
      likeService.unlike(id)
        .then(function() {
          self.likedArtworks = self.likedArtworks.filter(function(item) {
            var itemId = (item.artwork && item.artwork._id) || item._id
            return String(itemId) !== String(id)
          })
          self.notify('Removed from likes', '#795548', 'mdi-heart-off-outline')
        })
        .catch(function() { self.notify('Could not remove like', 'error', 'mdi-alert') })
    },

    fetchOrders: function() {
      var self = this
      self.ordersLoading = true
      orderService.getMyOrders()
        .then(function(res) { self.orders = res.data || [] })
        .catch(function() {})
        .finally(function() { self.ordersLoading = false })
    },

    statusColor: function(status) {
      var map = {
        pending:    { bg: 'orange lighten-4', text: 'orange darken-3', icon: 'mdi-clock-outline',          label: 'Pending'    },
        paid:       { bg: 'green lighten-4',  text: 'green darken-3',  icon: 'mdi-check-circle-outline',   label: 'Paid'       },
        on_the_way: { bg: 'blue lighten-4',   text: 'blue darken-3',   icon: 'mdi-truck-delivery-outline', label: 'On the Way' },
        delivered:  { bg: 'teal lighten-4',   text: 'teal darken-3',   icon: 'mdi-home-check-outline',     label: 'Delivered'  },
        cancelled:  { bg: 'red lighten-4',    text: 'red darken-3',    icon: 'mdi-close-circle-outline',   label: 'Cancelled'  },
      }
      return map[status] || map.pending
    },

    orderSteps: function(status) {
      if (status === 'cancelled') {
        return [
          { label: 'Order Placed', icon: 'mdi-check',        done: true,  active: false },
          { label: 'Cancelled',    icon: 'mdi-close-circle', done: false, active: true  },
          { label: 'Refund',       icon: 'mdi-cash-refund',  done: false, active: false },
        ]
      }
      var order = ['pending', 'paid', 'on_the_way', 'delivered']
      var cur   = order.indexOf(status)
      return [
        { label: 'Ordered',    icon: 'mdi-check',                done: cur >= 0, active: cur === 0 },
        { label: 'Paid',       icon: 'mdi-check-circle-outline', done: cur >= 1, active: cur === 1 },
        { label: 'On the Way', icon: 'mdi-truck-delivery',       done: cur >= 2, active: cur === 2 },
        { label: 'Delivered',  icon: 'mdi-home-check-outline',   done: cur >= 3, active: cur === 3 },
      ]
    },

    formatDate: function(d) {
      if (!d) return ''
      return new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
    },

    handleLogout: function() {
      this.$store.dispatch('auth/logout')
      this.$router.push('/')
    },

    notify: function(msg, color, icon) {
      this.toast = { show: true, msg: msg, color: color || 'success', icon: icon || 'mdi-check' }
    },
  },
}
</script>