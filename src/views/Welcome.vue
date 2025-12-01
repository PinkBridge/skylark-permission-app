<template>
  <div class="index-container">
    <div class="index-content">
      <div class="logo-section">
        <div class="logo-placeholder">
          <img v-if="tenant && tenant.logo" :src="tenant.logo ? tenant.logo : '@/assets/logo.png'" alt="Logo"
            style="width: 120px; height: 120px; border-radius: 50%;" />
        </div>
        <h1 class="app-title">{{ tenant && tenant.systemName ? tenant.systemName : 'Skylark' }}</h1>
      </div>

      <div class="action-section">
        <el-button type="primary" size="large" class="action-button" @click="handleLogin">
          Login
        </el-button>
        <el-button type="default" size="large" class="action-button" @click="handleRegister">
          Register
        </el-button>
      </div>
      <div class="footer-section">
        <p>© 2025 {{ tenant && tenant.name ? tenant.name : 'Skylark' }}. All rights reserved.</p>
        <p>Powered by {{ tenant && tenant.name ? tenant.name : 'Skylark' }}</p>
        <p>Address: {{ tenant && tenant.address ? tenant.address : '123 Main St, Anytown, USA' }}</p>
        <p>Email: <a href="mailto:{{ tenant && tenant.contactEmail ? tenant.contactEmail : 'support@skylark.com' }}" target="_blank">{{ tenant && tenant.contactEmail ? tenant.contactEmail : 'support@skylark.com' }}</a></p>
        <p>Phone: <a href="tel:{{ tenant && tenant.contactPhone ? tenant.contactPhone : '+1234567890' }}" target="_blank">{{ tenant && tenant.contactPhone ? tenant.contactPhone : '+1234567890' }}</a></p>
      </div>
    </div>  
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { Avatar } from '@element-plus/icons-vue'
import { getAuthorizationUrl } from '@/api/oauth'
import { ref, onMounted } from 'vue'
import { getTenantByDomain } from '@/utils/tenant'

export default {
  name: 'WelcomePage',
  setup() {
    const handleLogin = () => {
      // redirect to OAuth2 authorization server
      const authUrl = getAuthorizationUrl()
      window.location.href = authUrl
    }

    const handleRegister = () => {
      // registration function, can be implemented according to needs
      ElMessage.info('Registration function under development...')
    }

    const tenant = ref(null)

    onMounted(() => {
      getTenantByDomain(window.location.hostname).then(tenantData => {
        if (tenantData) {
          tenant.value = tenantData
        }
      })
    })

    return {
      handleLogin,
      handleRegister,
      Avatar,
      tenant
    }
  }
}
</script>

<style scoped>
.index-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #667eea 100%);
  padding: 20px;
}

.index-content {
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 60px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 100%;
}

.logo-section {
  margin-bottom: 40px;
  position: relative;
  padding: 30px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.logo {
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.logo-placeholder {
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-title {
  font-size: 32px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
}

.app-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.action-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 40px;
}

.action-button {
  width: 100%;
  height: 50px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-sizing: border-box;
  margin: 0;
}

.action-button:first-child {
  /* background: linear-gradient(135deg, #667eea 0%, #e6e4e9 100%); */
  border: none;
}

.action-button:first-child:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.action-button:last-child:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* 确保按钮内部元素对齐 */
.action-button :deep(.el-button__inner) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.footer-section {
  font-size: 14px;
  margin-top: 20px;
}

.footer-section p {
  padding: 3px 0;
}
</style>