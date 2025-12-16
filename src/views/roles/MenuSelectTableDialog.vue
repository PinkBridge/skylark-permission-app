<template>
  <el-dialog :model-value="visible" :title="t('SelectTitle')" align-center destroy-on-close :show-close="false"
    :modal="false" modal-penetrable width="80%">
    <MenuSearchForm :search="handleSearch" :reset="handleReset" />
    <el-table :data="tableData" style="width: 100%" stripe border show-overflow-tooltip selection-mode="multiple"
      ref="menuTableRef" row-key="id" @selection-change="handleSelectionChange" @select="handleSelect"
      :tree-props="{ checkStrictly: true }">
      <el-table-column type="selection" width="55" />
      <el-table-column fixed prop="id" :label="t('IDLabel')" width="80" />
      <el-table-column prop="name" :label="t('NameLabel')" width="150" />
      <el-table-column prop="icon" :label="t('IconLabel')" width="80">
        <template #default="{ row }">
          <el-icon v-if="row.icon" :size="20">
            <component :is="row.icon" />
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column prop="type" :label="t('TypeLabel')" width="100">
        <template #default="{ row }">
          <el-tag :type="row.type == 'menu' ? 'success' : 'danger'">
            {{ row.type == 'menu' ? t('MenuLabel') : t('ButtonLabel') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="path" :label="t('PathLabel')" min-width="150" />
      <el-table-column prop="permlabel" :label="t('PermLabel')" min-width="150" />
      <el-table-column prop="moduleKey" :label="t('ModuleKeyLabel')" min-width="120" />
      <el-table-column prop="hidden" :label="t('HiddenLabel')" width="100">
        <template #default="{ row }">
          <el-tag :type="row.hidden == true ? 'danger' : 'success'">
            {{ row.hidden == true ? t('Yes') : t('No') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="t('CreatedAtLabel')" width="180" />
      <el-table-column prop="updateTime" :label="t('UpdatedAtLabel')" width="180" />
    </el-table>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="default" @click="onCancel">{{ t('CancelButtonText') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="MenuSelectTableDialog">
import { ref, watch, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { getMenuList } from '@/views/menus/MenuApi'
import MenuSearchForm from '@/views/menus/MenuSearchForm.vue'
import { getRoleById, toggleRoleMenu } from '@/views/roles/RoleApi'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

const props = defineProps(['visible', 'row', 'onConfirm', 'onCancel'])

// data
const tableData = ref([])
const multipleSelection = ref([])  
const menuTableRef = ref(null)
const searchParams = ref({})

// Expand first level only
const expandFirstLevel = () => {
  const table = menuTableRef.value
  if (!table || !Array.isArray(tableData.value)) return

  nextTick(() => {
    tableData.value.forEach(rootNode => {
      table.toggleRowExpansion(rootNode, true)
    })
  })
}

// init data
const initData = () => {
  tableData.value = []
  searchParams.value = {}

  getMenuList(searchParams.value).then(response => {
    // Handle response format: could be array directly or wrapped in data property
    const menuTree = Array.isArray(response) ? response : (response.data || response.list || [])
    tableData.value = menuTree
    expandFirstLevel()

    getRoleById(props.row.id).then(response => {
      const menuIds = response.menuIds || []
      nextTick(() => {
        setDefaultSelection(menuIds)
      })
    })
  }).catch(error => {
    console.error('Failed to get menu list:', error)
  })
}

// reset data
const handleReset = (params) => {
  searchParams.value = params || {}
  initData()
}

// filter data
const handleSearch = (params) => {
  searchParams.value = params
  getMenuList(searchParams.value).then(response => {
    const menuTree = Array.isArray(response) ? response : (response.data || response.list || [])
    tableData.value = menuTree
    expandFirstLevel()
    getRoleById(props.row.id).then(response => {
      const menuIds = response.menuIds || []
      nextTick(() => {
        setDefaultSelection(menuIds)
      })
    })
  }).catch(error => {
    console.error('Failed to search menu list:', error)
  })
}

// cancel
const onCancel = () => {
  props.onCancel()
}

const handleSelectionChange = (val) => {
  multipleSelection.value = val
  console.log("handleSelectionChange", multipleSelection.value)
}

const handleSelect = (selection, row) => {
  const table = menuTableRef.value
  // 如果选中的菜单有子集，需要递归所有子菜单id并添加到menuIds中
  const menuIds = [row.id]
  if (row.children && Array.isArray(row.children) && row.children.length > 0) {
    row.children.forEach(child => {
      menuIds.push(child.id)
    })
  }
  toggleRoleMenu(props.row.id, menuIds).then(response => {
    console.log("toggleRoleMenu", props.row.id, menuIds, response)
  }).catch(error => {
    ElMessage.error(error.message)
    table.toggleRowSelection(row, false)
  })
}

const setDefaultSelection = (menuIds) => {
  const table = menuTableRef.value
  if (!table || !Array.isArray(tableData.value) || !Array.isArray(menuIds)) {
    return
  }

  // Recursive function to find and select nodes
  const selectNodes = (nodes) => {
    nodes.forEach(node => {
      // Clear selection first
      table.toggleRowSelection(node, false)
      
      // Check if this node should be selected
      if (menuIds.includes(node.id)) {
        nextTick(() => {
          table.toggleRowSelection(node, true)
        })
      }
      
      // Recursively process children
      if (node.children && Array.isArray(node.children) && node.children.length > 0) {
        selectNodes(node.children)
      }
    })
  }

  // First clear all selections
  tableData.value.forEach(row => {
    table.toggleRowSelection(row, false)
  })

  // Then select matching nodes
  nextTick(() => {
    selectNodes(tableData.value)
  })
}

// mounted
onMounted(() => {
  console.log("onMounted", props.row)
  initData()
})

// Watch for dialog visibility changes
watch(() => props.visible, (newVal) => {
  if (newVal && props.row?.id) {
    // Dialog opened, reload data
    initData()
  }
})
</script>

<style scoped>
.pagination-block {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.buttons-block {
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-start;
}
</style>

