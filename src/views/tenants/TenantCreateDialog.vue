<template>
  <el-dialog :model-value="visible" :title="t('CreateTitle')" align-center destroy-on-close :show-close="false"
    style="max-width: 700px" :modal="false" modal-penetrable>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <el-form-item :label="t('NameLabel')" prop="name">
        <el-input v-model="form.name" :placeholder="t('NameLabel')" />
      </el-form-item>
      <el-form-item :label="t('CodeLabel')" prop="code">
        <el-input v-model="form.code" :placeholder="t('CodeLabel')" />
      </el-form-item>
      <el-form-item :label="t('SystemNameLabel')" prop="systemName">
        <el-input v-model="form.systemName" :placeholder="t('SystemNameLabel')" />
      </el-form-item>
      <el-form-item :label="t('ContactNameLabel')" prop="contactName">
        <el-input v-model="form.contactName" :placeholder="t('ContactNameLabel')" />
      </el-form-item>
      <el-form-item :label="t('ContactPhoneLabel')" prop="contactPhone">
        <el-input v-model="form.contactPhone" :placeholder="t('ContactPhoneLabel')" />
      </el-form-item>
      <el-form-item :label="t('ContactEmailLabel')" prop="contactEmail">
        <el-input v-model="form.contactEmail" :placeholder="t('ContactEmailLabel')" />
      </el-form-item>
      <el-form-item :label="t('DomainLabel')" prop="domain">
        <el-input v-model="form.domain" :placeholder="t('DomainLabel')" />
      </el-form-item>
      <el-form-item :label="t('LogoLabel')" prop="logo">
        <el-input v-model="form.logo" :placeholder="t('LogoLabel')" />
      </el-form-item>
      <el-form-item :label="t('StatusLabel')" prop="status">
        <el-select v-model="form.status" :placeholder="t('StatusLabel')">
          <el-option :label="t('Active')" value="ACTIVE" />
          <el-option :label="t('Disabled')" value="DISABLED" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('ExpireTimeLabel')" prop="expireTime">
        <el-date-picker
          v-model="form.expireTime"
          type="datetime"
          :placeholder="t('ExpireTimeLabel')"
          style="width: 100%;"
        />
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

<script setup name="TenantCreateDialog">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { createTenant } from '@/views/tenants/TenantApi'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

const props = defineProps(['visible', 'onSubmit', 'onCancel'])

const formRef = ref(null)
const form = ref({
  name: '',
  code: '',
  systemName: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  domain: '',
  logo: '',
  status: 'ACTIVE',
  expireTime: '',
})

const rules = computed(() => {
  return {
    name: [
      { required: true, message: t('NameRequired'), trigger: 'blur' }
    ],
    code: [
      { required: true, message: t('CodeRequired'), trigger: 'blur' }
    ],
    status: [
      { required: true, message: t('StatusRequired'), trigger: 'change' }
    ],
  }
})

const onCancel = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  form.value = {
    name: '',
    code: '',
    systemName: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    domain: '',
    logo: '',
    status: 'ACTIVE',
    expireTime: '',
  }
  props.onCancel()
}

const onSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    const tenant = {
      name: form.value.name,
      code: form.value.code,
      systemName: form.value.systemName || '',
      contactName: form.value.contactName || '',
      contactPhone: form.value.contactPhone || '',
      contactEmail: form.value.contactEmail || '',
      domain: form.value.domain || '',
      logo: form.value.logo || '',
      status: form.value.status,
      expireTime: form.value.expireTime || '',
    }
    createTenant(tenant).then(() => {
      formRef.value.resetFields()
      props.onSubmit()
    }).catch(error => {
      console.error('Create tenant failed:', error)
      ElMessage.error(error.message || 'Create tenant failed')
    })
  } catch (error) {
    console.error('Form validation failed:', error)
  }
}
</script>

<style scoped></style>


