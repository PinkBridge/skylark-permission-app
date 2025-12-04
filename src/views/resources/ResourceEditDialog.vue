<template>
  <el-dialog :model-value="visible" :title="t('EditTitle')" align-center destroy-on-close :modal="false"
    modal-penetrable :show-close="false" style="max-width: 700px">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <el-form-item :label="t('IDLabel')" prop="id">
        <el-input v-model="form.id" :disabled="true" />
      </el-form-item>
      <el-form-item :label="t('NameLabel')" prop="name">
        <el-input v-model="form.name" :placeholder="t('NameLabel')" />
      </el-form-item>
      <el-form-item :label="t('OriginalNameLabel')" prop="originalName">
        <el-input v-model="form.originalName" :placeholder="t('OriginalNameLabel')" />
      </el-form-item>
      <el-form-item :label="t('FileTypeLabel')" prop="fileType">
        <el-select v-model="form.fileType" :placeholder="t('FileTypeLabel')" style="width: 100%;">
          <el-option :label="t('FileTypeImage')" value="IMAGE" />
          <el-option :label="t('FileTypeDocument')" value="DOCUMENT" />
          <el-option :label="t('FileTypeVideo')" value="VIDEO" />
          <el-option :label="t('FileTypeAudio')" value="AUDIO" />
          <el-option :label="t('FileTypeOther')" value="OTHER" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('FilePathLabel')" prop="filePath">
        <el-input v-model="form.filePath" :placeholder="t('FilePathLabel')" />
      </el-form-item>
      <el-form-item :label="t('FileSizeLabel')" prop="fileSize">
        <el-input-number v-model="form.fileSize" :min="0" :placeholder="t('FileSizeLabel')" style="width: 100%;" />
      </el-form-item>
      <el-form-item :label="t('MimeTypeLabel')" prop="mimeType">
        <el-input v-model="form.mimeType" :placeholder="t('MimeTypeLabel')" />
      </el-form-item>
      <el-form-item :label="t('UrlLabel')" prop="url">
        <el-input v-model="form.url" :placeholder="t('UrlLabel')" />
      </el-form-item>
      <el-form-item :label="t('DescriptionLabel')" prop="description">
        <el-input v-model="form.description" type="textarea" :rows="3" :placeholder="t('DescriptionLabel')" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onCancel">{{ t('CancelButtonText') }}</el-button>
        <el-button type="primary" @click="onSubmit">{{ t('ConfirmButtonText') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getResourceById, updateResourceById } from '@/views/resources/ResourceApi'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

const props = defineProps(['visible', 'row', 'onSubmit', 'onCancel'])

const formRef = ref(null)
const form = ref({
  id: '',
  name: '',
  originalName: '',
  fileType: 'OTHER',
  filePath: '',
  fileSize: 0,
  mimeType: '',
  url: '',
  description: '',
})

const rules = computed(() => {
  return {
    name: [
      { required: true, message: t('NameRequired'), trigger: 'blur' }
    ],
    originalName: [
      { required: true, message: t('OriginalNameRequired'), trigger: 'blur' }
    ],
    fileType: [
      { required: true, message: t('FileTypeRequired'), trigger: 'change' }
    ],
    filePath: [
      { required: true, message: t('FilePathRequired'), trigger: 'blur' }
    ],
  }
})

const fetchResourceData = () => {
  if (props.row && props.row.id) {
    getResourceById(props.row.id).then(response => {
      const data = response.resource || response || {}
      form.value = {
        id: data.id || '',
        name: data.name || '',
        originalName: data.originalName || '',
        fileType: data.fileType || 'OTHER',
        filePath: data.filePath || '',
        fileSize: data.fileSize || 0,
        mimeType: data.mimeType || '',
        url: data.url || '',
        description: data.description || '',
      }
    }).catch(error => {
      console.error('Failed to get resource information:', error)
      ElMessage.error(error.message || 'Failed to get resource information')
    })
  }
}

const onSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    const resource = {
      name: form.value.name,
      originalName: form.value.originalName,
      fileType: form.value.fileType,
      filePath: form.value.filePath,
      fileSize: form.value.fileSize || 0,
      mimeType: form.value.mimeType || '',
      url: form.value.url || '',
      description: form.value.description || '',
    }
    updateResourceById(form.value.id, resource).then(() => {
      props.onSubmit()
    }).catch(error => {
      console.error('Update resource failed:', error)
      ElMessage.error(error.message || 'Update resource failed')
    })
  } catch (error) {
    console.error('Form validation failed:', error)
  }
}

const onCancel = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  props.onCancel()
}

watch(
  () => [props.visible, props.row?.id],
  ([visible, id]) => {
    if (visible && id) {
      fetchResourceData()
    }
  },
  { immediate: true }
)
</script>

<style scoped></style>
