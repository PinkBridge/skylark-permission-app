<template>
  <div class="dashboard-overview">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>仪表盘</span>
        </div>
      </template>
      <div class="card-content">
        <p>欢迎回来！这里是仪表盘示例内容。</p>
        <el-space wrap>
          <el-statistic title="今日访问" :value="1234" />
          <el-statistic title="待办事项" :value="6" />
          <el-statistic title="消息通知" :value="3" />
        </el-space>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'DashboardOverview'
}
</script>

<style scoped>
.dashboard-overview {
  padding: 20px;
}

.card-header {
  font-weight: 600;
  font-size: 18px;
}

.card-content {
  font-size: 14px;
  color: #666;
}
</style>
