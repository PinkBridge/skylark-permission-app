<template>
  <el-menu class="el-menu-vertical" :default-active="activeMenu" router background-color="#001529" 
  text-color="#fff" active-text-color="#ffd04b"  :default-openeds="defaultOpeneds">
    <template v-for="group in menuItems" :key="group.id">
      <el-sub-menu :index="String(group.id)">
        <template #title>
          <component v-if="group.icon" :is="Icons[group.icon]" class="el-icon" />
          <span>{{ group.name }}</span>
        </template>
        <el-menu-item v-for="item in group.children" :key="item.id" :index="resolveMenuIndex(item)">
          <component v-if="item.icon" :is="Icons[item.icon]" class="el-icon" />
          <span>{{ item.name }}</span>
        </el-menu-item>
      </el-sub-menu>
    </template>
  </el-menu>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
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
    const defaultOpeneds = ref([])

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
          // Default expand all first-level menus
          defaultOpeneds.value = menuItems.value.map(item => item.id)
          console.log(defaultOpeneds.value)
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

    onMounted(() => {
      tryFetchWithToken()
      // Poll for token availability if not immediately available
      const checkTokenInterval = setInterval(() => {
        if (!loadedFromServer.value && getAccessToken()) {
          fetchMenuTree()
          clearInterval(checkTokenInterval)
        }
      }, 100)
      
      // Clear interval after 5 seconds to avoid infinite polling
      setTimeout(() => {
        clearInterval(checkTokenInterval)
      }, 5000)
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
      resolveMenuIndex,
      Icons,
      defaultOpeneds
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