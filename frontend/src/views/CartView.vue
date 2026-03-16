<template>
  <v-container fluid :style="{ background: '#F8F3F0', minHeight: '100vh' }" class="pa-0">
    <v-container class="py-10">

      <!-- ── Page heading ── -->
      <v-row class="mb-6" align="center">
        <v-col>
          <div :style="{ fontFamily: '\'Playfair Display\', serif', fontSize: '32px', fontWeight: '700', color: '#3E2723' }">
            Your Cart
          </div>
          <div :style="{ color: '#8D6E63', fontSize: '14px', marginTop: '4px' }">
            {{ items.length }} item{{ items.length !== 1 ? 's' : '' }} · grouped by artist
          </div>
        </v-col>
        <v-col cols="auto" v-if="items.length">
          <v-btn text small color="red lighten-2" @click="confirmClearAll = true">
            <v-icon left size="15">mdi-trash-can-outline</v-icon>
            Clear all
          </v-btn>
        </v-col>
      </v-row>

      <!-- ── Loading ── -->
      <v-row v-if="loading" justify="center" class="py-16">
        <v-progress-circular indeterminate color="brown darken-2" size="48" />
      </v-row>

      <!-- ── Empty ── -->
      <v-row v-else-if="!items.length" justify="center" class="py-16">
        <v-col cols="12" class="text-center">
          <v-icon size="80" color="brown lighten-3">mdi-cart-outline</v-icon>
          <div :style="{ fontFamily: '\'Playfair Display\', serif', fontSize: '24px', color: '#5D4037', margin: '16px 0 8px' }">
            Your cart is empty
          </div>
          <div :style="{ color: '#A1887F', marginBottom: '28px' }">
            Discover artworks and add them to your cart
          </div>
          <v-btn depressed large color="brown darken-2" dark to="/explore"
            :style="{ borderRadius: '50px', textTransform: 'none', fontWeight: '600' }">
            Explore Artworks
          </v-btn>
        </v-col>
      </v-row>

      <!-- ── Cart content ── -->
      <v-row v-else>

        <!-- LEFT: artist groups -->
        <v-col cols="12" md="8">
          <v-card
            v-for="group in groupedByArtist"
            :key="group.groupKey"
            flat outlined class="mb-6"
            :style="{ borderRadius: '20px', borderColor: '#E0D4CF' }"
          >

            <!-- artist header -->
            <v-card-text class="py-3 px-4" :style="{ background: '#EFEBE9', borderRadius: '20px 20px 0 0' }">
              <div class="d-flex align-center justify-space-between flex-wrap" style="gap:10px">

                <div class="d-flex align-center" style="gap:10px">
                  <v-avatar size="38" color="brown darken-1">
                    <span :style="{ color:'white', fontWeight:'700', fontSize:'16px' }">
                      {{ group.artistName.charAt(0).toUpperCase() }}
                    </span>
                  </v-avatar>
                  <div>
                    <div :style="{ fontFamily:'\'Playfair Display\',serif', fontWeight:'700', color:'#3E2723', fontSize:'16px' }">
                      {{ group.artistName }}
                    </div>
                    <div :style="{ color:'#8D6E63', fontSize:'12px' }">
                      {{ group.items.length }} artwork{{ group.items.length !== 1 ? 's' : '' }} ·
                      ₹{{ group.subtotal.toLocaleString('en-IN') }}
                    </div>
                  </div>
                </div>

                <div class="d-flex align-center flex-wrap" style="gap:8px">
                  <v-btn small outlined color="brown darken-1"
                    :style="{ borderRadius:'50px', textTransform:'none', fontWeight:'600' }"
                    @click="goChat(group)">
                    <v-icon left size="14">mdi-chat-outline</v-icon>
                    Chat with {{ group.artistName.split(' ')[0] }}
                  </v-btn>
                  <v-btn small depressed color="brown darken-2" dark
                    :style="{ borderRadius:'50px', textTransform:'none', fontWeight:'600' }"
                    @click="openCheckout(group)">
                    <v-icon left size="14">mdi-shopping-outline</v-icon>
                    Buy · ₹{{ group.subtotal.toLocaleString('en-IN') }}
                  </v-btn>
                </div>

              </div>
            </v-card-text>

            <v-divider />

            <!-- artwork rows -->
            <div v-for="(item, idx) in group.items" :key="item._id">
              <v-row no-gutters align="center" class="pa-3">

                <v-col cols="2" sm="1">
                  <v-img :src="item.artwork.image || fallback" height="72" width="72"
                    :style="{ borderRadius:'10px' }" cover />
                </v-col>

                <v-col cols="10" sm="5" class="pl-3">
                  <div :style="{ fontFamily:'\'Playfair Display\',serif', fontWeight:'600', color:'#2C1810', fontSize:'14px' }">
                    {{ item.artwork.title }}
                  </div>
                  <!-- artist name if available -->
                  <div v-if="item.artwork.artist && item.artwork.artist.name"
                    :style="{ color:'#A1887F', fontSize:'12px', marginTop:'2px' }">
                    {{ item.artwork.artist.name }}
                  </div>
                  <v-chip v-if="item.artwork.type" x-small class="mt-1"
                    :color="typeColor(item.artwork.type).bg"
                    :text-color="typeColor(item.artwork.type).text">
                    {{ item.artwork.type }}
                  </v-chip>
                </v-col>

                <v-col cols="12" sm="3" class="mt-2 mt-sm-0">
                  <div class="d-flex align-center" style="gap:6px">
                    <v-btn icon x-small color="brown darken-1"
                      :disabled="item.quantity <= 1 || updatingId === item._id"
                      @click="decrease(item)">
                      <v-icon size="16">mdi-minus-circle-outline</v-icon>
                    </v-btn>
                    <v-chip x-small :style="{ minWidth:'30px', justifyContent:'center', background:'#EFEBE9', color:'#3E2723', fontWeight:'700' }">
                      {{ item.quantity }}
                    </v-chip>
                    <v-btn icon x-small color="brown darken-1"
                      :disabled="updatingId === item._id"
                      @click="increase(item)">
                      <v-icon size="16">mdi-plus-circle-outline</v-icon>
                    </v-btn>
                    <v-progress-circular v-if="updatingId === item._id"
                      indeterminate size="14" width="2" color="brown" />
                  </div>
                </v-col>

                <v-col cols="12" sm="3" class="mt-2 mt-sm-0">
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div :style="{ fontWeight:'700', fontSize:'15px', color:'#5D4037' }">
                        ₹{{ (item.artwork.price * item.quantity).toLocaleString('en-IN') }}
                      </div>
                      <div :style="{ color:'#BCAAA4', fontSize:'11px' }">
                        ₹{{ Number(item.artwork.price).toLocaleString('en-IN') }} each
                      </div>
                    </div>
                    <v-btn icon x-small color="red lighten-2"
                      :loading="removingId === item._id"
                      @click="removeItem(item._id)">
                      <v-icon size="16">mdi-trash-can-outline</v-icon>
                    </v-btn>
                  </div>
                </v-col>

              </v-row>
              <v-divider v-if="idx < group.items.length - 1" />
            </div>

          </v-card>
        </v-col>

        <!-- RIGHT: summary -->
        <v-col cols="12" md="4">
          <v-card flat :style="{ borderRadius:'20px', border:'1.5px solid #E0D4CF', position:'sticky', top:'88px' }">
            <v-card-text class="pa-6">
              <div :style="{ fontFamily:'\'Playfair Display\',serif', fontSize:'20px', fontWeight:'700', color:'#3E2723', marginBottom:'20px' }">
                Order Summary
              </div>
              <div v-for="group in groupedByArtist" :key="'sum-' + group.groupKey" class="mb-4">
                <div class="d-flex align-center mb-2" style="gap:8px">
                  <v-avatar size="22" color="brown lighten-2">
                    <span :style="{ color:'white', fontSize:'10px', fontWeight:'700' }">
                      {{ group.artistName.charAt(0).toUpperCase() }}
                    </span>
                  </v-avatar>
                  <span :style="{ fontWeight:'600', color:'#5D4037', fontSize:'13px' }">{{ group.artistName }}</span>
                </div>
                <div v-for="item in group.items" :key="'sl-' + item._id"
                  class="d-flex justify-space-between mb-1 pl-8">
                  <span :style="{ color:'#8D6E63', fontSize:'12px' }">{{ item.artwork.title }} × {{ item.quantity }}</span>
                  <span :style="{ color:'#3E2723', fontWeight:'600', fontSize:'12px' }">
                    ₹{{ (item.artwork.price * item.quantity).toLocaleString('en-IN') }}
                  </span>
                </div>
              </div>
              <v-divider class="my-4" />
              <div class="d-flex justify-space-between align-center mb-6">
                <div :style="{ fontWeight:'700', fontSize:'16px', color:'#3E2723' }">Grand Total</div>
                <div :style="{ fontWeight:'800', fontSize:'22px', color:'#5D4037', fontFamily:'\'Playfair Display\',serif' }">
                  ₹{{ grandTotal.toLocaleString('en-IN') }}
                </div>
              </div>
              <v-btn block large depressed color="brown darken-2" dark
                :style="{ borderRadius:'50px', textTransform:'none', fontWeight:'700', fontSize:'15px', height:'52px' }"
                @click="openCheckout(null)">
                <v-icon left>mdi-shopping-outline</v-icon>
                Buy All · ₹{{ grandTotal.toLocaleString('en-IN') }}
              </v-btn>
              <div class="d-flex align-center justify-center mt-3" :style="{ color:'#BCAAA4', fontSize:'12px' }">
                <v-icon size="13" color="#BCAAA4" class="mr-1">mdi-shield-check-outline</v-icon>
                Secure checkout · Each artist notified separately
              </div>
            </v-card-text>
          </v-card>
        </v-col>

      </v-row>
    </v-container>


    <!-- ═══════════════════════════════════════
         CHECKOUT DIALOG  (3 steps)
    ════════════════════════════════════════ -->
    <v-dialog v-model="checkoutDialog" max-width="560" persistent scrollable>
      <v-card :style="{ borderRadius:'20px' }">

        <!-- header + step indicator -->
        <v-card-title class="pa-5 pb-3" :style="{ background:'#EFEBE9', borderRadius:'20px 20px 0 0' }">
          <div class="d-flex align-center justify-space-between" style="width:100%">
            <div :style="{ fontFamily:'\'Playfair Display\',serif', color:'#3E2723', fontSize:'20px', fontWeight:'700' }">
              {{ stepTitle }}
            </div>
            <v-btn icon small @click="closeCheckout">
              <v-icon color="#8D6E63">mdi-close</v-icon>
            </v-btn>
          </div>

          <!-- step progress bars -->
          <div class="d-flex align-center mt-3" style="width:100%; gap:6px">
            <div v-for="s in 3" :key="s" style="flex:1; display:flex; align-items:center; gap:6px">
              <div :style="{
                flex: 1, height: '4px', borderRadius: '4px',
                background: s <= checkoutStep ? '#5D4037' : '#D7CCC8',
                transition: 'background 0.3s',
              }" />
              <v-avatar size="26" :color="s <= checkoutStep ? 'brown darken-2' : 'brown lighten-4'">
                <v-icon size="13" :color="s <= checkoutStep ? 'white' : '#A1887F'">
                  {{ s === 1 ? 'mdi-map-marker-outline' : s === 2 ? 'mdi-credit-card-outline' : 'mdi-check' }}
                </v-icon>
              </v-avatar>
            </div>
          </div>
          <div class="d-flex mt-1" style="width:100%">
            <span v-for="label in ['Address','Payment','Review']" :key="label"
              :style="{ fontSize:'11px', color:'#8D6E63', flex:1, textAlign:'center' }">
              {{ label }}
            </span>
          </div>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-6">

          <!-- STEP 1: Address -->
          <div v-if="checkoutStep === 1">
            <div :style="{ color:'#5D4037', fontWeight:'600', marginBottom:'16px' }">
              Where should we deliver your artwork?
            </div>
            <v-text-field v-model="address.fullName" label="Full Name *"
              outlined dense color="brown darken-1" class="mb-1" />
            <v-text-field v-model="address.phone" label="Phone Number *"
              outlined dense color="brown darken-1" prefix="+91" class="mb-1" />
            <v-text-field v-model="address.line1" label="Flat / House No, Building *"
              outlined dense color="brown darken-1" class="mb-1" />
            <v-text-field v-model="address.line2" label="Street, Area (optional)"
              outlined dense color="brown darken-1" class="mb-1" />
            <v-row>
              <v-col cols="6">
                <v-text-field v-model="address.city" label="City *"
                  outlined dense color="brown darken-1" />
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="address.state" label="State *"
                  outlined dense color="brown darken-1" />
              </v-col>
            </v-row>
            <v-text-field v-model="address.pincode" label="PIN Code *"
              outlined dense color="brown darken-1" />
          </div>

          <!-- STEP 2: Payment -->
          <div v-if="checkoutStep === 2">
            <div :style="{ color:'#5D4037', fontWeight:'600', marginBottom:'20px' }">
              How would you like to pay?
            </div>

            <!-- Razorpay -->
            <v-card flat outlined class="mb-4 pa-4"
              :style="{
                borderRadius:'14px', cursor:'pointer',
                borderColor: paymentMethod === 'razorpay' ? '#5D4037' : '#E0D4CF',
                borderWidth: paymentMethod === 'razorpay' ? '2px' : '1px',
                background:  paymentMethod === 'razorpay' ? '#EFEBE9' : 'white',
              }"
              @click="paymentMethod = 'razorpay'">
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center" style="gap:14px">
                  <v-avatar size="44" color="blue darken-4" rounded>
                    <v-icon color="white">mdi-lightning-bolt</v-icon>
                  </v-avatar>
                  <div>
                    <div :style="{ fontWeight:'700', color:'#2C1810', fontSize:'15px' }">Pay Online</div>
                    <div :style="{ color:'#8D6E63', fontSize:'12px', marginTop:'2px' }">
                      UPI · Cards · Net Banking via Razorpay
                    </div>
                  </div>
                </div>
                <v-radio :input-value="paymentMethod === 'razorpay'" color="brown darken-2" @click.stop="paymentMethod = 'razorpay'" />
              </div>
            </v-card>

            <!-- COD -->
            <v-card flat outlined class="pa-4"
              :style="{
                borderRadius:'14px', cursor:'pointer',
                borderColor: paymentMethod === 'cod' ? '#5D4037' : '#E0D4CF',
                borderWidth: paymentMethod === 'cod' ? '2px' : '1px',
                background:  paymentMethod === 'cod' ? '#EFEBE9' : 'white',
              }"
              @click="paymentMethod = 'cod'">
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center" style="gap:14px">
                  <v-avatar size="44" color="green darken-2" rounded>
                    <v-icon color="white">mdi-cash</v-icon>
                  </v-avatar>
                  <div>
                    <div :style="{ fontWeight:'700', color:'#2C1810', fontSize:'15px' }">Cash on Delivery</div>
                    <div :style="{ color:'#8D6E63', fontSize:'12px', marginTop:'2px' }">
                      Pay when your artwork arrives
                    </div>
                  </div>
                </div>
                <v-radio :input-value="paymentMethod === 'cod'" color="brown darken-2" @click.stop="paymentMethod = 'cod'" />
              </div>
            </v-card>

            <v-alert v-if="paymentMethod === 'razorpay'" dense text type="info"
              color="blue darken-2" class="mt-4" :style="{ borderRadius:'10px', fontSize:'12px' }">
              You will be redirected to Razorpay's secure payment page after reviewing your order.
            </v-alert>
            <v-alert v-if="paymentMethod === 'cod'" dense text type="success"
              color="green darken-1" class="mt-4" :style="{ borderRadius:'10px', fontSize:'12px' }">
              Pay in cash when the artwork is delivered to your address.
            </v-alert>
          </div>

          <!-- STEP 3: Review -->
          <div v-if="checkoutStep === 3">

            <div :style="{ fontWeight:'600', color:'#3E2723', marginBottom:'12px' }">
              <v-icon size="16" color="brown darken-1" class="mr-1">mdi-package-variant-closed</v-icon>
              Items
            </div>
            <div v-for="item in checkoutItems" :key="'r-' + item._id"
              class="d-flex align-center mb-3" style="gap:12px">
              <v-img :src="item.artwork.image || fallback" height="52" width="52"
                :style="{ borderRadius:'8px', flexShrink:0 }" cover />
              <div :style="{ flex:1 }">
                <div :style="{ fontWeight:'600', color:'#2C1810', fontSize:'13px' }">
                  {{ item.artwork.title }}
                </div>
                <div :style="{ color:'#A1887F', fontSize:'12px' }">qty {{ item.quantity }}</div>
              </div>
              <div :style="{ fontWeight:'700', color:'#5D4037', fontSize:'14px', flexShrink:0 }">
                ₹{{ (item.artwork.price * item.quantity).toLocaleString('en-IN') }}
              </div>
            </div>

            <v-divider class="my-4" />

            <div :style="{ fontWeight:'600', color:'#3E2723', marginBottom:'8px' }">
              <v-icon size="16" color="brown darken-1" class="mr-1">mdi-map-marker-outline</v-icon>
              Delivery Address
            </div>
            <v-card flat :style="{ background:'#F8F3F0', borderRadius:'10px', padding:'12px 14px', marginBottom:'16px' }">
              <div :style="{ color:'#3E2723', fontSize:'13px', lineHeight:'1.8' }">
                <strong>{{ address.fullName }}</strong><br/>
                {{ address.line1 }}<span v-if="address.line2">, {{ address.line2 }}</span><br/>
                {{ address.city }}, {{ address.state }} — {{ address.pincode }}<br/>
                <v-icon size="13" color="#8D6E63">mdi-phone-outline</v-icon>
                +91 {{ address.phone }}
              </div>
            </v-card>

            <div :style="{ fontWeight:'600', color:'#3E2723', marginBottom:'8px' }">
              <v-icon size="16" color="brown darken-1" class="mr-1">mdi-credit-card-outline</v-icon>
              Payment
            </div>
            <v-chip :color="paymentMethod === 'razorpay' ? 'blue darken-4' : 'green darken-2'"
              dark small class="mb-4">
              <v-icon left size="14">{{ paymentMethod === 'razorpay' ? 'mdi-lightning-bolt' : 'mdi-cash' }}</v-icon>
              {{ paymentMethod === 'razorpay' ? 'Pay Online via Razorpay' : 'Cash on Delivery' }}
            </v-chip>

            <v-divider class="my-3" />

            <div class="d-flex justify-space-between align-center">
              <div :style="{ fontWeight:'700', fontSize:'16px', color:'#3E2723' }">Total to Pay</div>
              <div :style="{ fontWeight:'800', fontSize:'24px', color:'#5D4037', fontFamily:'\'Playfair Display\',serif' }">
                ₹{{ checkoutTotal.toLocaleString('en-IN') }}
              </div>
            </div>

          </div>
        </v-card-text>

        <v-divider />

        <!-- dialog actions -->
        <v-card-actions class="pa-5 pt-4">
          <v-btn v-if="checkoutStep > 1" text color="brown"
            :style="{ textTransform:'none', fontWeight:'600' }"
            @click="checkoutStep--">
            <v-icon left size="16">mdi-arrow-left</v-icon> Back
          </v-btn>
          <v-spacer />
          <v-btn text color="brown lighten-2" :style="{ textTransform:'none' }" @click="closeCheckout">
            Cancel
          </v-btn>
          <v-btn v-if="checkoutStep < 3" depressed color="brown darken-2" dark
            :disabled="!canGoNext"
            :style="{ borderRadius:'50px', textTransform:'none', fontWeight:'700', minWidth:'120px' }"
            @click="nextStep">
            Next <v-icon right size="16">mdi-arrow-right</v-icon>
          </v-btn>
          <v-btn v-if="checkoutStep === 3" depressed color="brown darken-2" dark
            :loading="placingOrder"
            :style="{ borderRadius:'50px', textTransform:'none', fontWeight:'700', minWidth:'160px' }"
            @click="placeOrder">
            <v-icon left size="16">{{ paymentMethod === 'razorpay' ? 'mdi-lightning-bolt' : 'mdi-check-circle' }}</v-icon>
            {{ paymentMethod === 'razorpay' ? 'Pay with Razorpay' : 'Place Order' }}
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>

    <!-- confirm clear all -->
    <v-dialog v-model="confirmClearAll" max-width="380">
      <v-card :style="{ borderRadius:'20px', padding:'8px' }">
        <v-card-title :style="{ color:'#B71C1C', fontSize:'18px' }">Clear entire cart?</v-card-title>
        <v-card-text :style="{ color:'#6D4C41' }">This will remove all {{ items.length }} items.</v-card-text>
        <v-card-actions class="pb-4 px-4">
          <v-spacer />
          <v-btn text :style="{ textTransform:'none' }" @click="confirmClearAll = false">Cancel</v-btn>
          <v-btn depressed color="red darken-1" dark
            :style="{ borderRadius:'50px', textTransform:'none' }" @click="clearAll">
            Clear All
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- snackbar -->
    <v-snackbar v-model="snack.show" :color="snack.color" top right timeout="3000">
      <v-icon left size="16">{{ snack.icon }}</v-icon>
      {{ snack.msg }}
    </v-snackbar>

  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import cartService  from '@/services/cartService'
