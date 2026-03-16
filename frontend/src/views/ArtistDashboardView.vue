<template>
  <v-app style="background:#F8F3F0">

    <!-- HEADER -->
    <v-sheet dark color="brown darken-3" class="py-7">
      <v-container>
        <v-row align="center" justify="space-between" no-gutters>
          <v-row align="center" no-gutters class="flex-grow-1">
            <v-avatar color="brown darken-1" size="48" class="mr-4" style="border:2px solid rgba(255,255,255,0.2)">
              <v-icon color="white" size="24">mdi-palette</v-icon>
            </v-avatar>
            <div>
              <div class="text-h5 font-weight-black white--text" style="font-family:'Georgia',serif;line-height:1.2">Artist Dashboard</div>
              <div class="body-2 mt-1" style="color:rgba(255,255,255,0.6)">
                Welcome back, <strong style="color:#FFCCBC">{{ userName }}</strong>
                &nbsp;·&nbsp;
                <span style="color:rgba(255,255,255,0.4)">{{ artworks.length }} artwork{{ artworks.length !== 1 ? 's' : '' }}</span>
              </div>
            </div>
          </v-row>
          <v-btn outlined rounded color="white" class="font-weight-bold"
            style="letter-spacing:0;border-color:rgba(255,255,255,0.3);background:rgba(255,255,255,0.12)"
            @click="openUpload">
            <v-icon left size="18">mdi-plus</v-icon>Upload Artwork
          </v-btn>
        </v-row>
      </v-container>
    </v-sheet>

    <!-- STATS -->
    <v-container class="pt-6 pb-2">
      <v-row>
        <v-col v-for="stat in stats" :key="stat.label" cols="6" sm="3" class="pa-2">
          <v-card flat style="border-radius:16px;border:1.5px solid #F0E8E4;cursor:pointer"
            @click="stat.tab !== null ? activeTab = stat.tab : null">
            <v-card-text class="pa-4">
              <v-row align="center" no-gutters>
                <v-avatar size="44" :color="stat.bg" class="mr-3" style="border-radius:12px">
                  <v-icon :color="stat.color" size="20">{{ stat.icon }}</v-icon>
                </v-avatar>
                <div>
                  <div class="font-weight-black" style="font-family:'Georgia',serif;font-size:1.35rem;color:#2C1810;line-height:1">{{ stat.value }}</div>
                  <div class="caption" style="color:#A1887F;text-transform:uppercase;letter-spacing:0.06em">{{ stat.label }}</div>
                </div>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- TABS -->
    <v-container class="pt-4 pb-0">
      <v-tabs v-model="activeTab" color="brown darken-2" background-color="transparent" slider-color="brown darken-2">
        <v-tab style="font-weight:700;text-transform:capitalize;letter-spacing:0">
          <v-icon left size="18">mdi-image-multiple-outline</v-icon>My Artworks
        </v-tab>
        <v-tab style="font-weight:700;text-transform:capitalize;letter-spacing:0">
          <v-icon left size="18">mdi-package-variant-closed</v-icon>Orders
          <v-badge v-if="pendingOrdersCount > 0" :content="String(pendingOrdersCount)" color="red darken-1" class="ml-2" inline />
        </v-tab>
        <v-tab style="font-weight:700;text-transform:capitalize;letter-spacing:0">
          <v-icon left size="18">mdi-chat-outline</v-icon>Messages
          <v-badge v-if="unreadChats > 0" :content="String(unreadChats)" color="blue darken-2" class="ml-2" inline />
        </v-tab>
      </v-tabs>
      <v-divider />
    </v-container>

    <!-- ══ TAB 0: ARTWORKS ══ -->
    <v-container v-if="activeTab === 0" class="pb-16 pt-4">
      <v-row align="center" justify="space-between" no-gutters class="mb-4" style="flex-wrap:wrap;gap:12px">
        <v-row align="center" no-gutters style="gap:10px;flex:0 0 auto">
          <span class="font-weight-black" style="font-family:'Georgia',serif;font-size:1.2rem;color:#5D4037">My Artworks</span>
          <v-chip small outlined color="brown darken-1" class="font-weight-bold">{{ filteredArtworks.length }}</v-chip>
        </v-row>
        <v-row align="center" no-gutters style="gap:10px;flex-wrap:wrap;flex:0 0 auto">
          <v-text-field v-model="searchQuery" dense outlined hide-details placeholder="Search…"
            prepend-inner-icon="mdi-magnify" color="brown darken-2" background-color="white" style="width:200px" />
          
        </v-row>
      </v-row>

      <v-row v-if="loading">
        <v-col v-for="n in 8" :key="'sk'+n" cols="12" sm="6" md="4" lg="3">
          <v-card flat style="border-radius:18px;border:1.5px solid #F0E8E4;overflow:hidden">
            <v-skeleton-loader type="image, article" />
          </v-card>
        </v-col>
      </v-row>

      <v-row v-else-if="loadError" justify="center">
        <v-col cols="12" class="text-center py-16">
          <v-icon size="48" color="red lighten-3" class="mb-3">mdi-alert-circle-outline</v-icon>
          <div class="body-1 mb-4" style="color:#A1887F">{{ loadError }}</div>
          <v-btn rounded outlined color="brown darken-1" class="font-weight-bold" style="letter-spacing:0" @click="fetchArtworks">
            <v-icon left size="16">mdi-refresh</v-icon>Retry
          </v-btn>
        </v-col>
      </v-row>

      <v-row v-else-if="artworks.length === 0" justify="center">
        <v-col cols="12" class="text-center py-16">
          <v-avatar size="90" color="brown lighten-5" style="border:2px solid #D7CCC8" class="mb-5">
            <v-icon size="52" color="brown lighten-3">mdi-image-plus-outline</v-icon>
          </v-avatar>
          <div class="mb-2 font-weight-black" style="font-family:'Georgia',serif;font-size:1.5rem;color:#5D4037">No artworks yet</div>
          <div class="body-2 mb-6" style="color:#A1887F">Upload your first artwork and start selling</div>
          <v-btn rounded depressed dark color="brown darken-1" class="font-weight-bold" style="letter-spacing:0" @click="openUpload">
            <v-icon left size="16">mdi-plus</v-icon>Upload First Artwork
          </v-btn>
        </v-col>
      </v-row>

      <v-row v-else>
        <v-col v-for="art in filteredArtworks" :key="art._id" cols="12" sm="6" md="4" lg="3">
          <v-card flat
            style="border-radius:18px;border:1.5px solid #F0E8E4;overflow:hidden;transition:transform 0.25s,box-shadow 0.25s"
            :style="hoveredId===art._id?'transform:translateY(-5px);box-shadow:0 16px 40px rgba(93,64,55,0.16)':'box-shadow:0 3px 16px rgba(93,64,55,0.08)'"
            @mouseover="hoveredId=art._id" @mouseleave="hoveredId=null">
            <v-img :src="art.image||fallback" aspect-ratio="1.333"
              style="transition:transform 0.4s ease"
              :style="hoveredId===art._id?'transform:scale(1.06)':''">
              <template v-slot:placeholder>
                <v-row class="fill-height" align="center" justify="center">
                  <v-progress-circular indeterminate color="brown lighten-3" size="28"/>
                </v-row>
              </template>
              <v-chip v-if="art.isFeatured" x-small dark
                style="position:absolute;top:10px;left:10px;background:rgba(93,64,55,0.85);font-weight:700;font-size:0.6rem">
                <v-icon x-small left color="#FFF9C4">mdi-star</v-icon>
                <span style="color:#FFF9C4">Featured</span>
              </v-chip>
              <v-chip v-if="art.type" x-small
                style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.42);color:rgba(255,255,255,0.9);font-size:0.6rem">
                {{ art.type }}
              </v-chip>
            </v-img>
            <v-card-text class="pa-4">
              <div class="font-weight-black mb-1" style="font-family:'Georgia',serif;font-size:0.97rem;color:#2C1810;overflow:hidden;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical">{{ art.title }}</div>
              <div class="caption mb-2" style="color:#A1887F;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">{{ art.description }}</div>
              <div class="font-weight-black mb-2" style="font-family:'Georgia',serif;font-size:1.1rem;color:#5D4037">₹{{ Number(art.price||0).toLocaleString('en-IN') }}</div>
              <v-row align="center" justify="space-between" no-gutters class="mb-3">
                <v-row align="center" no-gutters>
                  <v-icon x-small color="#BCAAA4" class="mr-1">mdi-heart-outline</v-icon>
                  <span class="caption" style="color:#A1887F">{{ art.likes||0 }} likes</span>
                </v-row>
                <span class="caption" style="color:#A1887F">{{ formatDate(art.createdAt) }}</span>
              </v-row>
              <v-row no-gutters style="gap:8px">
                <v-btn outlined small color="brown darken-1" class="font-weight-bold flex-grow-1"
                  style="border-radius:10px;letter-spacing:0;background:#EFEBE9" @click="openEdit(art)">
                  <v-icon x-small left>mdi-pencil-outline</v-icon>Edit
                </v-btn>
                <v-btn outlined small color="red lighten-1" class="font-weight-bold flex-grow-1"
                  style="border-radius:10px;letter-spacing:0;background:#FFF5F5"
                  :loading="deletingId===art._id" @click="confirmDelete(art)">
                  <v-icon x-small left>mdi-trash-can-outline</v-icon>Delete
                </v-btn>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- ══ TAB 1: ORDERS ══ -->
    <v-container v-if="activeTab === 1" class="pb-16 pt-4">
      <v-row align="center" justify="space-between" no-gutters class="mb-5">
        <div>
          <span class="font-weight-black" style="font-family:'Georgia',serif;font-size:1.2rem;color:#5D4037">Orders for Your Artworks</span>
          <div class="caption mt-1" style="color:#A1887F">{{ orders.length }} total · {{ pendingOrdersCount }} pending</div>
        </div>
        <v-btn icon small @click="fetchOrders" :loading="ordersLoading">
          <v-icon color="brown darken-1">mdi-refresh</v-icon>
        </v-btn>
      </v-row>

      <v-row v-if="ordersLoading" justify="center" class="py-10">
        <v-progress-circular indeterminate color="brown darken-1" size="40"/>
      </v-row>

      <v-row v-else-if="orders.length === 0" justify="center">
        <v-col cols="12" class="text-center py-16">
          <v-avatar size="90" color="brown lighten-5" style="border:2px solid #D7CCC8" class="mb-5">
            <v-icon size="52" color="brown lighten-3">mdi-package-variant-closed</v-icon>
          </v-avatar>
          <div class="font-weight-black mb-2" style="font-family:'Georgia',serif;font-size:1.5rem;color:#5D4037">No orders yet</div>
          <div class="body-2" style="color:#A1887F">When users buy your artworks, orders will appear here</div>
        </v-col>
      </v-row>

      <div v-else>
        <v-card v-for="order in orders" :key="order._id" flat class="mb-4"
          style="border-radius:16px;border:1.5px solid #F0E8E4;overflow:hidden">

          <!-- Order header row -->
          <v-sheet color="brown lighten-5" class="pa-4">
            <v-row align="center" no-gutters style="flex-wrap:wrap;gap:16px">

              <!-- Order ID -->
              <div style="min-width:110px">
                <div class="caption font-weight-bold" style="color:#A1887F;text-transform:uppercase;letter-spacing:0.06em">Order</div>
                <div class="font-weight-black caption" style="color:#2C1810;font-family:monospace;font-size:0.82rem">
                  #{{ order._id.toString().slice(-8).toUpperCase() }}
                </div>
              </div>

              <!-- Buyer -->
              <div style="min-width:100px">
                <div class="caption font-weight-bold" style="color:#A1887F;text-transform:uppercase;letter-spacing:0.06em">Buyer</div>
                <div class="font-weight-bold body-2" style="color:#2C1810">{{ order.user && order.user.name || 'Unknown' }}</div>
              </div>

              <!-- Amount -->
              <div style="min-width:80px">
                <div class="caption font-weight-bold" style="color:#A1887F;text-transform:uppercase;letter-spacing:0.06em">Amount</div>
                <div class="font-weight-black" style="font-family:'Georgia',serif;font-size:1.05rem;color:#5D4037">
                  ₹{{ Number(order.totalPrice||0).toLocaleString('en-IN') }}
                </div>
              </div>

              <!-- Date -->
              <div style="min-width:90px">
                <div class="caption font-weight-bold" style="color:#A1887F;text-transform:uppercase;letter-spacing:0.06em">Date</div>
                <div class="caption" style="color:#6D4C41">{{ formatDate(order.createdAt) }}</div>
              </div>

              <!-- Status chip -->
              <div>
                <div class="caption font-weight-bold mb-1" style="color:#A1887F;text-transform:uppercase;letter-spacing:0.06em">Status</div>
                <v-chip small :color="statusConfig(order.status).bg" :text-color="statusConfig(order.status).text" class="font-weight-bold">
                  <v-icon x-small left>{{ statusConfig(order.status).icon }}</v-icon>
                  {{ statusConfig(order.status).label }}
                </v-chip>
              </div>

              <v-spacer />

              <!-- Update Status dropdown -->
              <v-menu offset-y rounded="lg" :close-on-content-click="true">
                <template v-slot:activator="{ on }">
                  <v-btn small depressed color="brown darken-1" dark
                    style="border-radius:10px;letter-spacing:0;font-weight:600" v-on="on"
                    :loading="updatingOrderId === order._id">
                    Update Status <v-icon right size="14">mdi-chevron-down</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item
                    v-for="s in statusOptions"
                    :key="s.value"
                    @click="updateStatus(order, s.value)"
                    :disabled="order.status === s.value">
                    <v-list-item-icon>
                      <v-icon small :color="s.color">{{ s.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="font-weight-medium" style="font-size:0.875rem">
                      {{ s.label }}
                    </v-list-item-title>
                    <v-list-item-action v-if="order.status === s.value">
                      <v-icon small color="brown darken-1">mdi-check</v-icon>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-menu>

            </v-row>
          </v-sheet>

          <!-- Items list — small proper thumbnails -->
          <v-card-text class="pa-4">
            <div
              v-for="item in order.items"
              :key="item._id"
              class="d-flex align-center mb-3"
              style="gap:14px;padding:10px;background:#FDFAF8;border-radius:12px;border:1px solid #F0E8E4"
            >
              <!-- Square thumbnail -->
              <div style="width:64px;height:64px;flex-shrink:0;border-radius:10px;overflow:hidden;border:1.5px solid #EDE0DA">
                <img
                  :src="item.image || fallback"
                  :alt="item.title"
                  style="width:64px;height:64px;object-fit:cover;display:block"
                />
              </div>

              <!-- Info -->
              <div class="flex-grow-1" style="min-width:0">
                <div class="font-weight-bold" style="color:#2C1810;font-size:0.9rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                  {{ item.title }}
                </div>
                <div class="caption mt-1" style="color:#A1887F">
                  Quantity: <strong style="color:#5D4037">{{ item.quantity }}</strong>
                </div>
                <div class="caption" style="color:#A1887F">
                  Unit price: ₹{{ Number(item.price).toLocaleString('en-IN') }}
                </div>
              </div>

              <!-- Total -->
              <div style="flex-shrink:0;text-align:right">
                <div class="font-weight-black" style="font-family:'Georgia',serif;font-size:1rem;color:#5D4037">
                  ₹{{ Number(item.price * item.quantity).toLocaleString('en-IN') }}
                </div>
              </div>
            </div>

            <!-- Delivery address -->
            <v-divider class="my-3" />
            <v-row align="start" no-gutters style="gap:6px">
              <v-icon size="14" color="#A1887F" class="mt-1">mdi-map-marker-outline</v-icon>
              <div>
                <div class="caption font-weight-bold mb-1" style="color:#A1887F;text-transform:uppercase;letter-spacing:0.06em">Delivery Address</div>
                <div class="caption" style="color:#6D4C41;line-height:1.8" v-if="order.address">
                  <strong>{{ order.address.fullName }}</strong> ·
                  {{ order.address.line1 }}<span v-if="order.address.line2">, {{ order.address.line2 }}</span> ·
                  {{ order.address.city }}, {{ order.address.state }} — {{ order.address.pincode }} ·
                  <v-icon size="12" color="#8D6E63">mdi-phone-outline</v-icon> {{ order.address.phone }}
                </div>
              </div>
            </v-row>
          </v-card-text>

        </v-card>
      </div>
    </v-container>

    <!-- ══ TAB 2: MESSAGES ══ -->
    <v-container v-if="activeTab === 2" class="pb-16 pt-0" style="max-width:1100px">
      <v-card flat style="border-radius:16px;border:1.5px solid #F0E8E4;overflow:hidden">
        <chat-panel :is-artist="true" ref="chatPanel" />
      </v-card>
    </v-container>

    <!-- DIALOGS -->
    <artwork-form-dialog v-model="dialogOpen" :artwork="editingArtwork" @saved="onSaved" />

    <v-dialog v-model="deleteDialog" max-width="420" persistent>
      <v-card style="border-radius:20px" class="pa-8 text-center">
        <v-avatar size="68" color="red lighten-5" style="border:2px solid #FFCDD2" class="mb-5">
          <v-icon size="32" color="red lighten-1">mdi-trash-can-outline</v-icon>
        </v-avatar>
        <div class="font-weight-black mb-3" style="font-family:'Georgia',serif;font-size:1.3rem;color:#2C1810">Delete Artwork?</div>
        <div class="body-2 mb-7" style="color:#6D4C41;line-height:1.7">
          "<strong>{{ deletingArt && deletingArt.title }}</strong>" will be permanently removed.
        </div>
        <v-row justify="center" no-gutters style="gap:10px">
          <v-btn rounded outlined color="brown darken-1" class="font-weight-bold" style="letter-spacing:0"
            :disabled="deletingId !== null" @click="deleteDialog=false">Cancel</v-btn>
          <v-btn rounded depressed dark color="red lighten-1" class="font-weight-bold" style="letter-spacing:0"
            :loading="deletingId !== null" @click="doDelete">
            <v-icon left size="15">mdi-trash-can-outline</v-icon>Yes, Delete
          </v-btn>
        </v-row>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="toast.show" :color="toast.color" top right timeout="3000">
      <v-icon left size="16">{{ toast.icon }}</v-icon>{{ toast.msg }}
      <template v-slot:action="{ attrs }">
        <v-btn text small v-bind="attrs" @click="toast.show=false">Close</v-btn>
      </template>
    </v-snackbar>

  </v-app>
</template>

<script>
import artworkService    from '@/services/artworkService'
import orderService      from '@/services/orderService'
import ArtworkFormDialog from '@/components/ui/ArtworkFormDialog.vue'
import ChatPanel        from '@/components/ui/ChatPanel.vue'
import chatService      from '@/services/chatService'

export default {
  name: 'ArtistDashboardView',
  components: { ArtworkFormDialog, ChatPanel },

  data: function() {
    return {
      activeTab:       0,
      artworks:        [],
      loading:         true,
      loadError:       '',
      searchQuery:     '',
      sortBy:          'newest',
      hoveredId:       null,
      dialogOpen:      false,
      editingArtwork:  null,
      deleteDialog:    false,
      deletingArt:     null,
      deletingId:      null,
      orders:          [],
      ordersLoading:   false,
      updatingOrderId: null,
      fallback: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80',
      toast: { show: false, msg: '', color: 'success', icon: 'mdi-check' },
      unreadChats: 0,
      statusOptions: [
        { value: 'pending',    label: 'Pending',     icon: 'mdi-clock-outline',          color: 'orange darken-2' },
        { value: 'paid',       label: 'Paid',         icon: 'mdi-check-circle-outline',   color: 'green darken-2'  },
        { value: 'on_the_way', label: 'On the Way',   icon: 'mdi-truck-delivery-outline', color: 'blue darken-2'   },
        { value: 'delivered',  label: 'Delivered',    icon: 'mdi-home-check-outline',     color: 'teal darken-2'   },
        { value: 'cancelled',  label: 'Cancelled',    icon: 'mdi-close-circle-outline',   color: 'red darken-2'    },
      ],
    }
  },

  computed: {
    userName: function() {
      var u = this.$store.getters['auth/currentUser']
      return u && u.name ? u.name : 'Artist'
    },
    pendingOrdersCount: function() {
      return this.orders.filter(function(o) { return o.status === 'pending' }).length
    },
    stats: function() {
      var total    = this.artworks.length
      var likes    = this.artworks.reduce(function(s, a) { return s + (a.likes || 0) }, 0)
      var pending  = this.pendingOrdersCount
      return [
        { label: 'Total Artworks', value: total,           icon: 'mdi-image-multiple-outline',  color: '#5D4037', bg: '#EFEBE9', tab: null },
        { label: 'Messages',       value: this.unreadChats, icon: 'mdi-chat-outline',            color: '#1565C0', bg: '#E3F2FD', tab: 2    },
        { label: 'Total Likes',    value: likes,    icon: 'mdi-heart-outline',           color: '#E53935', bg: '#FFEBEE', tab: null },
        { label: 'New Orders',     value: pending,  icon: 'mdi-package-variant-closed',  color: '#2E7D32', bg: '#E8F5E9', tab: 1    },
      ]
    },
    filteredArtworks: function() {
      var list = this.artworks.slice()
      var q = this.searchQuery.trim().toLowerCase()
      if (q) {
        list = list.filter(function(a) {
          return a.title.toLowerCase().indexOf(q) !== -1 ||
            (a.description && a.description.toLowerCase().indexOf(q) !== -1)
        })
      }
      if (this.sortBy === 'oldest')     list.sort(function(a,b){ return new Date(a.createdAt)-new Date(b.createdAt) })
      if (this.sortBy === 'price_high') list.sort(function(a,b){ return b.price-a.price })
      if (this.sortBy === 'price_low')  list.sort(function(a,b){ return a.price-b.price })
      return list
    },
  },

  watch: {
    activeTab: function(val) {
      if (val === 1 && this.orders.length === 0) this.fetchOrders()
      if (val === 2) { this.unreadChats = 0 }
    },
  },

  created: function() { this.fetchArtworks(); this.fetchOrders(); this.fetchUnreadChats() },

  methods: {
    fetchArtworks: function() {
      var self = this
      self.loading = true; self.loadError = ''
      artworkService.getMyArtworks()
        .then(function(res) {
          self.artworks = Array.isArray(res.data) ? res.data : (res.data.artworks || [])
        })
        .catch(function(err) {
          self.loadError = (err.response && err.response.data && err.response.data.message) || 'Could not load artworks.'
        })
        .finally(function() { self.loading = false })
    },

    fetchUnreadChats: function() {
      var self = this
      chatService.getChats()
        .then(function(res) { self.unreadChats = (res.data || []).length })
        .catch(function() {})
    },

    fetchOrders: function() {
      var self = this
      self.ordersLoading = true
      orderService.getArtistOrders()
        .then(function(res) { self.orders = res.data || [] })
        .catch(function() {})
        .finally(function() { self.ordersLoading = false })
    },

    statusConfig: function(status) {
      var map = {
        pending:    { bg: 'orange lighten-4', text: 'orange darken-3', icon: 'mdi-clock-outline',          label: 'Pending'     },
        paid:       { bg: 'green lighten-4',  text: 'green darken-3',  icon: 'mdi-check-circle-outline',   label: 'Paid'        },
        on_the_way: { bg: 'blue lighten-4',   text: 'blue darken-3',   icon: 'mdi-truck-delivery-outline', label: 'On the Way'  },
        delivered:  { bg: 'teal lighten-4',   text: 'teal darken-3',   icon: 'mdi-home-check-outline',     label: 'Delivered'   },
        cancelled:  { bg: 'red lighten-4',    text: 'red darken-3',    icon: 'mdi-close-circle-outline',   label: 'Cancelled'   },
      }
      return map[status] || map.pending
    },

    updateStatus: function(order, status) {
      var self = this
      self.updatingOrderId = order._id
      orderService.updateStatus(order._id, status)
        .then(function(res) {
          var updated = res.data.order
          var idx = -1
          for (var i = 0; i < self.orders.length; i++) {
            if (self.orders[i]._id === updated._id) { idx = i; break }
          }
          if (idx !== -1) self.$set(self.orders, idx, updated)
          self.notify('Status updated to "' + self.statusConfig(status).label + '"', 'success', 'mdi-check-circle-outline')
        })
        .catch(function() { self.notify('Failed to update status', 'error', 'mdi-alert') })
        .finally(function() { self.updatingOrderId = null })
    },

    openUpload: function() { this.editingArtwork = null; this.dialogOpen = true },
    openEdit:   function(art) { this.editingArtwork = art; this.dialogOpen = true },

    onSaved: function(payload) {
      if (payload.mode === 'create') {
        this.artworks.unshift(payload.artwork)
        this.notify('Artwork uploaded!', 'success', 'mdi-check-circle-outline')
      } else {
        var updated = payload.artwork; var idx = -1
        for (var i = 0; i < this.artworks.length; i++) {
          if (this.artworks[i]._id === updated._id) { idx = i; break }
        }
        if (idx !== -1) this.$set(this.artworks, idx, updated)
        this.notify('Artwork updated!', 'success', 'mdi-check-circle-outline')
      }
    },

    confirmDelete: function(art) { this.deletingArt = art; this.deleteDialog = true },

    doDelete: function() {
      var self = this
      if (!self.deletingArt) return
      self.deletingId = self.deletingArt._id
      artworkService.delete(self.deletingArt._id)
        .then(function() {
          var id = self.deletingArt._id
          self.artworks = self.artworks.filter(function(a) { return a._id !== id })
          self.deleteDialog = false
          self.notify('Artwork deleted.', '#795548', 'mdi-trash-can-outline')
        })
        .catch(function() { self.notify('Delete failed.', 'error', 'mdi-alert') })
        .finally(function() { self.deletingId = null; self.deletingArt = null })
    },

    formatDate: function(d) {
      if (!d) return ''
      return new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
    },

    notify: function(msg, color, icon) {
      this.toast = { show: true, msg: msg, color: color || 'success', icon: icon || 'mdi-check' }
    },
  },
}
</script>