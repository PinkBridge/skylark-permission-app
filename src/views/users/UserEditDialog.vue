<template>
  <el-dialog :model-value="visible" :title="t('EditTitle')" align-center destroy-on-close :modal="false"
    modal-penetrable :show-close="false" style="max-width: 600px">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <el-form-item :label="t('UsernameLabel')" prop="username">
        <el-input v-model="form.username" :disabled="true" />
      </el-form-item>
      <el-form-item :label="t('EmailLabel')" prop="email">
        <el-input v-model="form.email" placeholder="example@email.com" />
      </el-form-item>
      <el-form-item :label="t('PhoneLabel')" prop="phone">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item :label="t('RoleLabel')" prop="role">
        <el-select v-model="form.role">
          <el-option v-for="item in rolesOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('StatusLabel')" prop="status">
        <el-select v-model="form.status">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
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
import { getUserById, updateUserById } from '@/views/users/UserApi'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

const props = defineProps(['visible', 'row', 'onSubmit', 'onCancel'])

const formRef = ref(null)
const form = ref({})
const rolesOptions = ref([
  { label: t('SuperAdmin'), value: '1' },
  { label: t('Admin'), value: '2' },
])
const statusOptions = ref([
  { label: t('Active'), value: 'active' },
  { label: t('Disabled'), value: 'disabled' }
])

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Phone validation regex (supports common formats)
const phoneRegex = /^1[3-9]\d{9}$/

// Validation rules - use computed to react to language changes
const rules = computed(() => {
  const validateEmail = (rule, value, callback) => {
    if (value && !emailRegex.test(value)) {
      callback(new Error(t('EmailFormatError')))
    } else {
      callback()
    }
  }

  const validatePhone = (rule, value, callback) => {
    if (value && !phoneRegex.test(value)) {
      callback(new Error(t('PhoneFormatError')))
    } else {
      callback()
    }
  }

  return {
    email: [
      { validator: validateEmail, trigger: 'blur' }
    ],
    phone: [
      { validator: validatePhone, trigger: 'blur' }
    ],
    role: [
      { required: true, message: t('RoleRequired'), trigger: 'change' }
    ],
    status: [
      { required: true, message: t('StatusRequired'), trigger: 'change' }
    ]
  }
})

const fetchUserData = () => {
  if (props.row && props.row.id) {
    getUserById(props.row.id).then(response => {
      form.value = response.user || {}
    }).catch(error => {
      console.error('Failed to get user information:', error)
      ElMessage.error(error.message || 'Failed to get user information')
    })
  }
}

const onSubmit = async () => {
  if (!formRef.value) return
  
  try {
    // Validate form
    await formRef.value.validate()
    
    // If validation passes, update user
    const user = {
      username: form.value.username,
      email: form.value.email,
      phone: form.value.phone,
      role: form.value.role,
      status: form.value.status
    }
    
    updateUserById(form.value.id, user).then(() => {
      props.onSubmit()
    }).catch(error => {
      console.error('Update user failed:', error)
      ElMessage.error(error.message || 'Update user failed')
    })
  } catch (error) {
    console.error('Form validation failed:', error)
  }
}

const onCancel = () => {
  // Reset form when canceling
  if (formRef.value) {
    formRef.value.resetFields()
  }
  props.onCancel()
}

watch(
  () => [props.visible, props.row?.id],
  ([visible, rowId]) => {
    if (visible && rowId) {
      fetchUserData()
    }
  },
  { immediate: true }
)
</script>
<style scoped></style>