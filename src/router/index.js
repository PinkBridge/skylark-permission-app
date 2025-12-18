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
      title: 'Welcome',
      requiresAuth: false
    }
  },
  {
    path: '/home',
    component: () => import('@/views/Home.vue'),
    name: 'Home',
    meta: {
      title: 'Home',
      requiresAuth: false // Need to handle OAuth callback here, relax restriction
    },
    children: [
      {
        path: '/perm/users',
        name: 'UserDataList',
        component: () => import('@/views/users/UserDataList.vue'),
        meta: {
          title: 'Users',
          requiresAuth: true
        }
      },
      {
        path: '/perm/roles',
        name: 'RoleDataList',
        component: () => import('@/views/roles/RoleDataList.vue'),
        meta: {
          title: 'Roles',
          requiresAuth: true
        }
      },
      {
        path: '/system/apis',
        name: 'ApiDataList',
        component: () => import('@/views/apis/ApiDataList.vue'),
        meta: {
          title: 'Apis',
          requiresAuth: true
        }
      },
      {
        path: '/system/whitelist',
        name: 'WhitelistDataList',
        component: () => import('@/views/whitelist/WhitelistDataList.vue'),
        meta: {
          title: 'Whitelists',
          requiresAuth: true
        }
      },
      {
        path: '/system/menus',
        name: 'MenuDataList',
        component: () => import('@/views/menus/MenuDataList.vue'),
        meta: {
          title: 'Menus',
          requiresAuth: true
        }
      },
      {
        path: '/system/apps',
        name: 'AppDataList',
        component: () => import('@/views/apps/AppDataList.vue'),
        meta: {
          title: 'Apps',
          requiresAuth: true
        }
      },
      {
        path: '/perm/orgs',
        name: 'OrgDataList',
        component: () => import('@/views/orgs/OrgDataList.vue'),
        meta: {
          title: 'Orgs',
          requiresAuth: true
        }
      },
      {
        path: '/perm/tenants',
        name: 'TenantDataList',
        component: () => import('@/views/tenants/TenantDataList.vue'),
        meta: {
          title: 'Tenants',
          requiresAuth: true
        }
      },
      {
        path: '/perm/resources',
        name: 'ResourceDataList',
        component: () => import('@/views/resources/ResourceDataList.vue'),
        meta: {
          title: 'Resources',
          requiresAuth: true
        }
      },
      {
        path: '/logger/loging',
        name: 'LoginLogDataList',
        component: () => import('@/views/loginlogs/LoginLogDataList.vue'),
        meta: {
          title: 'LoginLogs',
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
      title: 'NotFound'
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
  } else if (to.name === 'home' && authenticated) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router