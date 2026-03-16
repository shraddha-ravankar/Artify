<template>
  <v-container fluid :style="{ background: '#F8F3F0', minHeight: '100vh' }" class="pa-0">
    <v-container class="py-10">

      <!-- ── heading ── -->
      <v-row class="mb-6" align="center">
        <v-col>
          <div :style="{ fontFamily: '\'Playfair Display\', serif', fontSize: '32px', fontWeight: '700', color: '#3E2723' }">
            My Orders
          </div>
          <div :style="{ color: '#8D6E63', fontSize: '14px', marginTop: '4px' }">
            Your purchase history
          </div>
        </v-col>
        <v-col cols="auto">
          <v-btn outlined small color="brown darken-1" to="/explore"
            :style="{ borderRadius: '50px', textTransform: 'none', fontWeight: '600' }">
            <v-icon left size="15">mdi-brush</v-icon>
            Explore more
          </v-btn>
        </v-col>
      </v-row>

      <!-- ── loading ── -->
      <v-row v-if="loading" justify="center" class="py-16">
        <v-progress-circular indeterminate color="brown darken-2" size="48" />
      </v-row>

      <!-- ── empty ── -->
      <v-row v-else-if="!orders.length" justify="center" class="py-16">
        <v-col cols="12" class="text-center">
          <v-icon size="80" color="brown lighten-3">mdi-package-variant</v-icon>
          <div :style="{ fontFamily: '\'Playfair Display\', serif', fontSize: '24px', color: '#5D4037', margin: '16px 0 8px' }">
            No orders yet
          </div>
          <div :style="{ color: '#A1887F', marginBottom: '28px' }">
            When you buy an artwork, your orders will appear here
          </div>
          <v-btn depressed large color="brown darken-2" dark to="/explore"
            :style="{ borderRadius: '50px', textTransform: 'none', fontWeight: '600' }">
            Start Exploring
          </v-btn>
        </v-col>
      </v-row>

      <!-- ── orders list ── -->
      <v-row v-else>
        <v-col cols="12" md="8" offset-md="2">

          <v-card
            v-for="order in orders"
            :key="order._id"
            flat outlined class="mb-5"
            :style="{ borderRadius: '20px', borderColor: '#E0D4CF', overflow: 'hidden' }"
          >

            <!-- order header bar -->
            <div class="d-flex align-center justify-space-between flex-wrap pa-4"
              :style="{ background: '#EFEBE9', gap: '10px' }">

              <div>
                <div class="d-flex align-center" style="gap:8px">
                  <v-icon size="15" color="#8D6E63">mdi-receipt</v-icon>
                  <span :style="{ fontWeight:'700', color:'#3E2723', fontSize:'15px', fontFamily:'monospace', letterSpacing:'0.5px' }">
                    Order #{{ order._id.slice(-8).toUpperCase() }}
                  </span>
                </div>
                <div class="d-flex align-center mt-1" style="gap:6px">
                  <v-icon size="13" color="#BCAAA4">mdi-calendar-outline</v-icon>
                  <span :style="{ color:'#8D6E63', fontSize:'12px' }">{{ formatDate(order.createdAt) }}</span>
                </div>
              </div>

              <v-chip small
                :color="statusColor(order.status).bg"
                :text-color="statusColor(order.status).text"
                :style="{ fontWeight:'700', fontSize:'12px', borderRadius:'50px' }">
                <v-icon left size="12">{{ statusColor(order.status).icon }}</v-icon>
                {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
              </v-chip>
            </div>

            <v-divider />

            <!-- artwork line items -->
            <div class="pa-4">
              <div
                v-for="(item, idx) in order.items"
                :key="item._id || idx"
                class="d-flex align-center justify-space-between py-3"
                :style="{ borderBottom: idx < order.items.length - 1 ? '1px dashed #E0D4CF' : 'none' }"
              >
                <!-- left: icon + info -->
                <div class="d-flex align-center" style="gap:12px; flex:1">
                  <v-avatar size="38" color="brown lighten-4" rounded>
                    <v-icon size="20" color="brown darken-1">mdi-image-frame</v-icon>
                  </v-avatar>

                  <div>
                    <!-- artwork title → clickable → goes to detail page -->
                    <div
                      :style="{
                        fontFamily: '\'Playfair Display\', serif',
                        fontWeight: '600',
                        color: '#2C1810',
                        fontSize: '14px',
                        cursor: item.artwork ? 'pointer' : 'default',
                        textDecoration: item.artwork ? 'underline' : 'none',
                        textDecorationColor: '#BCAAA4',
                        textUnderlineOffset: '3px',
                      }"
                      @click="item.artwork && goToArtwork(item.artwork._id || item.artwork)"
                    >
                      {{ item.title }}
                    </div>

                    <div class="d-flex align-center mt-1" style="gap:8px">
                      <!-- artist name -->
                      <span v-if="item.artist && item.artist.name"
                        :style="{ color:'#A1887F', fontSize:'12px' }">
                        <v-icon size="11" color="#BCAAA4">mdi-account-outline</v-icon>
                        {{ item.artist.name }}
                      </span>
                      <!-- qty -->
                      <v-chip x-small color="#EFEBE9" text-color="#6D4C41"
                        :style="{ fontWeight:'600' }">
                        Qty: {{ item.quantity }}
                      </v-chip>
                    </div>
                  </div>
                </div>

                <!-- right: price -->
                <div :style="{ fontWeight:'700', color:'#5D4037', fontSize:'15px', flexShrink:0 }">
                  ₹{{ (item.price * item.quantity).toLocaleString('en-IN') }}
                </div>
              </div>
            </div>

            <v-divider />

            <!-- footer: payment + address + total -->
            <div class="pa-4 d-flex align-center justify-space-between flex-wrap" style="gap:10px">

              <div class="d-flex align-center flex-wrap" style="gap:12px">
                <v-chip x-small
                  :color="order.paymentMethod === 'cod' ? 'green lighten-4' : 'blue lighten-4'"
                  :text-color="order.paymentMethod === 'cod' ? 'green darken-3' : 'blue darken-3'"
                  :style="{ fontWeight:'600' }">
                  <v-icon left size="11">{{ order.paymentMethod === 'cod' ? 'mdi-cash' : 'mdi-lightning-bolt' }}</v-icon>
                  {{ order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online' }}
                </v-chip>

                <div v-if="order.address" class="d-flex align-center" style="gap:4px">
                  <v-icon size="13" color="#BCAAA4">mdi-map-marker-outline</v-icon>
                  <span :style="{ color:'#8D6E63', fontSize:'12px' }">
                    {{ order.address.city }}, {{ order.address.state }}
                  </span>
                </div>
              </div>

              <!-- total -->
              <div class="d-flex align-center" style="gap:6px">
                <span :style="{ color:'#8D6E63', fontSize:'13px', fontWeight:'600' }">Total:</span>
                <span :style="{ fontFamily:'\'Playfair Display\',serif', fontWeight:'800', fontSize:'20px', color:'#3E2723' }">
                  ₹{{ Number(order.totalPrice).toLocaleString('en-IN') }}
                </span>
              </div>
            </div>

          </v-card>

        </v-col>
      </v-row>

    </v-container>

    <v-snackbar v-model="snack.show" :color="snack.color" top right timeout="3000">
      <v-icon left size="16">{{ snack.icon }}</v-icon>
      {{ snack.msg }}
    </v-snackbar>

  </v-container>
</template>

<script>
import orderService from '@/services/orderService'

export default {
  name: 'OrdersView',

  data: () => ({
    orders:  [],
    loading: true,
    snack: { show: false, msg: '', color: 'success', icon: 'mdi-check' },
  }),

  created() {
    this.fetchOrders()
  },

  methods: {

    async fetchOrders() {
      this.loading = true
      try {
        const { data } = await orderService.getMyOrders()
        this.orders = data
      } catch (e) {
        this.snack = { show: true, msg: 'Could not load orders', color: 'error', icon: 'mdi-alert' }
      } finally {
        this.loading = false
      }
    },

    /* navigate to artwork detail page */
    goToArtwork(artworkId) {
      if (!artworkId) return
      this.$router.push({ name: 'ArtworkDetail', params: { id: artworkId } })
    },

    statusColor(status) {
      const map = {
        pending:   { bg: '#FFF8E1', text: '#F57F17', icon: 'mdi-clock-outline' },
        paid:      { bg: '#E8F5E9', text: '#2E7D32', icon: 'mdi-check-circle-outline' },
        cancelled: { bg: '#FFEBEE', text: '#C62828', icon: 'mdi-close-circle-outline' },
      }
      return map[status] || map.pending
    },

    formatDate(ts) {
      if (!ts) return ''
      return new Date(ts).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    },
  },
}
</script>