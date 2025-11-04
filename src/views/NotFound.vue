<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1>404</h1>
      <p>页面不存在</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'NotFoundPage',
  setup() {
    const router = useRouter()

    const goHome = () => {
      router.push({ name: 'Dashboard' })
    }

    return {
      goHome
    }
  }
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.not-found-content {
  text-align: center;
  color: #fff;
}

.not-found-content h1 {
  font-size: 120px;
  margin: 0;
  line-height: 1;
}

.not-found-content p {
  font-size: 24px;
  margin: 20px 0 30px;
}
</style>
