import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '../utils/auth'
import { getAuthorizationUrl } from '../api/oauth'

// route configuration
const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: () => import('../views/Welcome.vue'), 
    meta: {
      title: '欢迎页',
      requiresAuth: false // no need to login to access
    }
  },
  {
    path: '/home',
    name: 'HomeCallback',
    component: () => import('../views/Home.vue'), // OAuth2 callback route
    meta: {
      title: '首页',
      requiresAuth: false // allow callback, internal processing
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '控制台',
      requiresAuth: true // 需要登录才能访问
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: {
      title: '关于',
      requiresAuth: true
    }
  },
  {
    path: '/:pathMatch(.*)*', // 404 页面
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '页面不存在'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// route guard - control access permission
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Permission App'

  // check if authenticated (using OAuth2 token)
  const authenticated = isAuthenticated()
  // OAuth2 callback route (/home), allow direct access, internal processing of code
  if (to.name === 'HomeCallback') {
    next()
    return
  }
  
  if (to.meta.requiresAuth && !authenticated) {
    // need to login but not logged in, redirect to OAuth2 authorization server
    const authUrl = getAuthorizationUrl()
    window.location.href = authUrl
    return
  } else if (to.name === 'Login' && authenticated) {
    // logged in user visits login page, redirect to dashboard
    next({ name: 'Dashboard' })
  } else if (to.name === 'Welcome' && authenticated) {
    // logged in user visits home page, redirect to dashboard
    next({ name: 'Dashboard' })
  } else {
    // normal access
    next()
  }
})

export default router