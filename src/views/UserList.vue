<template>
  <div class="user-list-container">
  <el-card style="max-width: 480px">
    <template #header>{{ t('user.name') }}</template>
    <img
      src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
      style="width: 100%"
    />
  </el-card>
  <el-card style="max-width: 480px">
    <template #header>{{ t('user.email') }}</template>
    <img
      src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
      style="width: 100%"
    />
  </el-card>
  <el-card style="max-width: 480px">
    <template #header>{{ t('user.phone') }}</template>
    <img
      src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
      style="width: 100%"
    />
  </el-card>
  <el-card style="max-width: 480px">
    <template #header>{{ t('user.address') }}</template>
    <img
      src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
        style="width: 100%"
      />
    </el-card>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'UserList',
  setup() {
    const { t } = useI18n()
    return {
      t
    }
  }
}
</script>

<style scoped>
.user-list-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
</style>