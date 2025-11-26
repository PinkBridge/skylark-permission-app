<template>
  <el-dialog :model-value="visible" :title="t('CreateTitle')" align-center destroy-on-close :show-close="false"
    style="max-width: 600px" :modal="false" modal-penetrable>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <el-form-item :label="t('NameLabel')" prop="name">
        <el-input v-model="form.name" :placeholder="t('NameLabel')" />
      </el-form-item>
      <el-form-item :label="t('ParentNameLabel')" prop="parentName">
        <el-input v-model="form.parentName" :placeholder="t('ParentNameLabel')" />
      </el-form-item>
      <el-form-item :label="t('PathLabel')" prop="path">
        <el-input v-model="form.path" :placeholder="t('PathLabel')" />
      </el-form-item>
      <el-form-item :label="t('HiddenLabel')" prop="hidden">
        <el-select v-model="form.hidden" :placeholder="t('HiddenLabel')">
          <el-option :label="t('Yes')" :value="true" />
          <el-option :label="t('No')" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('ModuleKeyLabel')" prop="moduleKey">
        <el-input v-model="form.moduleKey" :placeholder="t('ModuleKeyLabel')" />
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

<script setup name="MenuCreateDialog">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { createMenu } from '@/views/menus/MenuApi'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

const props = defineProps(['visible', 'onSubmit', 'onCancel'])

const formRef = ref(null)
const form = ref({
  name: '',
  parentName: '',
  path: '',
  hidden: false,
  moduleKey: '',
})

const rules = computed(() => {
  return {
    name: [
      { required: true, message: t('NameRequired'), trigger: 'blur' }
    ],
  }
})

const onCancel = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  form.value = {
    name: '',
    parentName: '',
    path: '',
    hidden: false,
    moduleKey: '',
  }
  props.onCancel()
}

const onSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    const menu = {
      name: form.value.name,
      parentName: form.value.parentName || '',
      path: form.value.path || '',
      hidden: form.value.hidden,
      moduleKey: form.value.moduleKey || '',
    }
    createMenu(menu).then(() => {
      formRef.value.resetFields()
      props.onSubmit()
    }).catch(error => {
      console.error('Create menu failed:', error)
      ElMessage.error(error.message || 'Create menu failed')
    })
  } catch (error) {
    console.error('Form validation failed:', error)
  }
}
</script>

<style scoped></style>

