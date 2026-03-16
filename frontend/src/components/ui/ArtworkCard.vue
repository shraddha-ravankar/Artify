<template>
  <v-card
    flat
    :style="cardStyle"
    style="border-radius:18px;overflow:hidden;cursor:pointer;background:white;border:1.5px solid #F0E8E4;transition:transform 0.32s,box-shadow 0.32s"
    @mouseover="hovered = true"
    @mouseleave="hovered = false"
    @click="goToDetail"
  >
    <!-- ─── IMAGE ZONE ─── -->
    <div style="position:relative;overflow:hidden;padding-bottom:133%;background:#EDE0DA">
      <img
        :src="artwork.image || placeholder"
        :alt="artwork.title"
        style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.55s ease"
        :style="hovered ? 'transform:scale(1.08)' : ''"
        @error="onImgError"
      />

      <!-- ── HOVER OVERLAY (shown on default / explore / home) ── -->
      <div
        v-if="!showActions && !showUnlike"
        style="position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(180deg,rgba(20,8,4,0) 0%,rgba(20,8,4,0.12) 38%,rgba(20,8,4,0.84) 100%);display:flex;flex-direction:column;justify-content:space-between;padding:12px;transition:opacity 0.3s"
        :style="hovered ? 'opacity:1' : 'opacity:0'"
      >
        <!-- Top: badge + action buttons -->
        <v-row align="start" justify="space-between" no-gutters>
          <div>
            <div
              v-if="artwork.isFeatured"
              style="display:inline-flex;align-items:center;gap:4px;font-size:0.6rem;font-weight:600;letter-spacing:0.07em;text-transform:uppercase;padding:3px 9px;border-radius:50px;background:rgba(93,64,55,0.82);color:#FFF9C4;border:1px solid rgba(255,249,196,0.22)"
            >
              <v-icon size="10" color="#FFF9C4">mdi-star</v-icon> Featured
            </div>
            <div
              v-else-if="artwork.type"
              style="display:inline-flex;align-items:center;gap:4px;font-size:0.6rem;font-weight:600;letter-spacing:0.07em;text-transform:uppercase;padding:3px 9px;border-radius:50px;background:rgba(0,0,0,0.45);color:rgba(255,255,255,0.88)"
            >
              <v-icon size="10" color="rgba(255,255,255,.85)">{{ artTypeIcon(artwork.type) }}</v-icon>
              {{ artwork.type }}
            </div>
          </div>

          <!-- Like + Cart -->
          <div style="display:flex;gap:6px">
            <v-btn
              fab x-small elevation="0"
              style="width:35px;height:35px;background:rgba(0,0,0,0.38);border:1.5px solid rgba(255,255,255,0.3)"
              :style="liked ? 'border-color:rgba(239,83,80,0.6);background:rgba(239,83,80,0.22)' : ''"
              @click.stop="onLike"
            >
              <v-icon size="15" :color="liked ? '#FF6B6B' : 'white'">
                {{ liked ? 'mdi-heart' : 'mdi-heart-outline' }}
              </v-icon>
            </v-btn>
            <v-btn
              fab x-small elevation="0"
              style="width:35px;height:35px;background:rgba(0,0,0,0.38);border:1.5px solid rgba(255,255,255,0.3)"
              @click.stop="onCart"
            >
              <v-icon size="15" color="white">mdi-cart-plus</v-icon>
            </v-btn>
          </div>
        </v-row>

        <!-- Bottom: view CTA + artist -->
        <div>
          <v-btn
            block small outlined dark
            style="border-radius:50px;border-color:rgba(255,255,255,0.3);background:rgba(255,255,255,0.12);text-transform:none;font-weight:600;font-size:0.79rem;letter-spacing:0;margin-bottom:9px"
            @click.stop="goToDetail"
          >
            View Artwork <v-icon size="13" right>mdi-arrow-right</v-icon>
          </v-btn>
          <v-row align="center" no-gutters style="gap:7px">
            <v-avatar size="25" color="brown lighten-2" style="flex-shrink:0;border:1.5px solid rgba(255,255,255,0.3)">
              <span style="color:white;font-size:0.63rem;font-weight:700">{{ artistInitial }}</span>
            </v-avatar>
            <span style="color:rgba(255,255,255,0.82);font-size:0.77rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
              {{ artistName }}
            </span>
          </v-row>
        </div>
      </div>

      <!-- ── ARTIST DASHBOARD overlay badges (no hover actions) ── -->
      <template v-if="showActions">
        <v-chip
          v-if="artwork.isFeatured"
          x-small dark
          style="position:absolute;top:10px;left:10px;background:rgba(93,64,55,0.85);font-weight:700;font-size:0.6rem"
        >
          <v-icon x-small left color="#FFF9C4">mdi-star</v-icon>
          <span style="color:#FFF9C4">Featured</span>
        </v-chip>
        <v-chip
          v-if="artwork.type"
          x-small
          style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.42);color:rgba(255,255,255,0.9);font-size:0.6rem"
        >
          {{ artwork.type }}
        </v-chip>
      </template>

      <!-- ── USER LIKED overlay: unlike button ── -->
      <template v-if="showUnlike">
        <v-chip
          v-if="artwork.isFeatured"
          x-small dark
          style="position:absolute;top:10px;left:10px;background:rgba(93,64,55,0.85);font-weight:700;font-size:0.6rem"
        >
          <v-icon x-small left color="#FFF9C4">mdi-star</v-icon>
          <span style="color:#FFF9C4">Featured</span>
        </v-chip>
        <div
          style="position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:flex-end;padding:10px;background:linear-gradient(180deg,transparent 55%,rgba(20,8,4,0.72) 100%);transition:opacity 0.3s"
          :style="hovered ? 'opacity:1' : 'opacity:0'"
        >
          <v-btn
            block small dark
            style="border-radius:50px;background:rgba(239,83,80,0.82);border:1.5px solid rgba(239,83,80,0.5);text-transform:none;font-weight:600;font-size:0.78rem;letter-spacing:0"
            @click.stop="onUnlike"
          >
            <v-icon size="14" left>mdi-heart-off-outline</v-icon>
            Remove Like
          </v-btn>
        </div>
      </template>
    </div>

    <!-- ─── CARD BODY ─── -->
    <v-card-text class="pa-4 pb-3">
      <div
        class="font-weight-black mb-2"
        style="font-family:'Georgia',serif;font-size:1.02rem;color:#2C1810;line-height:1.35;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical"
      >
        {{ artwork.title }}
      </div>

      <v-row align="center" justify="space-between" no-gutters class="mb-2">
        <span
          class="caption"
          style="color:#A1887F;display:flex;align-items:center;gap:3px;max-width:60%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"
        >
          <v-icon size="12" color="#BCAAA4">mdi-account-outline</v-icon>
          {{ artistName }}
        </span>
        <!-- red heart always visible; clickable to unlike when showUnlike -->
        <span
          class="caption"
          style="display:flex;align-items:center;gap:3px;flex-shrink:0"
          :style="[
            liked ? 'color:#EF5350' : 'color:#BCAAA4',
            showUnlike ? 'cursor:pointer' : '',
          ]"
          @click.stop="showUnlike ? onUnlike() : null"
        >
          <v-icon size="12" :color="liked ? '#EF5350' : '#BCAAA4'">
            {{ liked ? 'mdi-heart' : 'mdi-heart-outline' }}
          </v-icon>
          {{ artwork.likes || 0 }}
        </span>
      </v-row>

      <v-row align="center" justify="space-between" no-gutters>
        <span class="font-weight-black" style="font-family:'Georgia',serif;font-size:0.95rem;color:#5D4037">
          ₹{{ Number(artwork.price || 0).toLocaleString('en-IN') }}
        </span>
        <v-chip
          v-if="artwork.type"
          x-small
          :color="typeChipColor(artwork.type).bg"
          :text-color="typeChipColor(artwork.type).text"
          class="font-weight-bold"
          style="font-size:0.62rem;letter-spacing:0.06em;text-transform:uppercase"
        >
          {{ artwork.type }}
        </v-chip>
      </v-row>
    </v-card-text>

    <!-- ─── ARTIST DASHBOARD ACTIONS ─── -->
    <template v-if="showActions">
      <v-divider />
      <v-card-actions class="pa-3" style="gap:8px">
        <v-btn
          outlined small color="brown darken-1"
          class="font-weight-bold flex-grow-1"
          style="border-radius:10px;letter-spacing:0;background:#EFEBE9;text-transform:none"
          @click.stop="$emit('edit', artwork)"
        >
          <v-icon x-small left>mdi-pencil-outline</v-icon>Edit
        </v-btn>
        <v-btn
          outlined small color="red lighten-1"
          class="font-weight-bold flex-grow-1"
          style="border-radius:10px;letter-spacing:0;background:#FFF5F5;text-transform:none"
          :loading="deleting"
          @click.stop="$emit('delete', artwork)"
        >
          <v-icon x-small left>mdi-trash-can-outline</v-icon>Delete
        </v-btn>
      </v-card-actions>
    </template>
  </v-card>
