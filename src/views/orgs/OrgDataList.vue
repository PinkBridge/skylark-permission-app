<template>
  <el-card shadow="always">
    <OrgSearchForm :search="handleSearch" :reset="handleReset" />
    <div class="buttons-block">
      <el-button type="primary" size="default" :icon="Plus" @click="handleCreate">{{ t('NewButtonLabel') }}</el-button>
      <el-button type="default" size="default" :icon="Refresh" @click="handleRefresh">{{
        t('RefreshButtonLabel') }}</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" stripe border show-overflow-tooltip>
      <el-table-column fixed prop="id" :label="t('IDLabel')" width="80" />
      <el-table-column prop="name" :label="t('NameLabel')" min-width="150" />
      <el-table-column prop="code" :label="t('CodeLabel')" min-width="120" />
      <el-table-column prop="parentOrganization" :label="t('ParentOrganizationLabel')" min-width="150">
        <template #default="{ row }">
          {{ row.parentOrganization ? (row.parentOrganization.name || row.parentOrganization) : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="type" :label="t('TypeLabel')" width="140">
        <template #default="{ row }">
          <el-tag type="info">
            {{ formatType(row.type) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="t('StatusLabel')" width="120">
        <template #default="{ row }">
          <el-tag :type="row.status === 'ACTIVE' ? 'success' : 'danger'">
            {{ row.status === 'ACTIVE' ? t('Active') : t('Disabled') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="t('CreatedAtLabel')" width="180" />
      <el-table-column prop="updateTime" :label="t('UpdatedAtLabel')" width="180" />
      <el-table-column :label="t('OperationsLabel')" min-width="150" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="default" @click="handleDetail(row)">
            {{ t('DetailLabel') }}
          </el-button>
          <el-button link type="primary" size="default" @click="handleEdit(row)">{{ t('EditLabel') }}</el-button>
          <el-button link type="primary" size="default" @click="handleDelete(row.id)">{{ t('DeleteLabel') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-block">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
        :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
    <OrgDetailDialog v-if="detailRow && detailRow.id" :visible="detailDialogVisible" :row="detailRow"
      :onConfirm="handleDetailConfirm" />
    <OrgCreateDialog :visible="createDialogVisible" :onSubmit="handleCreateSubmit" :onCancel="handleCreateCancel" />
    <OrgEditDialog v-if="editRow && editRow.id" :visible="editDialogVisible" :row="editRow"
      :onSubmit="handleEditSubmit" :onCancel="handleEditCancel" />
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getOrgPage, deleteOrgById } from '@/views/orgs/OrgApi'
import { Refresh, Plus } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import OrgSearchForm from '@/views/orgs/OrgSearchForm.vue'
import OrgDetailDialog from '@/views/orgs/OrgDetailDialog.vue'
import OrgCreateDialog from '@/views/orgs/OrgCreateDialog.vue'
import OrgEditDialog from '@/views/orgs/OrgEditDialog.vue'

const { t } = useI18n()

// data
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableData = ref([])
const detailDialogVisible = ref(false)
const createDialogVisible = ref(false)
const editDialogVisible = ref(false)
const detailRow = ref({})
const editRow = ref({})
const searchParams = ref({})

const formatType = (type) => {
  if (!type) return '-'
  if (type === 'COMPANY') return t('OrgTypeCompany')
  if (type === 'DEPARTMENT') return t('OrgTypeDepartment')
  if (type === 'TEAM') return t('OrgTypeTeam')
  return type
}

// init data
const initData = () => {
  tableData.value = []
  currentPage.value = 1
  pageSize.value = 10
  total.value = 0
  searchParams.value = {}
  getOrgPage(currentPage.value, pageSize.value, searchParams.value).then(response => {
    tableData.value = response.records || []
    currentPage.value = response.page || currentPage.value
    pageSize.value = response.size || pageSize.value
    total.value = response.total || 0
  }).catch(error => {
    console.error('Failed to get org page:', error)
    ElMessage.error(error.message || 'Failed to get org page')
  })
}

// reset data
const handleReset = (params) => {
  searchParams.value = params
  initData()
}

// refresh data
const handleRefresh = () => {
  getOrgPage(currentPage.value, pageSize.value, searchParams.value).then(response => {
    tableData.value = response.records || []
    currentPage.value = response.page || currentPage.value
    pageSize.value = response.size || pageSize.value
    total.value = response.total || 0
  }).catch(error => {
    console.error('Failed to refresh org page:', error)
    ElMessage.error(error.message || 'Failed to refresh org page')
  })
}

// filter data
const handleSearch = (params) => {
  searchParams.value = params
  currentPage.value = 1 // Reset to first page on new search
  getOrgPage(currentPage.value, pageSize.value, searchParams.value).then(response => {
    tableData.value = response.records || []
    currentPage.value = response.page || currentPage.value
    pageSize.value = response.size || pageSize.value
    total.value = response.total || 0
  }).catch(error => {
    console.error('Failed to search org page:', error)
    ElMessage.error(error.message || 'Failed to search org page')
  })
}

// new record
const handleCreate = () => {
  createDialogVisible.value = true
}

const handleCreateSubmit = () => {
  initData()
  createDialogVisible.value = false
}

const handleCreateCancel = () => {
  createDialogVisible.value = false
}

// edit record
const handleEdit = (row) => {
  editRow.value = row
  editDialogVisible.value = true
}

const handleEditSubmit = () => {
  handleRefresh()
  editDialogVisible.value = false
}

const handleEditCancel = () => {
  editRow.value = {}
  editDialogVisible.value = false
}

// view record detail
const handleDetail = (row) => {
  detailRow.value = row
  detailDialogVisible.value = true
}

const handleDetailConfirm = () => {
  detailRow.value = {}
  detailDialogVisible.value = false
}

// delete record
const handleDelete = (id) => {
  ElMessageBox.confirm(t('DeleteConfirmLabel'), t('RemoveTitle'), {
    confirmButtonText: t('ConfirmButtonText'),
    cancelButtonText: t('CancelButtonText'),
    type: 'warning',
  }).then(() => {
    deleteOrgById(id).then(() => {
      initData()
      ElMessage.success('Delete successful!')
    }).catch(error => {
      console.error('Delete failed:', error)
      ElMessage.error(error.message || 'Delete failed')
    })
  }).catch(() => {
    // User cancelled, do nothing
  })
}

// change page size
const handleSizeChange = (size) => {
  pageSize.value = size
  getOrgPage(currentPage.value, pageSize.value, searchParams.value).then(response => {
    tableData.value = response.records || []
    currentPage.value = response.page || currentPage.value
    pageSize.value = response.size || pageSize.value
    total.value = response.total || 0
  }).catch(error => {
    console.error('Failed to change page size:', error)
    ElMessage.error(error.message || 'Failed to change page size')
  })
}

// change current page
const handleCurrentChange = (page) => {
  currentPage.value = page
  getOrgPage(currentPage.value, pageSize.value, searchParams.value).then(response => {
    tableData.value = response.records || []
    currentPage.value = response.page || currentPage.value
    pageSize.value = response.size || pageSize.value
    total.value = response.total || 0
  }).catch(error => {
    console.error('Failed to change current page:', error)
    ElMessage.error(error.message || 'Failed to change current page')
  })
}

// mounted
onMounted(() => {
  initData()
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


