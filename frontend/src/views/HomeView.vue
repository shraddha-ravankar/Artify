<template>
  <div
    v-scroll="onScroll"
    :style="{ fontFamily: '\'Outfit\', sans-serif', background: '#F8F3F0', overflowX: 'hidden' }"
  >

    <div :style="{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
    }">

      <v-img
        src="@/assets/images/hero.jpg"
        height="100%"
        width="100%"
        cover
        :style="{ position: 'absolute', inset: '0', zIndex: '0' }"
      />

      <div :style="{
        position: 'absolute',
        inset: '0',
        zIndex: '1',
        background: 'linear-gradient(100deg, rgba(12,4,2,0.93) 0%, rgba(12,4,2,0.78) 38%, rgba(12,4,2,0.22) 68%, transparent 100%)',
      }" />

      <!-- content centered -->
      <v-container :style="{ position: 'relative', zIndex: '2' }">
        <v-row justify="center">
          <v-col cols="12" class="py-16 text-center">

            
            <div :style="{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              border: '1px solid rgba(200,169,126,0.38)',
              borderRadius: '50px',
              padding: '6px 18px 6px 12px',
              marginBottom: '32px',
              opacity: hero ? '1' : '0',
              transform: hero ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
            }">
              <div :style="{
                width: '20px', height: '20px',
                borderRadius: '50%',
                background: 'rgba(200,169,126,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }">
                <v-icon size="11" color="#C8A97E">mdi-star-four-points</v-icon>
              </div>
              <span :style="{
                color: 'rgba(215,204,200,0.82)',
                fontSize: '10px',
                fontWeight: '700',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }">Curated Fine Art Marketplace</span>
            </div>

            <!-- title -->
            <div :style="{
              fontFamily: '\'Playfair Display\', Georgia, serif',
              color: '#FFFFFF',
              fontSize: 'clamp(50px, 6.2vw, 86px)',
              fontWeight: '700',
              lineHeight: '1.04',
              letterSpacing: '-0.02em',
              marginBottom: '26px',
              opacity: hero ? '1' : '0',
              transform: hero ? 'translateY(0)' : 'translateY(32px)',
              transition: 'opacity 0.8s ease 0.28s, transform 0.8s ease 0.28s',
            }">
              The Refined <span :style="{ color: '#FFCCBC', fontStyle: 'italic' }">Canvas</span>
            </div>


            <div :style="{
              width: hero ? '56px' : '0px',
              height: '2px',
              background: 'linear-gradient(to right, rgba(200,169,126,0.8), transparent)',
              borderRadius: '2px',
              margin: '0 auto 26px',
              transition: 'width 0.7s ease 0.52s',
            }" />

           
            <div :style="{
              color: 'rgba(255,255,255,0.60)',
              fontSize: '17px',
              fontWeight: '300',
              lineHeight: '1.95',
              maxWidth: '420px',
              margin: '0 auto 44px',
              textAlign: 'center',
              opacity: hero ? '1' : '0',
              transform: hero ? 'translateY(0)' : 'translateY(22px)',
              transition: 'opacity 0.8s ease 0.46s, transform 0.8s ease 0.46s',
            }">
              A digital space where artists showcase their creativity and collectors discover beautiful artworks.
            </div>

           
            <div :style="{
              display: 'flex',
              gap: '14px',
              flexWrap: 'wrap',
              marginBottom: '60px',
              justifyContent: 'center',
              opacity: hero ? '1' : '0',
              transform: hero ? 'translateY(0)' : 'translateY(18px)',
              transition: 'opacity 0.8s ease 0.62s, transform 0.8s ease 0.62s',
            }">
              <v-btn
                large depressed to="/explore"
                :style="{
                  background: '#C8A97E',
                  color: '#1C0F0A',
                  borderRadius: '50px',
                  fontWeight: '700',
                  fontSize: '14px',
                  padding: '0 36px',
                  height: '54px',
                  textTransform: 'none',
                  letterSpacing: '0.02em',
                  boxShadow: '0 8px 28px rgba(200,169,126,0.38)',
                }"
              >Explore Collection</v-btn>

              <v-btn
                large outlined to="/signup"
                :style="{
                  borderColor: 'rgba(255,255,255,0.32)',
                  color: '#EFEBE9',
                  borderRadius: '50px',
                  fontWeight: '600',
                  fontSize: '14px',
                  padding: '0 36px',
                  height: '54px',
                  textTransform: 'none',
                  letterSpacing: '0.02em',
                }"
              >Artist Access</v-btn>
            </div>

            
            <div :style="{
              display: 'flex',
              gap: '24px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              opacity: hero ? '1' : '0',
              transition: 'opacity 1s ease 0.88s',
            }">
              <div
                v-for="t in trustBadges"
                :key="t.label"
                :style="{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }"
              >
                <v-icon size="14" color="#C8A97E">{{ t.icon }}</v-icon>
                <span :style="{
                  color: 'rgba(255,255,255,0.45)',
                  fontSize: '12px',
                  fontWeight: '500',
                  letterSpacing: '0.04em',
                }">{{ t.label }}</span>
              </div>
            </div>

          </v-col>
        </v-row>
      </v-container>

    </div>


    <div :style="{ background: '#2C1810', padding: '16px 0', overflow: 'hidden' }">
      <div :style="{
        display: 'flex',
        gap: '52px',
        animation: 'trc-mq 28s linear infinite',
        whiteSpace: 'nowrap',
        width: 'max-content',
      }">
        <span
          v-for="(w, i) in marqueeWords.concat(marqueeWords)"
          :key="'mq'+i"
          :style="{
            color: w === '✦' ? '#C8A97E' : 'rgba(255,255,255,0.22)',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }"
        >{{ w }}</span>
      </div>
    </div>


    <div data-section="how" :style="{ background: '#EFEBE9', padding: '72px 0' }">
      <v-container>
        <v-row justify="center" class="mb-10">
          <v-col cols="12" class="text-center">
            <div :style="{
              color: '#A1887F',
              fontSize: '10px',
              fontWeight: '700',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: '12px',
              opacity: how ? '1' : '0',
              transform: how ? 'translateY(0)' : 'translateY(18px)',
              transition: 'opacity 0.65s ease, transform 0.65s ease',
            }">How It Works</div>
            <div :style="{
              fontFamily: '\'Playfair Display\', serif',
              fontSize: 'clamp(26px, 3.5vw, 38px)',
              fontWeight: '700',
              color: '#2C1810',
              lineHeight: '1.2',
              opacity: how ? '1' : '0',
              transform: how ? 'translateY(0)' : 'translateY(18px)',
              transition: 'opacity 0.65s ease 0.12s, transform 0.65s ease 0.12s',
            }">Collect Art in Three Steps</div>
          </v-col>
        </v-row>

        <v-row>
          <v-col
            v-for="(step, i) in howItWorks"
            :key="step.title"
            cols="12" md="4"
          >
            <div :style="{
              background: 'white',
              borderRadius: '20px',
              padding: '36px 28px',
              height: '100%',
              position: 'relative',
              boxShadow: '0 2px 16px rgba(93,64,55,0.07)',
              opacity: how ? '1' : '0',
              transform: how ? 'translateY(0)' : 'translateY(28px)',
              transition: `opacity 0.65s ease ${0.18 + i * 0.14}s, transform 0.65s ease ${0.18 + i * 0.14}s`,
            }">

            
              <div :style="{
                fontFamily: '\'Playfair Display\', serif',
                fontSize: '80px',
                fontWeight: '700',
                color: 'rgba(200,169,126,0.1)',
                lineHeight: '1',
                position: 'absolute',
                top: '16px',
                right: '24px',
                userSelect: 'none',
              }">{{ String(i+1).padStart(2,'0') }}</div>

          
              <div :style="{
                width: '52px', height: '52px',
                borderRadius: '14px',
                background: 'rgba(200,169,126,0.12)',
                border: '1px solid rgba(200,169,126,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }">
                <v-icon size="24" color="#8D6E63">{{ step.icon }}</v-icon>
              </div>

              <div :style="{
                fontFamily: '\'Playfair Display\', serif',
                fontSize: '18px',
                fontWeight: '700',
                color: '#2C1810',
                marginBottom: '10px',
              }">{{ step.title }}</div>
              <div :style="{
                color: '#8D6E63',
                fontSize: '14px',
                lineHeight: '1.75',
                fontWeight: '300',
              }">{{ step.desc }}</div>

            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>


    <div data-section="feat" :style="{ background: '#F8F3F0', paddingTop: '88px', paddingBottom: '96px' }">
      <v-container>

        <!-- header -->
        <v-row align="end" justify="space-between" class="mb-10 px-1">
          <v-col cols="12" sm="auto">
            <div :style="{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px',
              opacity: feat ? '1' : '0',
              transform: feat ? 'translateX(0)' : 'translateX(-16px)',
              transition: 'opacity 0.65s ease, transform 0.65s ease',
            }">
              <div :style="{
                width: '28px', height: '1.5px',
                background: '#A1887F',
                borderRadius: '2px',
              }" />
              <span :style="{
                color: '#A1887F',
                fontSize: '10px',
                fontWeight: '700',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }">Handpicked Works</span>
            </div>
            <div :style="{
              fontFamily: '\'Playfair Display\', serif',
              fontSize: 'clamp(28px, 4vw, 44px)',
              color: '#2C1810',
              fontWeight: '700',
              lineHeight: '1.1',
              opacity: feat ? '1' : '0',
              transform: feat ? 'translateX(0)' : 'translateX(-16px)',
              transition: 'opacity 0.65s ease 0.1s, transform 0.65s ease 0.1s',
            }">Featured Collection</div>
            <div :style="{
              color: '#8D6E63',
              fontSize: '15px',
              marginTop: '8px',
              fontWeight: '300',
              opacity: feat ? '1' : '0',
              transition: 'opacity 0.65s ease 0.2s',
            }">The most admired works from our artists</div>
          </v-col>
          <v-col cols="12" sm="auto" class="pb-1">
            <v-btn
              outlined to="/explore"
              :style="{
                borderColor: '#D7CCC8',
                color: '#5D4037',
                fontWeight: '700',
                fontSize: '12px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                borderRadius: '50px',
                padding: '0 24px',
                height: '40px',
              }"
            >View All →</v-btn>
          </v-col>
        </v-row>

    
        <v-row v-if="featuredLoading">
          <v-col v-for="n in 4" :key="'sk'+n" cols="12" sm="6" md="3">
            <v-skeleton-loader type="card" :style="{ borderRadius: '18px' }" />
          </v-col>
        </v-row>

        <!-- exact same ArtworkCard as Explore page -->
        <v-row v-else-if="featuredArtworks && featuredArtworks.length">
          <v-col
            v-for="(art, i) in featuredArtworks.slice(0, 4)"
            :key="art._id"
            cols="12" sm="6" md="3"
            :style="{
              opacity: feat ? '1' : '0',
              transform: feat ? 'translateY(0)' : 'translateY(24px)',
              transition: `opacity 0.65s ease ${0.08 + i * 0.11}s, transform 0.65s ease ${0.08 + i * 0.11}s`,
            }"
          >
            <artwork-card :artwork="art" :delay="i * 0.1" />
          </v-col>
        </v-row>

        <v-row v-else justify="center">
          <v-col cols="12" class="text-center py-16">
            <v-icon size="52" color="brown lighten-3">mdi-image-outline</v-icon>
            <div :style="{ color: '#8D6E63', marginTop: '14px', fontSize: '16px' }">
              No featured artworks yet
            </div>
          </v-col>
        </v-row>

      </v-container>
    </div>


    <!-- ══════════════════════════════════════════
         JOIN THE COLLECTIVE
    ══════════════════════════════════════════ -->
    <div data-section="join" :style="{ position: 'relative', background: '#1C0F0A', overflow: 'hidden' }">

      <!-- background image -->
      <img
        src="@/assets/images/pic.jpg"
        alt=""
        :style="{
          position: 'absolute',
          inset: '0',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: '0.45',
          display: 'block',
          zIndex: '0',
        }"
      />

      <!-- left-heavy overlay -->
      <div :style="{
        position: 'absolute',
        inset: '0',
        zIndex: '1',
        background: 'linear-gradient(105deg, rgba(12,4,2,0.92) 0%, rgba(12,4,2,0.65) 50%, rgba(12,4,2,0.28) 100%)',
      }" />

      <v-container :style="{ position: 'relative', zIndex: '2', paddingTop: '100px', paddingBottom: '100px' }">
        <v-row align="center">

          <!-- left text -->
          <v-col cols="12" md="6">
            <div :style="{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid rgba(200,169,126,0.3)',
              borderRadius: '50px',
              padding: '5px 16px',
              marginBottom: '24px',
              opacity: join ? '1' : '0',
              transform: join ? 'translateY(0)' : 'translateY(18px)',
              transition: 'opacity 0.65s ease, transform 0.65s ease',
            }">
              <span :style="{
                color: '#C8A97E',
                fontSize: '10px',
                fontWeight: '700',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }">For Creators</span>
            </div>

            <div :style="{
              fontFamily: '\'Playfair Display\', serif',
              color: '#EFEBE9',
              fontSize: 'clamp(34px, 4vw, 54px)',
              fontWeight: '700',
              lineHeight: '1.1',
              marginBottom: '20px',
              opacity: join ? '1' : '0',
              transform: join ? 'translateY(0)' : 'translateY(22px)',
              transition: 'opacity 0.65s ease 0.14s, transform 0.65s ease 0.14s',
            }">
              Join the<br/>
              <span :style="{ fontStyle: 'italic', color: '#FFCCBC' }">Collective</span>
            </div>

            <div :style="{
              color: 'rgba(215,204,200,0.65)',
              fontSize: '16px',
              fontWeight: '300',
              lineHeight: '1.9',
              maxWidth: '400px',
              marginBottom: '36px',
              opacity: join ? '1' : '0',
              transform: join ? 'translateY(0)' : 'translateY(18px)',
              transition: 'opacity 0.65s ease 0.26s, transform 0.65s ease 0.26s',
            }">
              Showcase your artwork to collectors worldwide and become
              part of an exclusive community of visionary creators.
            </div>

            <div :style="{
              display: 'flex',
              gap: '14px',
              flexWrap: 'wrap',
              opacity: join ? '1' : '0',
              transform: join ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity 0.65s ease 0.38s, transform 0.65s ease 0.38s',
            }">
              <v-btn
                large depressed to="/signup"
                :style="{
                  background: '#C8A97E',
                  color: '#1C0F0A',
                  borderRadius: '50px',
                  fontWeight: '700',
                  fontSize: '14px',
                  padding: '0 36px',
                  height: '52px',
                  textTransform: 'none',
                  boxShadow: '0 8px 28px rgba(200,169,126,0.3)',
                }"
              >Register as Artist</v-btn>
              <v-btn
                large text to="/explore"
                :style="{
                  color: 'rgba(239,235,233,0.60)',
                  fontWeight: '600',
                  fontSize: '14px',
                  textTransform: 'none',
                }"
              >Browse artworks →</v-btn>
            </div>
          </v-col>

          <!-- right: artist perks — desktop only -->
          <v-col cols="12" md="6" class="d-none d-md-block">
            <div :style="{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxWidth: '320px',
              marginLeft: 'auto',
            }">
              <div
                v-for="(perk, i) in artistPerks"
                :key="perk.title"
                :style="{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(200,169,126,0.14)',
                  borderLeft: '3px solid rgba(200,169,126,0.5)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  opacity: join ? '1' : '0',
                  transform: join ? 'translateX(0)' : 'translateX(24px)',
                  transition: `opacity 0.6s ease ${0.28 + i * 0.09}s, transform 0.6s ease ${0.28 + i * 0.09}s`,
                }"
              >
                <v-icon size="20" color="#C8A97E">{{ perk.icon }}</v-icon>
                <div>
                  <div :style="{
                    color: 'rgba(255,255,255,0.88)',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '2px',
                  }">{{ perk.title }}</div>
                  <div :style="{
                    color: 'rgba(255,255,255,0.35)',
                    fontSize: '12px',
                  }">{{ perk.desc }}</div>
                </div>
              </div>
            </div>
          </v-col>

        </v-row>
      </v-container>
    </div>

    <!-- marquee keyframe -->
    <component :is="'style'">
      @keyframes trc-mq {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }
    </component>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import ArtworkCard  from '@/components/ui/ArtworkCard.vue'

