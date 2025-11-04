<template>
  <div class="about-container">
    <el-container>
      <el-header class="header">
        <div class="header-content">
          <h2>关于我们</h2>
          <el-button @click="goBack">返回</el-button>
        </div>
      </el-header>
      <el-main>
        <el-card>
          <template #header>
            <div class="card-header">
              <span>系统信息</span>
            </div>
          </template>
          <div class="about-content">
            <h3>权限管理系统</h3>
            <p>这是一个基于 Vue 3 + Element Plus 开发的权限管理系统示例。</p>
            <el-divider />
            <h4>技术栈：</h4>
            <ul>
              <li>Vue 3</li>
              <li>Vue Router 4</li>
              <li>Element Plus</li>
            </ul>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'AboutPage',
  setup() {
    const router = useRouter()

    const goBack = () => {
      router.back()
    }

    return {
      goBack
    }
  }
}
</script>

<style scoped>
.about-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h2 {
  margin: 0;
  color: #333;
  font-size: 20px;
}

.about-content {
  padding: 20px;
}

.about-content h3 {
  color: #409eff;
  margin-bottom: 15px;
}

.about-content h4 {
  color: #333;
  margin-top: 20px;
  margin-bottom: 10px;
}

.about-content ul {
  text-align: left;
  max-width: 400px;
  margin: 0 auto;
}

.about-content li {
  margin: 8px 0;
  color: #666;
}
</style>