import orderService from '@/services/orderService'

export default {
  name: 'CartView',

  data: () => ({
    updatingId:      null,
    removingId:      null,
    confirmClearAll: false,
    fallback: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80',

    checkoutDialog:  false,
    checkoutStep:    1,
    checkoutGroup:   null,   /* null = buy all */
    paymentMethod:   'razorpay',
    placingOrder:    false,

    address: {
      fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '',
    },

    snack: { show: false, msg: '', color: 'success', icon: 'mdi-check' },
  }),

  computed: {
    ...mapState('cart', ['items', 'loading']),

    /* ── Group by artist._id if available, else by artwork._id ──
       Key point: we group by CART item._id list, not artistId string.
       This avoids the "unknown" bug entirely.                         */
    groupedByArtist() {
      const map = {}
      this.items.forEach(function(item) {
        if (!item || !item.artwork) return

        const artist = item.artwork.artist
        /* use artist._id if populated, otherwise fall back to artwork._id as key
           so every item is always visible even if artist not populated */
        const key  = (artist && artist._id)  ? String(artist._id)  : ('artwork_' + String(item.artwork._id))
        const name = (artist && artist.name) ? artist.name         : 'Artist'

        if (!map[key]) {
          map[key] = {
            groupKey:   key,
            artistName: name,
            artistId:   (artist && artist._id) ? String(artist._id) : null,
            artworkId:  item.artwork._id,
            items:      [],
            subtotal:   0,
          }
        }
        map[key].items.push(item)
        map[key].subtotal += Number(item.artwork.price || 0) * Number(item.quantity || 1)
      })
      return Object.values(map)
    },

    grandTotal() {
      return this.groupedByArtist.reduce(function(s, g) { return s + g.subtotal }, 0)
    },

    /* items shown in step 3 review */
    checkoutItems() {
      if (!this.checkoutGroup) return this.items
      return this.checkoutGroup.items
    },

    checkoutTotal() {
      if (!this.checkoutGroup) return this.grandTotal
      return this.checkoutGroup.subtotal
    },

    stepTitle() {
      return ['', 'Delivery Address', 'Payment Method', 'Review & Confirm'][this.checkoutStep] || ''
    },

    canGoNext() {
      if (this.checkoutStep === 1) {
        const a = this.address
        return !!(
          a.fullName.trim() &&
          a.phone.trim()    &&
          a.line1.trim()    &&
          a.city.trim()     &&
          a.state.trim()    &&
          a.pincode.trim()
        )
      }
      if (this.checkoutStep === 2) return !!this.paymentMethod
      return true
    },
  },

  created() {
    this.$store.dispatch('cart/fetchCart')
  },

  methods: {

    openCheckout(group) {
      this.checkoutGroup  = group   /* null = all items */
      this.checkoutStep   = 1
      this.paymentMethod  = 'razorpay'
      this.checkoutDialog = true
    },

    closeCheckout() {
      this.checkoutDialog = false
      this.checkoutStep   = 1
    },

    nextStep() {
      if (this.checkoutStep < 3) this.checkoutStep++
    },

    /* ── PLACE ORDER
       Send cartItemIds (Cart document _id values) to backend.
       Backend filters by these IDs — no artist lookup needed.  ── */
    async placeOrder() {
      this.placingOrder = true
      try {
        /* collect the Cart._id values of items being ordered */
        const itemsToOrder = this.checkoutGroup ? this.checkoutGroup.items : this.items
        const cartItemIds  = itemsToOrder.map(function(i) { return i._id })

        const payload = {
          cartItemIds,
          address:       this.address,
          paymentMethod: this.paymentMethod,
        }

        await orderService.createOrder(payload)
        await this.$store.dispatch('cart/fetchCart')

        this.checkoutDialog = false

        if (this.paymentMethod === 'razorpay') {
          this.notify('Redirecting to payment…', 'blue darken-2', 'mdi-lightning-bolt')
        } else {
          this.notify('Order placed! 🎉 Pay on delivery.', 'success', 'mdi-check-circle')
        }

        setTimeout(() => { this.$router.push('/orders') }, 1800)

      } catch (e) {
        this.notify(
          e.response && e.response.data && e.response.data.message
            ? e.response.data.message : 'Could not place order',
          'error', 'mdi-alert-circle'
        )
      } finally {
        this.placingOrder = false
      }
    },

    async increase(item) {
      this.updatingId = item._id
      try {
        await cartService.updateItem(item._id, { quantity: item.quantity + 1 })
        await this.$store.dispatch('cart/fetchCart')
      } catch (e) { this.notify('Could not update quantity', 'error', 'mdi-alert') }
      finally { this.updatingId = null }
    },

    async decrease(item) {
      if (item.quantity <= 1) return
      this.updatingId = item._id
      try {
        await cartService.updateItem(item._id, { quantity: item.quantity - 1 })
        await this.$store.dispatch('cart/fetchCart')
      } catch (e) { this.notify('Could not update quantity', 'error', 'mdi-alert') }
      finally { this.updatingId = null }
    },

    async removeItem(id) {
      this.removingId = id
      try {
        await cartService.removeItem(id)
        await this.$store.dispatch('cart/fetchCart')
        this.notify('Item removed', '#795548', 'mdi-trash-can-outline')
      } catch (e) { this.notify('Could not remove item', 'error', 'mdi-alert') }
      finally { this.removingId = null }
    },

    async clearAll() {
      this.confirmClearAll = false
      try {
        for (const item of this.items) {
          await cartService.removeItem(item._id)
        }
        await this.$store.dispatch('cart/fetchCart')
        this.notify('Cart cleared', '#795548', 'mdi-trash-can-outline')
      } catch (e) { this.notify('Could not clear cart', 'error', 'mdi-alert') }
    },

    goChat(group) {
      this.$router.push({
        path: '/chat',
        query: {
          artworkId:  group.artworkId,
          artistId:   group.artistId || '',
          artistName: group.artistName,
        },
      })
    },

    typeColor(type) {
      const map = {
        Painting:    { bg: '#FBE9E7', text: '#BF360C' },
        Photography: { bg: '#E3F2FD', text: '#0D47A1' },
        Drawing:     { bg: '#F3E5F5', text: '#4A148C' },
      }
      return map[type] || { bg: '#EFEBE9', text: '#4E342E' }
    },

    notify(msg, color, icon) {
      this.snack = { show: true, msg, color, icon }
    },
  },
}
</script>