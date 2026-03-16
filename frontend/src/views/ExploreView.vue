<template>
  <v-app style="background:#F8F3F0">

    <div
      style="background:rgba(255,255,255,0.97);border-bottom:1.5px solid #EAE0DB;position:sticky;top:64px;z-index:60;transition:box-shadow 0.28s"
      :style="sticky ? 'box-shadow:0 5px 26px rgba(93,64,55,.13)' : ''"
    >
      <!-- Main filter row -->
      <v-container class="py-3">
        <v-row align="center" no-gutters style="gap:10px;flex-wrap:wrap">

          <!-- Search -->
          <v-text-field
            v-model="search"
            dense outlined hide-details
            placeholder="Search artworks or artists…"
            prepend-inner-icon="mdi-magnify"
            :append-icon="search ? 'mdi-close' : ''"
            color="brown darken-2"
            background-color="#FFF8F5"
            style="max-width:310px;border-radius:50px"
            @click:append="clearSearch"
            @keyup.enter="doSearch"
            @input="debouncedSearch"
          />

          <!-- Art type pills -->
          <v-btn-toggle
            v-model="artTypeIndex"
            borderless dense
            background-color="transparent"
            style="gap:4px;flex-wrap:nowrap"
          >
            <v-btn
              v-for="t in allTypeOptions" :key="t.value"
              x-small
              :color="artType === t.value ? 'brown darken-1' : ''"
              :dark="artType === t.value"
              outlined
              style="border-radius:50px;text-transform:capitalize;font-weight:500;font-size:0.76rem;border-color:#E0D4CF;background:white;padding:0 13px;height:34px"
              @click="setArtType(t.value)"
            >
              <v-icon size="13" class="mr-1" :color="artType === t.value ? 'white' : 'brown lighten-1'">{{ t.icon }}</v-icon>
              {{ t.label }}
            </v-btn>
          </v-btn-toggle>

          <v-spacer />

          <!-- Featured toggle -->
          <v-btn
            x-small outlined
            :color="featuredOnly ? 'brown darken-1' : ''"
            :dark="featuredOnly"
            style="border-radius:50px;text-transform:capitalize;font-weight:500;font-size:0.76rem;border-color:#E0D4CF;background:white;padding:0 14px;height:34px"
            @click="toggleFeatured"
          >
            <v-icon size="15" class="mr-1" :color="featuredOnly ? '#FFF9C4' : '#A1887F'">mdi-star</v-icon>
            Featured
          </v-btn>

          <!-- View mode toggle -->
          <div style="display:flex;gap:2px;background:#F5EDE9;border-radius:9px;padding:3px">
            <v-btn
              v-for="m in viewModes" :key="m.value"
              icon x-small
              :color="viewMode === m.value ? 'brown darken-1' : ''"
              style="width:33px;height:33px;border-radius:7px"
              :style="viewMode === m.value ? 'background:white;box-shadow:0 1px 4px rgba(0,0,0,.1)' : 'background:transparent'"
              @click="viewMode = m.value"
            >
              <v-icon size="16" :color="viewMode === m.value ? 'brown darken-1' : '#A1887F'">{{ m.icon }}</v-icon>
            </v-btn>
          </div>

        </v-row>
      </v-container>

      <!-- Active filter chips -->
      <v-container v-if="search || featuredOnly || artType" class="pt-0 pb-3">
        <v-row align="center" no-gutters style="gap:8px;flex-wrap:wrap">
          <span class="caption" style="color:#A1887F;font-weight:500">Filtered by:</span>
          <v-chip v-if="search" small dark close color="brown darken-1" class="mr-1" @click:close="clearSearch">
            "{{ search }}"
          </v-chip>
          <v-chip v-if="artType" small dark close color="brown darken-2" class="mr-1" @click:close="clearArtType">
            {{ artType }}
          </v-chip>
          <v-chip v-if="featuredOnly" small dark close color="brown darken-2" @click:close="clearFeatured">
            ⭐ Featured only
          </v-chip>
          <v-btn x-small text color="brown lighten-1" style="font-size:0.73rem;text-decoration:underline;text-transform:none" @click="resetAll">
            Reset all
          </v-btn>
        </v-row>
      </v-container>
    </div>

   
    <v-container class="py-6 pb-16">

    
      <div v-if="!loading && !errorMsg && artworks.length" class="caption mb-4" style="color:#A1887F">
        <strong style="color:#5D4037;font-weight:600">{{ totalCount }}</strong>
        artwork{{ totalCount !== 1 ? 's' : '' }}
        <template v-if="search"> for "<em style="color:#8D6E63">{{ search }}</em>"</template>
        <template v-if="artType"> · <em style="color:#8D6E63">{{ artType }}</em></template>
        <span v-if="totalPages > 1"> · page {{ page }}/{{ totalPages }}</span>
      </div>

      <!-- ERROR -->
      <v-card v-if="errorMsg" flat style="max-width:680px;margin:0 auto;background:#FFF5F5;border:2px solid #FFCDD2;border-radius:16px">
        <v-card-text class="pa-7">
          <v-row align="center" no-gutters class="mb-3">
            <v-icon color="red darken-3" size="20" class="mr-2">mdi-alert-circle-outline</v-icon>
            <span class="font-weight-bold" style="color:#B71C1C;font-size:1rem">Could not load artworks</span>
          </v-row>
          <div style="background:#FFE0E0;border-radius:8px;padding:10px 14px;font-family:monospace;font-size:0.83rem;color:#C62828;word-break:break-word" class="mb-4">
            {{ errorMsg }}
          </div>
          <v-btn rounded depressed color="brown darken-1" dark small class="font-weight-bold" style="letter-spacing:0" @click="loadArtworks">
            <v-icon left size="15">mdi-refresh</v-icon>Try again
          </v-btn>
        </v-card-text>
      </v-card>

      <!-- SKELETONS -->
      <v-row v-else-if="loading">
        <v-col v-for="n in limit" :key="'sk'+n"
          :cols="viewMode==='list' ? 12 : 12"
          :sm="viewMode==='list' ? 12 : 6"
          :md="viewMode==='grid3' ? 4 : viewMode==='list' ? 12 : 3"
        >
          <v-card flat style="border-radius:18px;overflow:hidden;border:1.5px solid #F0E8E4">
            <v-skeleton-loader type="image, article" />
          </v-card>
        </v-col>
      </v-row>

      <!-- EMPTY -->
      <div v-else-if="!artworks.length" class="text-center py-16">
        <div style="width:88px;height:88px;border-radius:22px;background:#EFEBE9;border:2px solid #D7CCC8;display:flex;align-items:center;justify-content:center;margin:0 auto 20px">
          <v-icon size="52" color="#D7CCC8">mdi-image-search-outline</v-icon>
        </div>
        <div class="font-weight-black mb-2" style="font-family:'Georgia',serif;font-size:1.65rem;color:#5D4037">
          {{ search || featuredOnly || artType ? 'No artworks match your filters' : 'No artworks yet' }}
        </div>
        <div class="body-2 mb-6" style="color:#A1887F">
          {{ search ? 'Try different keywords' : artType ? 'No ' + artType + ' artworks found' : featuredOnly ? 'No featured artworks' : 'Be the first to upload!' }}
        </div>
        <v-row justify="center" style="gap:12px" no-gutters>
          <v-btn v-if="search || featuredOnly || artType" rounded depressed color="brown darken-1" dark class="font-weight-bold" style="letter-spacing:0" @click="resetAll">
            Clear filters
          </v-btn>
          <v-btn v-if="isArtist" rounded outlined color="brown darken-1" class="font-weight-bold" style="letter-spacing:0" @click="$router.push('/artist/upload')">
            <v-icon left size="15">mdi-plus</v-icon>Upload artwork
          </v-btn>
        </v-row>
      </div>

      <!-- ARTWORK GRID -->
      <v-row v-else :dense="viewMode === 'list'">
        <v-col
          v-for="art in artworks"
          :key="art._id"
          :cols="viewMode === 'list' ? 12 : 12"
          :sm="viewMode === 'list' ? 12 : 6"
          :md="viewMode === 'grid3' ? 4 : viewMode === 'list' ? 12 : 3"
        >
          <!-- LIST layout -->
          <v-card v-if="viewMode === 'list'"
            flat
            style="border-radius:14px;border:1.5px solid #F0E8E4;overflow:hidden;cursor:pointer;transition:box-shadow 0.25s"
            @mouseover="hoveredId=art._id" @mouseleave="hoveredId=null"
            :style="hoveredId===art._id ? 'box-shadow:0 8px 28px rgba(93,64,55,0.14)' : ''"
            @click="goDetail(art._id)"
          >
            <v-row no-gutters>
              <!-- Image -->
              <v-col cols="auto">
                <div style="width:200px;height:160px;overflow:hidden;flex-shrink:0;position:relative">
                  <img :src="art.image || fallback" :alt="art.title"
                    style="width:200px;height:160px;object-fit:cover;display:block;transition:transform 0.5s"
                    :style="hoveredId===art._id ? 'transform:scale(1.07)' : ''"
                    @error="function(e){ e.target.src = fallback }" />
                  <v-chip v-if="art.isFeatured" x-small dark
                    style="position:absolute;top:8px;left:8px;background:rgba(93,64,55,0.85);font-size:0.6rem;font-weight:700">
                    <v-icon x-small left color="#FFF9C4">mdi-star</v-icon>
                    <span style="color:#FFF9C4">Featured</span>
                  </v-chip>
                </div>
              </v-col>
              <!-- Body -->
              <v-col>
                <v-card-text class="pa-4">
                  <v-row align="start" justify="space-between" no-gutters>
                    <div class="flex-grow-1 mr-4">
                      <div class="font-weight-black mb-1" style="font-family:'Georgia',serif;font-size:1.1rem;color:#2C1810">{{ art.title }}</div>
                      <div class="caption mb-2" style="color:#8D6E63">
                        <v-icon x-small>mdi-account-outline</v-icon> {{ artistName(art) }}
                      </div>
                      <div class="caption mb-3" style="color:#A1887F;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">
                        {{ art.description }}
                      </div>
                      <v-row align="center" no-gutters style="gap:10px">
                        <span class="font-weight-black" style="font-family:'Georgia',serif;font-size:1.05rem;color:#5D4037">
                          ₹{{ Number(art.price||0).toLocaleString('en-IN') }}
                        </span>
                        <v-chip v-if="art.type" x-small :color="typeChipColor(art.type).bg" :text-color="typeChipColor(art.type).text">
                          {{ art.type }}
                        </v-chip>
                        <span class="caption" style="color:#BCAAA4">
                          <v-icon x-small :color="isLiked(art._id) ? 'red darken-1' : '#BCAAA4'">
                            {{ isLiked(art._id) ? 'mdi-heart' : 'mdi-heart-outline' }}
                          </v-icon>
                          {{ art.likes || 0 }}
                        </span>
                      </v-row>
                    </div>
                    <!-- Action buttons -->
                    <v-row no-gutters style="flex-direction:column;gap:6px;flex-shrink:0">
                      <v-btn icon small @click.stop="toggleLike(art)"
                        :color="isLiked(art._id) ? 'red darken-1' : 'brown lighten-3'">
                        <v-icon size="18">{{ isLiked(art._id) ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                      </v-btn>
                      <v-btn icon small color="brown darken-1" @click.stop="addToCart(art)">
                        <v-icon size="18">mdi-cart-plus</v-icon>
                      </v-btn>
                    </v-row>
                  </v-row>
                </v-card-text>
              </v-col>
            </v-row>
          </v-card>

          <!-- GRID layout (grid3 + grid4) -->
          <v-card v-else
            flat
            style="border-radius:18px;overflow:hidden;cursor:pointer;background:white;border:1.5px solid #F0E8E4;transition:transform 0.32s,box-shadow 0.32s"
            :style="hoveredId===art._id
              ? 'transform:translateY(-8px) scale(1.013);box-shadow:0 26px 60px rgba(93,64,55,.2)'
              : 'box-shadow:0 2px 12px rgba(93,64,55,0.07)'"
            @mouseover="hoveredId=art._id"
            @mouseleave="hoveredId=null"
            @click="goDetail(art._id)"
          >
            <!-- Image zone -->
            <div style="position:relative;overflow:hidden;padding-bottom:133%;background:#EDE0DA">
              <img
                :src="art.image || fallback"
                :alt="art.title"
                style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.55s ease"
                :style="hoveredId===art._id ? 'transform:scale(1.08)' : ''"
                @error="function(e){ e.target.src = fallback }"
              />

              <!-- Hover overlay -->
              <div
                style="position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(180deg,rgba(20,8,4,0) 0%,rgba(20,8,4,0.12) 38%,rgba(20,8,4,0.84) 100%);display:flex;flex-direction:column;justify-content:space-between;padding:12px;transition:opacity 0.3s"
                :style="hoveredId===art._id ? 'opacity:1' : 'opacity:0'"
              >
                <!-- Top row: badge + actions -->
                <v-row align="start" justify="space-between" no-gutters>
                  <div>
                    <div v-if="art.isFeatured"
                      style="display:inline-flex;align-items:center;gap:4px;font-size:0.6rem;font-weight:600;letter-spacing:0.07em;text-transform:uppercase;padding:3px 9px;border-radius:50px;background:rgba(93,64,55,0.82);color:#FFF9C4;border:1px solid rgba(255,249,196,0.22)">
                      <v-icon size="10" color="#FFF9C4">mdi-star</v-icon> Featured
                    </div>
                    <div v-else-if="art.type"
                      style="display:inline-flex;align-items:center;gap:4px;font-size:0.6rem;font-weight:600;letter-spacing:0.07em;text-transform:uppercase;padding:3px 9px;border-radius:50px;background:rgba(0,0,0,0.45);color:rgba(255,255,255,0.88)">
                      <v-icon size="10" color="rgba(255,255,255,.85)">{{ artTypeIcon(art.type) }}</v-icon>
                      {{ art.type }}
                    </div>
                  </div>

                  <!-- Like + Cart buttons -->
                  <div style="display:flex;gap:6px">
                    <v-btn fab x-small elevation="0"
                      style="width:35px;height:35px;background:rgba(0,0,0,0.38);border:1.5px solid rgba(255,255,255,0.3)"
                      :style="isLiked(art._id) ? 'border-color:rgba(239,83,80,0.6);background:rgba(239,83,80,0.22)' : ''"
                      @click.stop="toggleLike(art)">
                      <v-icon size="15" :color="isLiked(art._id) ? '#FF6B6B' : 'white'">
                        {{ isLiked(art._id) ? 'mdi-heart' : 'mdi-heart-outline' }}
                      </v-icon>
                    </v-btn>
                    <v-btn fab x-small elevation="0"
                      style="width:35px;height:35px;background:rgba(0,0,0,0.38);border:1.5px solid rgba(255,255,255,0.3)"
                      @click.stop="addToCart(art)">
                      <v-icon size="15" color="white">mdi-cart-plus</v-icon>
                    </v-btn>
                  </div>
                </v-row>

                <!-- Bottom row: CTA + artist -->
                <div>
                  <v-btn block small outlined dark
                    style="border-radius:50px;border-color:rgba(255,255,255,0.3);background:rgba(255,255,255,0.12);text-transform:none;font-weight:600;font-size:0.79rem;letter-spacing:0;margin-bottom:9px"
                    @click.stop="goDetail(art._id)">
                    View Artwork <v-icon size="13" right>mdi-arrow-right</v-icon>
                  </v-btn>
                  <v-row align="center" no-gutters style="gap:7px">
                    <v-avatar size="25" color="brown lighten-2" style="flex-shrink:0;border:1.5px solid rgba(255,255,255,0.3)">
                      <span style="color:white;font-size:0.63rem;font-weight:700">{{ artistInitial(art) }}</span>
                    </v-avatar>
                    <span style="color:rgba(255,255,255,0.82);font-size:0.77rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
                      {{ artistName(art) }}
                    </span>
                  </v-row>
                </div>
              </div>

            </div>

            <!-- Card body -->
            <v-card-text class="pa-4 pb-3">
              <div class="font-weight-black mb-2" style="font-family:'Georgia',serif;font-size:1.02rem;color:#2C1810;line-height:1.35;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">
                {{ art.title }}
              </div>
              <v-row align="center" justify="space-between" no-gutters class="mb-2">
                <span class="caption" style="color:#A1887F;display:flex;align-items:center;gap:3px;max-width:60%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
                  <v-icon size="12" color="#BCAAA4">mdi-account-outline</v-icon>
                  {{ artistName(art) }}
                </span>
                <span class="caption" style="display:flex;align-items:center;gap:3px;flex-shrink:0"
                  :style="isLiked(art._id) ? 'color:#EF5350' : 'color:#BCAAA4'">
                  <v-icon size="12" :color="isLiked(art._id) ? '#EF5350' : '#BCAAA4'">
                    {{ isLiked(art._id) ? 'mdi-heart' : 'mdi-heart-outline' }}
                  </v-icon>
                  {{ art.likes || 0 }}
                </span>
              </v-row>
              <v-row align="center" justify="space-between" no-gutters>
                <span class="font-weight-black" style="font-family:'Georgia',serif;font-size:0.95rem;color:#5D4037">
                  ₹{{ Number(art.price||0).toLocaleString('en-IN') }}
                </span>
                <v-chip v-if="art.type" x-small :color="typeChipColor(art.type).bg" :text-color="typeChipColor(art.type).text"
                  class="font-weight-bold" style="font-size:0.62rem;letter-spacing:0.06em;text-transform:uppercase">
                  {{ art.type }}
                </v-chip>
              </v-row>
            </v-card-text>

          </v-card>
        </v-col>
      </v-row>

      <!-- PAGINATION -->
      <v-row v-if="!loading && !errorMsg && totalPages > 1" justify="center" class="mt-14">
        <v-btn icon :disabled="page <= 1" color="brown darken-1"
          style="border:1.5px solid #E0D4CF;border-radius:12px;background:white;width:42px;height:42px"
          @click="changePage(page-1)">
          <v-icon size="18">mdi-chevron-left</v-icon>
        </v-btn>

        <template v-for="(p, i) in pageButtons">
          <v-btn v-if="p !== '…'" :key="i"
            :color="p === page ? 'brown darken-1' : ''"
            :dark="p === page"
            style="min-width:42px;height:42px;border-radius:12px;border:1.5px solid #E0D4CF;background:white;font-weight:500;font-size:0.88rem;letter-spacing:0;margin:0 2px"
            :style="p === page ? 'font-weight:700' : ''"
            elevation="0"
            @click="changePage(p)"
          >{{ p }}</v-btn>
          <span v-else :key="'e'+i" style="color:#A1887F;padding:0 4px;line-height:42px">…</span>
        </template>

        <v-btn icon :disabled="page >= totalPages" color="brown darken-1"
          style="border:1.5px solid #E0D4CF;border-radius:12px;background:white;width:42px;height:42px"
          @click="changePage(page+1)">
          <v-icon size="18">mdi-chevron-right</v-icon>
        </v-btn>
      </v-row>

    </v-container>

    <!-- Toast -->
    <v-snackbar v-model="toast.show" :color="toast.color" top right timeout="2800">
      <v-icon left size="16">{{ toast.icon }}</v-icon>{{ toast.msg }}
      <template v-slot:action="{ attrs }">
        <v-btn text small v-bind="attrs" @click="toast.show=false" color="white">Close</v-btn>
      </template>
    </v-snackbar>

  </v-app>
</template>

<script>
import artworkService from '@/services/artworkService'
import likeService    from '@/services/likeService'
import cartService    from '@/services/cartService'

export default {
  name: 'ExploreView',

  data: function() {
    return {
      artworks:    [],
      totalCount:  0,
      totalPages:  1,
      page:        1,
      limit:       12,

      search:       '',
      featuredOnly: false,
      artType:      '',
      sortBy:       'newest',

      loading:    true,
      sticky:     false,
      viewMode:   'grid4',
      likedIds:   [],
      errorMsg:   '',
      hoveredId:  null,
      artTypeIndex: null,
      _timer:     null,

      toast: { show: false, msg: '', color: 'success', icon: 'mdi-check' },
      fallback: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',

      allTypeOptions: [
        { label: 'All',          value: '',             icon: 'mdi-palette-outline'  },
        { label: 'Painting',     value: 'painting',     icon: 'mdi-brush'            },

        { label: 'Photography',  value: 'photography',  icon: 'mdi-camera-outline'   },
        { label: 'Illustration', value: 'illustration', icon: 'mdi-pen'              },

      ],

      viewModes: [
        { value: 'grid4', icon: 'mdi-view-grid',              label: '4-col grid' },
        { value: 'grid3', icon: 'mdi-view-dashboard-variant', label: '3-col grid' },
        { value: 'list',  icon: 'mdi-view-agenda-outline',    label: 'List view'  },
      ],
    }
  },

  computed: {
    authed:   function() { return this.$store.getters['auth/isAuthenticated'] },
    isArtist: function() { return this.$store.getters['auth/isArtist'] },

    pageButtons: function() {
      var t = this.totalPages, c = this.page
      if (t <= 7) {
        var arr = []
        for (var i = 1; i <= t; i++) arr.push(i)
        return arr
      }
      if (c <= 4)   return [1, 2, 3, 4, 5, '…', t]
      if (c >= t-3) return [1, '…', t-4, t-3, t-2, t-1, t]
      return [1, '…', c-1, c, c+1, '…', t]
    },
  },

  created: function() {
    var self = this
    if (self.$route.query.search) self.search  = self.$route.query.search
    if (self.$route.query.type)   self.artType = self.$route.query.type
    window.addEventListener('scroll', self.onScroll)
    self.loadArtworks()
    if (self.authed) self.loadLikes()
  },

  beforeDestroy: function() {
    window.removeEventListener('scroll', this.onScroll)
    clearTimeout(this._timer)
  },

  methods: {

    loadArtworks: function() {
      var self = this
      self.loading  = true
      self.errorMsg = ''
      var params = { page: self.page, limit: self.limit, sort: self.sortBy }
      if (self.search.trim())  params.search     = self.search.trim()
      if (self.featuredOnly)   params.isFeatured  = true
      if (self.artType)        params.type        = self.artType

      artworkService.getAll(params)
        .then(function(res) {
          self.artworks   = res.data.artworks || []
          self.totalCount = res.data.total    || 0
          self.totalPages = res.data.pages    || 1
        })
        .catch(function(err) {
          if (!err.response) {
            self.errorMsg = 'Cannot connect to backend — is it running?'
          } else {
            var s   = err.response.status
            var msg = err.response.data && (err.response.data.error || err.response.data.message)
            self.errorMsg = 'Server error ' + s + (msg ? ': ' + msg : '')
          }
        })
        .finally(function() { self.loading = false })
    },

    loadLikes: function() {
      var self = this
      likeService.getUserLikes()
        .then(function(res) {
          var data = res.data || []
          self.likedIds = data.map(function(x) {
            if (typeof x === 'string') return x
            return (x.artwork && (x.artwork._id || x.artwork)) || x._id || x
          })
        })
        .catch(function() {})
    },

    isLiked: function(id) {
      var sid = String(id)
      return this.likedIds.some(function(x) { return String(x) === sid })
    },

    toggleLike: function(art) {
      var self = this
      if (!self.authed) { self.$router.push('/login'); return }
      var was = self.isLiked(art._id)

      // Optimistic update
      if (was) {
        self.likedIds = self.likedIds.filter(function(x) { return String(x) !== String(art._id) })
        art.likes = Math.max(0, (art.likes || 1) - 1)
      } else {
        self.likedIds = self.likedIds.concat([art._id])
        art.likes = (art.likes || 0) + 1
      }

      var req = was ? likeService.unlike(art._id) : likeService.like(art._id)
      req
        .then(function() {
          self.notify(
            was ? 'Removed from likes' : 'Added to likes ♥',
            was ? '#795548' : '#C62828',
            was ? 'mdi-heart-off-outline' : 'mdi-heart'
          )
        })
        .catch(function(e) {
          // Revert
          if (was) {
            self.likedIds = self.likedIds.concat([art._id])
            art.likes = (art.likes || 0) + 1
          } else {
            self.likedIds = self.likedIds.filter(function(x) { return String(x) !== String(art._id) })
            art.likes = Math.max(0, (art.likes || 1) - 1)
          }
          var msg = e.response && e.response.data && e.response.data.message
          self.notify(msg || 'Could not update like', 'error', 'mdi-alert')
        })
    },

    addToCart: function(art) {
      var self = this
      if (!self.authed) { self.$router.push('/login'); return }
      cartService.addToCart({ artworkId: art._id, quantity: 1 })
        .then(function() {
          self.$store.dispatch('cart/fetchCart').catch(function() {})
          self.notify('"' + art.title + '" added to cart', 'success', 'mdi-cart-check')
        })
        .catch(function(e) {
          var msg = e.response && e.response.data && e.response.data.message
          self.notify(msg || 'Could not add to cart', 'error', 'mdi-cart-off')
        })
    },

    goDetail:    function(id) { this.$router.push({ name: 'ArtworkDetail', params: { id: id } }) },
    doSearch:    function()   { this.page = 1; this.loadArtworks() },
    debouncedSearch: function() {
      clearTimeout(this._timer)
      this._timer = setTimeout(this.doSearch, 420)
    },
    clearSearch: function()   { this.search = ''; this.doSearch() },
    setArtType:  function(v)  { this.artType = v; this.page = 1; this.loadArtworks() },
    clearArtType:function()   { this.artType = ''; this.page = 1; this.loadArtworks() },
    toggleFeatured: function(){ this.featuredOnly = !this.featuredOnly; this.page = 1; this.loadArtworks() },
    clearFeatured:  function(){ this.featuredOnly = false; this.page = 1; this.loadArtworks() },
    resetAll: function() {
      this.search = ''; this.artType = ''; this.featuredOnly = false; this.page = 1
      this.loadArtworks()
    },
    changePage: function(p) {
      this.page = p; this.loadArtworks()
      window.scrollTo({ top: 100, behavior: 'smooth' })
    },
    onScroll: function() { this.sticky = window.scrollY > 60 },

    notify: function(msg, color, icon) {
      this.toast = { show: true, msg: msg, color: color || 'success', icon: icon || 'mdi-check' }
    },

    artistName:    function(art) { return art.artist && art.artist.name ? art.artist.name : 'Unknown Artist' },
    artistInitial: function(art) { return art.artist && art.artist.name ? art.artist.name[0].toUpperCase() : 'A' },

    artTypeIcon: function(val) {
      var map = {
        painting: 'mdi-brush', digital: 'mdi-monitor-shimmer',
        photography: 'mdi-camera-outline', illustration: 'mdi-pen',
        abstract: 'mdi-shape-outline', mixed: 'mdi-layers-outline',
      }
      return map[(val || '').toLowerCase()] || 'mdi-palette-outline'
    },

    typeChipColor: function(type) {
      var map = {
        painting:    { bg: '#FBE9E7', text: '#BF360C' },
        photography: { bg: '#E3F2FD', text: '#0D47A1' },
        illustration:{ bg: '#F3E5F5', text: '#4A148C' },
       
      }
      return map[(type || '').toLowerCase()] || { bg: '#EFEBE9', text: '#4E342E' }
    },
  },
}
</script>