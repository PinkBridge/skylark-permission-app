import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '../utils/auth'
import { getAuthorizationUrl } from '../api/oauth'

// route configuration
const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: () => import('@/views/Welcome.vue'),
    meta: {
      title: '欢迎页',
      requiresAuth: false
    }
  },
  {
    path: '/home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '控制台',
      requiresAuth: false // Need to handle OAuth callback here, relax restriction
    },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/DashboardOverview.vue'),
        meta: {
          title: '仪表盘',
          requiresAuth: true
        }
      },
      {
        path: '/system/users',
        name: 'UserList',
        component: () => import('@/views/UserList.vue'),
        meta: {
          title: '用户管理',
          requiresAuth: true
        }
      },
      {
        path: '/system/roles',
        name: 'RoleList',
        component: () => import('@/views/RoleList.vue'),
        meta: {
          title: '角色管理',
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
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

  const authenticated = isAuthenticated()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  // If it's an OAuth callback (with code), allow entering Home first to handle it
  if (to.query.code) {
    next()
    return
  }

  if (requiresAuth && !authenticated) {
    const authUrl = getAuthorizationUrl()
    window.location.href = authUrl
  } else if (to.name === 'Welcome' && authenticated) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router