<template>
  <el-dialog :model-value="visible" :title="t('CreateTitle')" align-center destroy-on-close :show-close="false"
    style="max-width: 600px" :modal="false" modal-penetrable>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <el-form-item :label="t('UsernameLabel')" prop="username">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item :label="t('LoginIpLabel')" prop="loginIp">
        <el-input v-model="form.loginIp" />
      </el-form-item>
      <el-form-item :label="t('LoginLocationLabel')" prop="loginLocation">
        <el-input v-model="form.loginLocation" />
      </el-form-item>
      <el-form-item :label="t('UserAgentLabel')" prop="userAgent">
        <el-input v-model="form.userAgent" type="textarea" :rows="3" />
      </el-form-item>
      <el-form-item :label="t('LoginStatusLabel')" prop="loginStatus">
        <el-select v-model="form.loginStatus" style="width: 100%;">
          <el-option :label="t('Success')" value="SUCCESS" />
          <el-option :label="t('Failure')" value="FAILURE" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('LoginMessageLabel')" prop="loginMessage">
        <el-input v-model="form.loginMessage" type="textarea" :rows="3" />
      </el-form-item>
      <el-form-item :label="t('LoginTimeLabel')" prop="loginTime">
        <el-date-picker
          v-model="form.loginTime"
          type="datetime"
          style="width: 100%;"
          :placeholder="t('LoginTimeLabel')"
        />
      </el-form-item>
      <el-form-item :label="t('ClientIdLabel')" prop="clientId">
        <el-input v-model="form.clientId" />
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

<script setup name="LoginLogCreateDialog">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { createLoginLog } from '@/views/loginlogs/LoginLogApi'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

const props = defineProps(['visible', 'onSubmit', 'onCancel'])

const formRef = ref(null)
const form = ref({
  username: '',
  loginIp: '',
  loginLocation: '',
  userAgent: '',
  loginStatus: 'SUCCESS',
  loginMessage: '',
  loginTime: '',
  clientId: ''
})

const rules = {
  username: [
    { required: true, message: t('UsernameRequired'), trigger: 'blur' }
  ],
  loginStatus: [
    { required: true, message: t('LoginStatusRequired'), trigger: 'change' }
  ]
}

const onSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const loginLogData = {
        username: form.value.username,
        loginIp: form.value.loginIp || null,
        loginLocation: form.value.loginLocation || null,
        userAgent: form.value.userAgent || null,
        loginStatus: form.value.loginStatus,
        loginMessage: form.value.loginMessage || null,
        loginTime: form.value.loginTime ? new Date(form.value.loginTime).toISOString() : null,
        clientId: form.value.clientId || null
      }
      createLoginLog(loginLogData).then(() => {
        ElMessage.success(t('CreateSuccess'))
        // Reset form
        form.value = {
          username: '',
          loginIp: '',
          loginLocation: '',
          userAgent: '',
          loginStatus: 'SUCCESS',
          loginMessage: '',
          loginTime: '',
          clientId: ''
        }
        props.onSubmit()
      }).catch(error => {
        console.error('Create failed:', error)
        ElMessage.error(error.message || t('CreateFailed'))
      })
    } else {
      return false
    }
  })
}

const onCancel = () => {
  formRef.value?.resetFields()
  props.onCancel()
}
</script>

<style scoped></style>

