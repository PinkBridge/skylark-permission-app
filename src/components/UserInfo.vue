<template>
  <el-descriptions border>
    <el-descriptions-item
      :rowspan="2"
      :width="140"
      :label="$t('UserPhotoLabel')"
    >
      <el-image
        style="width: 100px; height: 100px"
        :src="userInfo.avatar"
      />
    </el-descriptions-item>
    <el-descriptions-item :label="$t('UsernameLabel')">{{ userInfo.username }}</el-descriptions-item>
    <el-descriptions-item :label="$t('TelephoneLabel')">{{ userInfo.phone }}</el-descriptions-item>
    <el-descriptions-item :label="$t('EmailLabel')">{{ userInfo.email }}</el-descriptions-item>
    <el-descriptions-item :label="$t('GenderLabel')">{{ userInfo.gender == 1 ? $t('Boy') : $t('Girl') }}</el-descriptions-item>
    <el-descriptions-item :label="$t('RoleLabel')">{{ roles.map(role => role.name).join(',') }}</el-descriptions-item>
    <el-descriptions-item :label="$t('StatusLabel')">{{ userInfo.status == 'active' ? $t('Active') : $t('Disabled') }}</el-descriptions-item>
    <el-descriptions-item :label="$t('CreatedAtLabel')">{{ userInfo.createTime }}</el-descriptions-item>
    <el-descriptions-item :label="$t('PlaceLabel')">{{ userInfo.province + userInfo.city }}</el-descriptions-item>
    <el-descriptions-item :label="$t('AddressLabel')">{{ userInfo.address }}</el-descriptions-item>
  </el-descriptions>
</template>

<script>
import { getMyInfo } from '@/api/me'
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
export default {
  name: 'UserInfoComponent',
  setup() {
    const userInfo = ref({
      avatar: '',
      username: '',
      phone: '',
      email: '',
      gender: '',
      roles: [],
      status: '',
      createTime: '',
      province: '',
      city: '',
      address: ''
    })
    const roles = ref([])
    const fetchUserInfo = async () => {
      try {
      const data = await getMyInfo()
        userInfo.value = data.user
        roles.value = data.roles
      } catch (error) {
        console.error('Failed to get user information:', error)
        ElMessage.error(error.message)
      }
    }
    onMounted(() => {
      fetchUserInfo()
    })
    return {
      userInfo,
      roles
    }
  }
}
</script>

<style scoped>

</style>