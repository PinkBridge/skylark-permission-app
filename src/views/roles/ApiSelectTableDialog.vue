<template>
  <el-dialog :model-value="visible" :title="t('SelectTitle')" align-center destroy-on-close :show-close="false"
    :modal="false" modal-penetrable width="80%">
    <ApiSearchForm :search="handleSearch" :reset="handleReset" />
    <el-table :data="tableData" style="width: 100%" stripe border show-overflow-tooltip selection-mode="multiple"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" :selectable="selectable" width="55" />
      <el-table-column fixed prop="id" :label="t('IDLabel')" max-width="40" />
      <el-table-column prop="method" :label="t('MethodLabel')" max-width="40" />
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
        <el-button @click="onCancel">{{ t('CancelButtonText') }}</el-button>
        <el-button type="primary" @click="onConfirm">{{ t('ConfirmButtonText') }}</el-button>
      </div>
    </template>
  </el-dialog>

</template>

<script setup name="ApiSelectTableDialog">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getApiPage } from '@/views/apis/ApiApi'
import ApiSearchForm from '@/views/apis/ApiSearchForm.vue'

const { t } = useI18n()

const props = defineProps(['visible', 'row', 'onConfirm', 'onCancel'])

// data
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableData = ref([])
const multipleSelection = ref([])

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
  })
}

// confirm
const onConfirm = () => {
  props.onConfirm()
}

// cancel
const onCancel = () => {
  props.onCancel()
}

const handleSelectionChange = (val) => {
  multipleSelection.value = val
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