</template>

<script>
export default {
  name: 'ArtworkCard',

  props: {
    artwork: {
      type: Object,
      required: true,
    },
    // true  → show Edit / Delete buttons (artist dashboard)
    showActions: {
      type: Boolean,
      default: false,
    },
    // true  → show "Remove Like" hover action (user liked tab)
    showUnlike: {
      type: Boolean,
      default: false,
    },
    // pass true/false from parent if parent tracks liked state
    isLiked: {
      type: Boolean,
      default: false,
    },
    // pass true when the delete API call is in progress for this card
    deleting: {
      type: Boolean,
      default: false,
    },
    // animation stagger delay in seconds
    delay: {
      type: Number,
      default: 0,
    },
  },

  data: function () {
    return {
      hovered: false,
      liked: this.isLiked,
      placeholder: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80',
    }
  },

  watch: {
    isLiked: function (val) {
      this.liked = val
    },
  },

  computed: {
    artistName: function () {
      return this.artwork.artist && this.artwork.artist.name
        ? this.artwork.artist.name
        : 'Unknown Artist'
    },
    artistInitial: function () {
      return this.artwork.artist && this.artwork.artist.name
        ? this.artwork.artist.name[0].toUpperCase()
        : 'A'
    },
    cardStyle: function () {
      var base = this.hovered
        ? 'transform:translateY(-8px) scale(1.013);box-shadow:0 26px 60px rgba(93,64,55,.2)'
        : 'box-shadow:0 2px 12px rgba(93,64,55,0.07)'
      if (this.delay) {
        base += ';transition-delay:' + this.delay + 's'
      }
      return base
    },
  },

  methods: {
    goToDetail: function () {
      var id = this.artwork._id || this.artwork.id
      this.$router.push({ name: 'ArtworkDetail', params: { id: id } })
    },

    onLike: function () {
      this.$emit('like', this.artwork)
    },

    onCart: function () {
      this.$emit('cart', this.artwork)
    },

    onUnlike: function () {
      this.$emit('unlike', this.artwork)
    },

    onImgError: function (e) {
      e.target.src = this.placeholder
    },

    artTypeIcon: function (val) {
      var map = {
        painting: 'mdi-brush',
        digital: 'mdi-monitor-shimmer',
        photography: 'mdi-camera-outline',
        illustration: 'mdi-pen',
        abstract: 'mdi-shape-outline',
        mixed: 'mdi-layers-outline',
      }
      return map[(val || '').toLowerCase()] || 'mdi-palette-outline'
    },

    typeChipColor: function (type) {
      var map = {
        painting: { bg: '#FBE9E7', text: '#BF360C' },
        photography: { bg: '#E3F2FD', text: '#0D47A1' },
        illustration: { bg: '#F3E5F5', text: '#4A148C' },
      }
      return map[(type || '').toLowerCase()] || { bg: '#EFEBE9', text: '#4E342E' }
    },
  },
}
</script>