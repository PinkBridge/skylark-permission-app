<template>
  <el-dialog :model-value="visible" :title="t('SelectTitle')" align-center destroy-on-close :show-close="false"
    :modal="false" modal-penetrable width="80%">
    <ApiSearchForm :search="handleSearch" :reset="handleReset" />
    <el-table :data="tableData" style="width: 100%" stripe border show-overflow-tooltip selection-mode="multiple"
      @selection-change="handleSelectionChange" @select="handleSelect" ref="apiTableRef">
      <el-table-column type="selection" width="55" />
      <el-table-column fixed prop="id" :label="t('IDLabel')" width="80"/>
      <el-table-column prop="method" :label="t('MethodLabel')" width="120">
        <template #default="{ row }">
          <el-tag
            :type="row.method === 'GET' ? 'success'
                   : row.method === 'POST' ? 'primary'
                   : row.method === 'PUT' ? 'warning'
                   : row.method === 'DELETE' ? 'danger'
                   : 'info'"
            effect="plain"
          >
            {{ row.method }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="path" :label="t('PathLabel')" max-width="120" />
      <el-table-column prop="permlabel" :label="t('PermLabelLabel')" max-width="120" />
      <el-table-column prop="moduleKey" :label="t('ModuleKeyLabel')" max-width="120" />
      <el-table-column prop="createTime" :label="t('CreatedAtLabel')" max-width="120" />
      <el-table-column prop="updateTime" :label="t('UpdatedAtLabel')" max-width="120" />
    </el-table>
    <div class="pagination-block">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
        :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="default" @click="onCancel">{{ t('CancelButtonText') }}</el-button>
      </div>
    </template>
  </el-dialog>

</template>

<script setup name="ApiSelectTableDialog">
import { ref, watch, onMounted, nextTick } from 'vue'    
import { useI18n } from 'vue-i18n'
import { getApiPage } from '@/views/apis/ApiApi'
import ApiSearchForm from '@/views/apis/ApiSearchForm.vue'
import { getRoleById, toggleRoleApi } from '@/views/roles/RoleApi'

const { t } = useI18n()

const props = defineProps(['visible', 'row', 'onConfirm', 'onCancel'])

// data
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableData = ref([])
const multipleSelection = ref([])
const apiTableRef = ref(null)

// init data
const initData = () => {
  tableData.value = []
  currentPage.value = 1
  pageSize.value = 10
  total.value = 0

  getApiPage(currentPage.value, pageSize.value).then(response => {
    tableData.value = response.records
    currentPage.value = response.page
    pageSize.value = response.size
    total.value = response.total
    getRoleById(props.row.id).then(response => {
      const apiIds = response.apiIds
      nextTick(() => {
        setDefaultSelection(apiIds)
      })
    })
  })
}

// reset data
const handleReset = () => {
  initData()
}

// filter data
const handleSearch = (params) => {
  getApiPage(currentPage.value, pageSize.value, params).then(response => {
    tableData.value = response.records
    currentPage.value = response.page
    pageSize.value = response.size
    total.value = response.total
    getRoleById(props.row.id).then(response => {
      const apiIds = response.apiIds
      nextTick(() => {
        setDefaultSelection(apiIds)
      })
    })
  })
}

// change page size
const handleSizeChange = (size) => {
  pageSize.value = size
  getApiPage(currentPage.value, pageSize.value).then(response => {
    tableData.value = response.records
    currentPage.value = response.page
    pageSize.value = response.size
    total.value = response.total
    getRoleById(props.row.id).then(response => {
      const apiIds = response.apiIds
      nextTick(() => {
        setDefaultSelection(apiIds)
      })
    })
  })
}

// change current page
const handleCurrentChange = (page) => {
  currentPage.value = page
  getApiPage(currentPage.value, pageSize.value).then(response => {
    tableData.value = response.records
    currentPage.value = response.page
    pageSize.value = response.size
    total.value = response.total
    getRoleById(props.row.id).then(response => {
      const apiIds = response.apiIds
      nextTick(() => {
        setDefaultSelection(apiIds)
      })
    })
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
  console.log("handleSelect", selection, row)
  toggleRoleApi(props.row.id, row.id).then(response => {
    console.log("toggleRoleApi", response)
  })
}

const setDefaultSelection = (apiIds) => {
  const table = apiTableRef.value
  if (!table || !Array.isArray(tableData.value) || !Array.isArray(apiIds)) {
    return
  }

  tableData.value.forEach(row => {
    table.toggleRowSelection(row, false)
  })

  nextTick(() => {
    apiIds.forEach(id => {
      const row = tableData.value.find(row => row.id === id)
      if (row) {
        table.toggleRowSelection(row, true)
      }
    })
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