export default {
  name: 'HomeView',
  components: { ArtworkCard },

  data: () => ({
    featuredLoading: false,

    // animation flags
    hero: false,
    how:  false,
    feat: false,
    join: false,

    // cached offsets
    howTop:  9999,
    featTop: 9999,
    joinTop: 9999,

    trustBadges: [
      { icon: 'mdi-shield-check-outline',  label: 'Verified Artists'   },
      { icon: 'mdi-lock-outline',           label: 'Secure Payments'    },
      { icon: 'mdi-truck-delivery-outline', label: 'Insured Delivery'   },
    ],

    marqueeWords: [
      'Original Artworks', '✦', 'Verified Artists', '✦',
      'Secure Checkout',   '✦', 'Direct from Creator', '✦',
      'Curated Collection','✦', 'Fine Art Marketplace', '✦',
    ],

    howItWorks: [
      {
        icon:  'mdi-magnify',
        title: 'Discover',
        desc:  'Browse thousands of original artworks curated from verified artists across every style and medium.',
      },
      {
        icon:  'mdi-heart-outline',
        title: 'Connect',
        desc:  'Like artworks, chat directly with artists, and learn the story behind every piece before you buy.',
      },
      {
        icon:  'mdi-package-variant-closed',
        title: 'Collect',
        desc:  'Purchase securely with Razorpay or Cash on Delivery and receive your artwork with insured shipping.',
      },
    ],

    artistPerks: [
      { icon: 'mdi-cash-multiple',         title: 'Keep 85% Revenue',  desc: 'Best commission in the market'     },
      { icon: 'mdi-account-group-outline', title: 'Global Audience',   desc: 'Reach collectors worldwide'        },
      { icon: 'mdi-chart-line',            title: 'Sales Dashboard',   desc: 'Track orders and earnings live'    },
      { icon: 'mdi-palette-outline',       title: 'Free to Join',      desc: 'No upfront fees, ever'             },
    ],
  }),

  computed: {
    ...mapState(['featuredArtworks']),
  },

  mounted () {
    // hero fires immediately on page load
    this.$nextTick(() => {
      setTimeout(() => { this.hero = true }, 80)
      this.loadFeatured()
      this.cacheOffsets()
    })
    window.addEventListener('resize', this.cacheOffsets)
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.cacheOffsets)
  },

  methods: {
    cacheOffsets () {
      this.$el.querySelectorAll('[data-section]').forEach(el => {
        const top = el.getBoundingClientRect().top + window.scrollY
        if (el.dataset.section === 'how')  this.howTop  = top
        if (el.dataset.section === 'feat') this.featTop = top
        if (el.dataset.section === 'join') this.joinTop = top
      })
    },

    // v-scroll directive — fires on every scroll event
    onScroll () {
      const trigger = window.scrollY + window.innerHeight * 0.80
      if (!this.how  && trigger > this.howTop)  this.how  = true
      if (!this.feat && trigger > this.featTop) this.feat = true
      if (!this.join && trigger > this.joinTop) this.join = true
    },

    async loadFeatured () {
      if (!this.featuredArtworks || !this.featuredArtworks.length) {
        this.featuredLoading = true
      }
      await this.$store.dispatch('fetchFeatured')
      this.featuredLoading = false
    },
  },
}
</script>