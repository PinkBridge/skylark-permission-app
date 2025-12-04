<template>
  <el-dialog :model-value="visible" :title="t('DetailTitle')" align-center destroy-on-close :modal="false"
    modal-penetrable :show-close="false">
    <el-descriptions border>
      <el-descriptions-item :label="t('IDLabel')">{{ resourceInfo.id }}</el-descriptions-item>
      <el-descriptions-item :label="t('NameLabel')">{{ resourceInfo.name }}</el-descriptions-item>
      <el-descriptions-item :label="t('OriginalNameLabel')">{{ resourceInfo.originalName }}</el-descriptions-item>
      <el-descriptions-item :label="t('FileTypeLabel')">
        <el-tag v-if="resourceInfo.fileType === 'IMAGE'" type="primary">{{ t('FileTypeImage') }}</el-tag>
        <el-tag v-else-if="resourceInfo.fileType === 'DOCUMENT'" type="success">{{ t('FileTypeDocument') }}</el-tag>
        <el-tag v-else-if="resourceInfo.fileType === 'VIDEO'" type="warning">{{ t('FileTypeVideo') }}</el-tag>
        <el-tag v-else-if="resourceInfo.fileType === 'AUDIO'" type="info">{{ t('FileTypeAudio') }}</el-tag>
        <el-tag v-else-if="resourceInfo.fileType === 'OTHER'" type="">{{ t('FileTypeOther') }}</el-tag>
        <span v-else>{{ resourceInfo.fileType || '-' }}</span>
      </el-descriptions-item>
      <el-descriptions-item :label="t('FilePathLabel')">{{ resourceInfo.filePath || '-' }}</el-descriptions-item>
      <el-descriptions-item :label="t('FileSizeLabel')">
        {{ formatFileSize(resourceInfo.fileSize) }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('MimeTypeLabel')">{{ resourceInfo.mimeType || '-' }}</el-descriptions-item>
      <el-descriptions-item :label="t('UrlLabel')">
        <a v-if="resourceInfo.url" :href="resourceInfo.url" target="_blank">{{ resourceInfo.url }}</a>
        <span v-else>-</span>
      </el-descriptions-item>
      <el-descriptions-item :label="t('DescriptionLabel')">{{ resourceInfo.description || '-' }}</el-descriptions-item>
      <el-descriptions-item :label="t('TenantIdLabel')">{{ resourceInfo.tenantId || '-' }}</el-descriptions-item>
      <el-descriptions-item :label="t('CreatedAtLabel')">{{ resourceInfo.createTime || '-' }}</el-descriptions-item>
      <el-descriptions-item :label="t('UpdatedAtLabel')">{{ resourceInfo.updateTime || '-' }}</el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="onConfirm">{{ t('ConfirmButtonText') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { getResourceById } from '@/views/resources/ResourceApi'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

const props = defineProps(['visible', 'row', 'onConfirm'])

const resourceInfo = ref({})

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const fetchResourceData = () => {
  if (props.row && props.row.id) {
    getResourceById(props.row.id).then(response => {
      resourceInfo.value = response.resource || response || {}
    }).catch(error => {
      console.error('Failed to get resource information:', error)
      ElMessage.error(error.message || 'Failed to get resource information')
    })
  }
}

const onConfirm = () => {
  props.onConfirm()
}

watch(
  () => [props.visible, props.row?.id],
  ([visible, rowId]) => {
    if (visible && rowId) {
      fetchResourceData()
    }
  },
  { immediate: true }
)
</script>

<style scoped></style>
