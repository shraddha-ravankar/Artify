<template>
  <v-container fluid :style="{ background: '#F8F3F0', minHeight: '100vh' }" class="pa-0">

    <!-- ── Loading ── -->
    <v-container v-if="loading" class="py-16">
      <v-row justify="center" align="center" class="py-16">
        <v-progress-circular indeterminate color="brown darken-2" size="52" />
      </v-row>
    </v-container>

    <!-- ── Error ── -->
    <v-container v-else-if="error" class="py-16">
      <v-row justify="center">
        <v-col cols="12" class="text-center">
          <v-icon size="64" color="brown lighten-3">mdi-image-broken-variant</v-icon>
          <div :style="{ fontFamily: '\'Playfair Display\', serif', fontSize: '22px', color: '#5D4037', marginTop: '16px' }">
            Artwork not found
          </div>
          <v-btn text color="brown darken-1" to="/explore" class="mt-4"
            :style="{ textTransform: 'none' }">
            <v-icon left>mdi-arrow-left</v-icon> Back to Explore
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <!-- ── Main content ── -->
    <template v-else-if="artwork">

      <!-- back button -->
      <v-container class="pt-6 pb-0">
        <v-btn text small color="brown darken-1" @click="$router.back()"
          :style="{ textTransform: 'none', fontWeight: '600' }">
          <v-icon left size="16">mdi-arrow-left</v-icon>
          Back
        </v-btn>
      </v-container>

      <v-container class="py-6">
        <v-row>

          <!-- ══ LEFT: Big image ══ -->
          <v-col cols="12" md="6" lg="7">
            <v-card flat :style="{ borderRadius: '24px', overflow: 'hidden', background: '#EDE0DA' }">

              <v-img
                :src="artwork.image || fallback"
                :alt="artwork.title"
                max-height="620"
                contain
                :style="{ background: '#EDE0DA', cursor: 'zoom-in' }"
                @click="zoomDialog = true"
                @error="function(e){ e.target.src = fallback }"
              />

              <div
                class="d-flex align-center justify-center py-2"
                :style="{ background: 'rgba(62,39,35,0.06)', fontSize: '12px', color: '#8D6E63' }"
              >
                <v-icon size="14" color="#8D6E63" class="mr-1">mdi-magnify-plus-outline</v-icon>
                Click image to zoom
              </div>

            </v-card>
          </v-col>

          <!-- ══ RIGHT: Details ══ -->
          <v-col cols="12" md="6" lg="5">
            <div class="pl-md-4">

              <!-- type badge + featured -->
              <div class="d-flex align-center mb-3" style="gap: 8px">
                <v-chip
                  v-if="artwork.isFeatured"
                  small color="amber darken-2" dark
                  :style="{ borderRadius: '50px', fontWeight: '700', fontSize: '11px' }"
                >
                  <v-icon left size="12">mdi-star</v-icon>
                  Featured
                </v-chip>
                <v-chip
                  v-if="artwork.type"
                  small
                  :color="typeColor(artwork.type).bg"
                  :text-color="typeColor(artwork.type).text"
                  :style="{ borderRadius: '50px', fontWeight: '600', fontSize: '11px' }"
                >
                  <v-icon left size="12">{{ typeIcon(artwork.type) }}</v-icon>
                  {{ artwork.type }}
                </v-chip>
              </div>

              <!-- title -->
              <div :style="{
                fontFamily: '\'Playfair Display\', serif',
                fontSize: '36px',
                fontWeight: '700',
                color: '#2C1810',
                lineHeight: '1.2',
                marginBottom: '12px',
              }">
                {{ artwork.title }}
              </div>

              <!-- likes + date row -->
              <div class="d-flex align-center mb-4" style="gap: 20px">
                <div class="d-flex align-center" style="gap: 5px">
                  <v-icon size="16" :color="liked ? '#EF5350' : '#BCAAA4'">
                    {{ liked ? 'mdi-heart' : 'mdi-heart-outline' }}
                  </v-icon>
                  <span :style="{ color: '#8D6E63', fontSize: '13px' }">
                    {{ localLikes }} like{{ localLikes !== 1 ? 's' : '' }}
                  </span>
                </div>
                <div class="d-flex align-center" style="gap: 5px">
                  <v-icon size="15" color="#BCAAA4">mdi-calendar-outline</v-icon>
                  <span :style="{ color: '#8D6E63', fontSize: '13px' }">{{ formatDate(artwork.createdAt) }}</span>
                </div>
              </div>

              <!-- price -->
              <div :style="{
                fontFamily: '\'Playfair Display\', serif',
                fontSize: '38px',
                fontWeight: '800',
                color: '#5D4037',
                marginBottom: '20px',
                letterSpacing: '-0.5px',
              }">
                ₹{{ Number(artwork.price).toLocaleString('en-IN') }}
              </div>

              <v-divider :style="{ borderColor: '#E0D4CF', marginBottom: '20px' }" />

              <!-- artist card -->
              <div
                class="d-flex align-center pa-4 mb-5"
                :style="{
                  background: 'white',
                  borderRadius: '16px',
                  border: '1px solid #E0D4CF',
                  gap: '14px',
                }"
              >
                <v-avatar size="50" color="brown darken-1">
                  <span :style="{ color: 'white', fontWeight: '700', fontSize: '20px' }">
                    {{ artistInitial }}
                  </span>
                </v-avatar>
                <div :style="{ flex: 1 }">
                  <div :style="{ color: '#8D6E63', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }">
                    Artist
                  </div>
                  <div :style="{ fontFamily: '\'Playfair Display\', serif', fontWeight: '700', color: '#2C1810', fontSize: '17px' }">
                    {{ artistName }}
                  </div>
                </div>
                <v-btn
                  small outlined color="brown darken-1"
                  :style="{ borderRadius: '50px', textTransform: 'none', fontWeight: '600' }"
                  @click="goChat"
                >
                  <v-icon left size="14">mdi-chat-outline</v-icon>
                  Chat
                </v-btn>
              </div>

              <!-- description -->
              <div v-if="artwork.description" class="mb-5">
                <div :style="{ fontWeight: '700', color: '#3E2723', fontSize: '15px', marginBottom: '8px' }">
                  About this artwork
                </div>
                <div :style="{
                  color: '#6D4C41',
                  fontSize: '15px',
                  lineHeight: '1.75',
                  background: 'white',
                  borderRadius: '14px',
                  border: '1px solid #E0D4CF',
                  padding: '14px 16px',
                }">
                  {{ artwork.description }}
                </div>
              </div>

              <!-- action buttons -->
              <v-row class="mb-2">
                <v-col cols="6">
                  <v-btn
                    block large outlined
                    :color="liked ? 'red lighten-1' : 'brown darken-1'"
                    :loading="liking"
                    :style="{ borderRadius: '50px', textTransform: 'none', fontWeight: '600', height: '50px' }"
                    @click="toggleLike"
                  >
                    <v-icon left size="18">{{ liked ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                    {{ liked ? 'Liked' : 'Like' }}
                  </v-btn>
                </v-col>
                <v-col cols="6">
                  <v-btn
                    block large depressed
                    color="brown darken-2" dark
                    :loading="addingToCart"
                    :style="{ borderRadius: '50px', textTransform: 'none', fontWeight: '700', height: '50px' }"
                    @click="addToCart"
                  >
                    <v-icon left size="18">mdi-cart-plus</v-icon>
                    Add to Cart
                  </v-btn>
                </v-col>
              </v-row>

              <!-- contact artist full button -->
              <v-btn
                block outlined color="brown darken-1"
                :style="{ borderRadius: '50px', textTransform: 'none', fontWeight: '600', height: '46px' }"
                @click="goChat"
              >
                <v-icon left size="16">mdi-message-outline</v-icon>
                Contact Artist
              </v-btn>

            </div>
          </v-col>

        </v-row>
      </v-container>

      <!-- ══ Related artworks ══ -->
      <v-container v-if="related.length" class="pb-12">
        <v-divider :style="{ borderColor: '#E0D4CF', marginBottom: '32px' }" />

        <div :style="{
          fontFamily: '\'Playfair Display\', serif',
          fontSize: '24px',
          fontWeight: '700',
          color: '#3E2723',
          marginBottom: '20px',
        }">
          More {{ artwork.type || 'Artworks' }} You May Like
        </div>

        <v-row v-if="relatedLoading">
          <v-col v-for="n in 4" :key="n" cols="6" sm="4" md="3">
            <v-skeleton-loader type="card" :style="{ borderRadius: '16px' }" />
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col v-for="rel in related" :key="rel._id" cols="6" sm="4" md="3">
            <v-card
              flat outlined
              :style="{ borderRadius: '16px', borderColor: '#E0D4CF', cursor: 'pointer', overflow: 'hidden' }"
              @click="goToDetail(rel._id)"
            >
              <v-img :src="rel.image || fallback" :alt="rel.title" height="180" cover />
              <v-card-text class="pa-3">
                <div :style="{ fontFamily: '\'Playfair Display\', serif', fontWeight: '600', color: '#2C1810', fontSize: '13px', marginBottom: '4px' }">
                  {{ rel.title }}
                </div>
                <div class="d-flex justify-space-between align-center">
                  <span :style="{ color: '#A1887F', fontSize: '12px' }">
                    {{ rel.artist && rel.artist.name ? rel.artist.name : '' }}
                  </span>
                  <span :style="{ fontWeight: '700', color: '#5D4037', fontSize: '13px' }">
                    ₹{{ Number(rel.price).toLocaleString('en-IN') }}
                  </span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

    </template>

    <!-- ══ Zoom dialog ══ -->
    <v-dialog v-model="zoomDialog" max-width="900">
      <v-card flat :style="{ background: '#1a1008', borderRadius: '16px', overflow: 'hidden' }">
        <v-btn
          icon dark absolute top right
          :style="{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, background: 'rgba(0,0,0,0.5)' }"
          @click="zoomDialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-img
          v-if="artwork"
          :src="artwork.image || fallback"
          :alt="artwork.title"
          contain
          max-height="85vh"
        />
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
import artworkService from '@/services/artworkService'
import likeService    from '@/services/likeService'
import cartService    from '@/services/cartService'

export default {
  name: 'ArtworkDetailView',

  data: function() {
    return {
      artwork:        null,
      loading:        true,
      error:          false,

      /* like state */
      liked:          false,
      localLikes:     0,
      liking:         false,

      /* cart */
      addingToCart:   false,

      /* related */
      related:        [],
      relatedLoading: false,

      /* zoom */
      zoomDialog:     false,

      fallback: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
      snack: { show: false, msg: '', color: 'success', icon: 'mdi-check' },
    }
  },

  computed: {
    isAuth: function() {
      return this.$store.getters['auth/isAuthenticated']
    },
    artistName: function() {
      if (!this.artwork) return ''
      return (this.artwork.artist && this.artwork.artist.name)
        ? this.artwork.artist.name
        : 'Unknown Artist'
    },
    artistInitial: function() {
      return this.artistName.charAt(0).toUpperCase()
    },
  },

  watch: {
    /* re-fetch when route id changes (clicking related artwork) */
    '$route.params.id': function(newId) {
      if (newId) this.init()
    },
  },

  created: function() {
    this.init()
  },

  methods: {

    init: async function() {
      this.loading = true
      this.error   = false
      this.artwork = null
      this.related = []
      this.liked   = false
      this.localLikes = 0
      window.scrollTo(0, 0)

      try {
        var res = await artworkService.getOne(this.$route.params.id)
        this.artwork    = res.data
        this.localLikes = res.data.likes || 0
        await this.checkLiked()
        this.loadRelated()
      } catch (e) {
        this.error = true
      } finally {
        this.loading = false
      }
    },

    /*
     * ── FIX 1: use getUserLikes (not getLiked which doesn't exist)
     * ── FIX 2: handle all three shapes the API might return:
     *     a) array of like-objects:  [{ artwork: { _id: '...' } }, ...]
     *     b) array of artwork objects: [{ _id: '...' }, ...]
     *     c) array of id strings:    ['...', ...]
     */
    checkLiked: async function() {
      if (!this.isAuth) return
      try {
        var res = await likeService.getUserLikes()
        var list = res.data || []
        var artworkId = String(this.artwork._id)

        this.liked = list.some(function(x) {
          // shape a: like-object with nested artwork
          if (x && x.artwork) {
            return String(x.artwork._id || x.artwork) === artworkId
          }
          // shape b: plain artwork object
          if (x && x._id) {
            return String(x._id) === artworkId
          }
          // shape c: raw id string
          return String(x) === artworkId
        })
      } catch (e) {
        // silently ignore — liked stays false
      }
    },

    loadRelated: async function() {
      if (!this.artwork) return
      this.relatedLoading = true
      try {
        var res = await artworkService.getAll({ type: this.artwork.type, limit: 5 })
        var artworkId = String(this.artwork._id)
        this.related = (res.data.artworks || res.data)
          .filter(function(a) { return String(a._id) !== artworkId })
          .slice(0, 4)
      } catch (e) {
        this.related = []
      } finally {
        this.relatedLoading = false
      }
    },

    /*
     * ── FIX 3: guard against double-clicking
     *    optimistic update first, then API call,
     *    revert on error — same pattern as ExploreView
     */
    toggleLike: async function() {
      if (!this.isAuth) { this.$router.push('/login'); return }
      if (this.liking) return  // prevent double-click

      this.liking  = true
      var was      = this.liked

      // optimistic update
      this.liked      = !was
      this.localLikes = was
        ? Math.max(0, this.localLikes - 1)
        : this.localLikes + 1

      try {
        if (was) {
          await likeService.unlike(this.artwork._id)
        } else {
          await likeService.like(this.artwork._id)
        }
      } catch (e) {
        // revert on error
        this.liked      = was
        this.localLikes = was
          ? this.localLikes + 1
          : Math.max(0, this.localLikes - 1)

        var msg = (e.response && e.response.data && e.response.data.message)
          ? e.response.data.message
          : 'Could not update like'
        this.notify(msg, 'error', 'mdi-alert')
      } finally {
        this.liking = false
      }
    },

    addToCart: async function() {
      if (!this.isAuth) { this.$router.push('/login'); return }
      this.addingToCart = true
      try {
        await cartService.addToCart({ artworkId: this.artwork._id, quantity: 1 })
        await this.$store.dispatch('cart/fetchCart')
        this.notify('Added to cart! 🛒', 'success', 'mdi-cart-check')
      } catch (e) {
        var msg = (e.response && e.response.data && e.response.data.message)
          ? e.response.data.message
          : 'Could not add to cart'
        this.notify(msg, 'error', 'mdi-alert')
      } finally {
        this.addingToCart = false
      }
    },

    goChat: function() {
      if (!this.isAuth) { this.$router.push('/login'); return }
      this.$router.push({
        path: '/chat',
        query: {
          artworkId:  this.artwork._id,
          artistName: this.artistName,
        },
      })
    },

    goToDetail: function(id) {
      this.$router.push('/artworks/' + id)
    },

    typeColor: function(type) {
      var map = {
        painting:    { bg: '#FBE9E7', text: '#BF360C' },
        photography: { bg: '#E3F2FD', text: '#0D47A1' },
        illustration: { bg: '#F3E5F5', text: '#4A148C' },
      }
      return map[(type || '').toLowerCase()] || { bg: '#EFEBE9', text: '#4E342E' }
    },

    typeIcon: function(type) {
      var map = {
        painting:    'mdi-brush',
        photography: 'mdi-camera-outline',
        illustration: 'mdi-pen',
        drawing:     'mdi-pencil-outline',
      }
      return map[(type || '').toLowerCase()] || 'mdi-image-outline'
    },

    formatDate: function(ts) {
      if (!ts) return ''
      return new Date(ts).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    },

    notify: function(msg, color, icon) {
      this.snack = { show: true, msg: msg, color: color, icon: icon }
    },
  },
}
</script>