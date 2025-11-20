<template>
  <el-menu class="el-menu-vertical" :default-active="activeMenu" router background-color="#001529" 
  text-color="#fff" active-text-color="#ffd04b">
    <template v-for="group in menuItems" :key="group.id">
      <el-sub-menu :index="String(group.id)">
        <template #title>
          <el-icon>
            <component :is="resolveIcon(group.icon)" />
          </el-icon>
          <span>{{ group.name }}</span>
        </template>
        <el-menu-item v-for="item in group.children" :key="item.id" :index="resolveMenuIndex(item)">
          <el-icon>
            <component :is="resolveIcon(item.icon)" />
          </el-icon>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </el-sub-menu>
    </template>
  </el-menu>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as Icons from '@element-plus/icons-vue'
import { getMyMenuTree } from '../api/menu'
import { getAccessToken } from '../utils/auth'

const iconMap = {
  HomeFilled: Icons.HomeFilled,
  Setting: Icons.Setting,
  Menu: Icons.Menu,
  User: Icons.User,
  UserFilled: Icons.UserFilled,
  Role: Icons.Medal,
  App: Icons.Grid,
  Log: Icons.Document,
  Parameter: Icons.CollectionTag,
  Tenant: Icons.OfficeBuilding,
  Notification: Icons.Bell,
  Default: Icons.Menu
}

export default {
  name: 'MenuComponent',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const activeMenu = ref(route.path.startsWith('/home') ? route.path : '/home')
    const menuItems = ref([])
    const loadedFromServer = ref(false)

    const resolveIcon = (name) => iconMap[name] || iconMap.Default
    const resolveMenuIndex = (item) => {
      if (item?.path) return String(item.path)
      return item?.id ? String(item.id) : ''
    }

    const selectFirstChild = () => {
      if (!menuItems.value.length) return
      const firstGroup = menuItems.value[0]
      const firstChild = firstGroup?.children?.[0]
      const targetPath = firstChild?.path ? String(firstChild.path) : '/home'

      if (!route.path.startsWith('/home') || route.path === '/home' || route.path === '/home/') {
        router.replace(targetPath)
      }
      activeMenu.value = targetPath
    }

    const fetchMenuTree = async () => {
      if (loadedFromServer.value) return
      try {
        const data = await getMyMenuTree()
        if (data) {
          menuItems.value = data
          loadedFromServer.value = true
          selectFirstChild()
        }
      } catch (error) {
        console.error('Failed to get menu:', error)
        ElMessage.warning('Failed to get menu')
      }
    }

    const tryFetchWithToken = () => {
      const token = getAccessToken()
      if (token) {
        fetchMenuTree()
      }
    }

    const handleTokenChanged = (event) => {
      if (event.detail?.accessToken) {
        fetchMenuTree()
      }
    }

    onMounted(() => {
      tryFetchWithToken()
      window.addEventListener('auth-token-changed', handleTokenChanged)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('auth-token-changed', handleTokenChanged)
    })

    watch(
      () => route.path,
      (newPath) => {
        if (newPath.startsWith('/home')) {
          activeMenu.value = newPath
        }
      }
    )

    return {
      activeMenu,
      menuItems,
      resolveIcon,
      resolveMenuIndex
    }
  }
}
</script>

<style scoped>
.el-menu-vertical {
  border-right: none;
}

.el-menu-vertical :deep(.el-menu-item.is-active) {
  background-color: #409eff;
  color: #fff;
}

.el-menu-vertical :deep(.el-menu-item.is-active:hover) {
  background-color: #409eff;
}

.el-menu-vertical :deep(.el-menu-item.is-active .el-icon) {
  color: #fff;
}
</style>