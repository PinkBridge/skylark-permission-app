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
        name: 'UserDataList',
        component: () => import('@/views/users/UserDataList.vue'),
        meta: {
          title: '用户管理',
          requiresAuth: true
        }
      },
      {
        path: '/system/roles',
        name: 'RoleDataList',
        component: () => import('@/views/roles/RoleDataList.vue'),
        meta: {
          title: '角色管理',
          requiresAuth: true
        }
      },
      {
        path: '/system/apis',
        name: 'ApiDataList',
        component: () => import('@/views/apis/ApiDataList.vue'),
        meta: {
          title: 'API管理',
          requiresAuth: true
        }
      },
      {
        path: '/system/whitelist',
        name: 'WhitelistDataList',
        component: () => import('@/views/whitelist/WhitelistDataList.vue'),
        meta: {
          title: '白名单管理',
          requiresAuth: true
        }
      },
      {
        path: '/system/menus',
        name: 'MenuDataList',
        component: () => import('@/views/menus/MenuDataList.vue'),
        meta: {
          title: '菜单管理',
          requiresAuth: true
        }
      },
      {
        path: '/system/apps',
        name: 'AppDataList',
        component: () => import('@/views/apps/AppDataList.vue'),
        meta: {
          title: '应用管理',
          requiresAuth: true
        }
      },
      {
        path: '/system/orgs',
        name: 'OrgDataList',
        component: () => import('@/views/orgs/OrgDataList.vue'),
        meta: {
          title: '组织管理',
          requiresAuth: true
        }
      },
      {
        path: '/system/tenants',
        name: 'TenantDataList',
        component: () => import('@/views/tenants/TenantDataList.vue'),
        meta: {
          title: '租户管理',
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