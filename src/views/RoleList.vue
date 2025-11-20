<template>
  <div class="role-list">
    <h1>角色列表</h1>
    <el-table :data="roles" stripe>
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="description" label="描述" />
    </el-table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'RoleList',
  setup() {
    const roles = ref([])

    onMounted(() => {
      roles.value = [
        { name: '管理员', description: '拥有全部权限' },
        { name: '普通用户', description: '可访问基本功能' }
      ]
    })

    return { roles }
  }
}
</script>

<style scoped>
.role-list {
  padding: 20px;
}

.role-list h1 {
  margin-bottom: 20px;
}
</style>
