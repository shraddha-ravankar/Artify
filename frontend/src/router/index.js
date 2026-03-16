import Vue       from 'vue'
import VueRouter from 'vue-router'
import store     from '@/store'

Vue.use(VueRouter)

const routes = [
  { path: '/',                 name: 'Home',            component: () => import('@/views/HomeView.vue') },
  { path: '/explore',          name: 'Explore',         component: () => import('@/views/ExploreView.vue') },

  /* ── Artwork detail — was commented out, now active ── */
  { path: '/artworks/:id',     name: 'ArtworkDetail',   component: () => import('@/views/ArtworkDetailView.vue') },

  { path: '/login',            name: 'Login',           component: () => import('@/views/LoginView.vue') },
  { path: '/signup',           name: 'Signup',          component: () => import('@/views/SignupView.vue') },

  { path: '/dashboard',        name: 'UserDashboard',   component: () => import('@/views/UserDashboardView.vue'),   meta: { requiresAuth: true } },
  { path: '/cart',             name: 'Cart',            component: () => import('@/views/CartView.vue'),            meta: { requiresAuth: true } },
  { path: '/orders',           name: 'Orders',          component: () => import('@/views/OrdersView.vue'),          meta: { requiresAuth: true } },

  /* ── Chat — duplicate removed ── */
  { path: '/chat',             name: 'Chat',            component: () => import('@/views/ChatView.vue'),            meta: { requiresAuth: true } },

  { path: '/artist/dashboard', name: 'ArtistDashboard', component: () => import('@/views/ArtistDashboardView.vue'), meta: { requiresAuth: true, roles: ['artist', 'admin'] } },


 

  { path: '*', redirect: '/' },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior: function() { return { x: 0, y: 0 } },
})

/* ── helpers ── */
function getUser() {
  var u = store.getters['auth/currentUser']
  if (u) return u
  try { return JSON.parse(localStorage.getItem('user') || 'null') } catch(e) { return null }
}

function isLoggedIn() {
  return !!(store.getters['auth/isAuthenticated'] || localStorage.getItem('token'))
}

router.beforeEach(function(to, from, next) {
  var auth = isLoggedIn()
  var user = getUser()
  var role = user ? user.role : null

  /* 1. needs login */
  if (to.meta.requiresAuth && !auth) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }

  /* 2. needs specific role */
  if (to.meta.roles && to.meta.roles.length > 0 && auth) {
    if (!role || to.meta.roles.indexOf(role) === -1) {
      if (role === 'user')   return next({ name: 'UserDashboard' })
      if (role === 'artist') return next({ name: 'ArtistDashboard' })
      
      return next({ name: 'Home' })
    }
  }

  /* 3. already logged in visiting login/signup */
  if ((to.name === 'Login' || to.name === 'Signup') && auth && role) {
    if (role === 'artist') return next({ name: 'ArtistDashboard' })
    if (role === 'admin')  return next({ name: 'AdminDashboard' })
    return next({ name: 'UserDashboard' })
  }

  next()
})

export default router