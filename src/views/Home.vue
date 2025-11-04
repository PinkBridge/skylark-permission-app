<template>
  <div class="home-container">
    <el-container v-loading="loading" element-loading-text="正在加载 Token 信息...">
      <el-header class="header">
        <div class="header-content">
          <h2>欢迎使用权限管理系统</h2>
        </div>
      </el-header>
      <el-main>
        <el-card class="welcome-card">
          <template #header>
            <div class="card-header">
              <span>系统首页</span>
            </div>
          </template>
          <div class="welcome-content">
            <h3>Token 信息</h3>
            <p>欢迎来到权限管理系统</p>
            <el-divider />
            
            <!-- Token 信息展示 -->
            <div class="token-info" v-if="tokenInfo">
              <el-descriptions :column="1" border>
                <el-descriptions-item label="Access Token" v-if="tokenInfo.access_token">
                  <el-text copyable>{{ tokenInfo.access_token }}</el-text>
                </el-descriptions-item>
                <el-descriptions-item label="Token Type" v-if="tokenInfo.token_type">
                  {{ tokenInfo.token_type }}
                </el-descriptions-item>
                <el-descriptions-item label="Expires In" v-if="tokenInfo.expires_in">
                  {{ tokenInfo.expires_in }} 秒
                </el-descriptions-item>
                <el-descriptions-item label="Refresh Token" v-if="tokenInfo.refresh_token">
                  <el-text copyable>{{ tokenInfo.refresh_token }}</el-text>
                </el-descriptions-item>
                <el-descriptions-item label="Scope" v-if="tokenInfo.scope">
                  {{ tokenInfo.scope }}
                </el-descriptions-item>
                <el-descriptions-item label="Client ID" v-if="tokenInfo.client_id">
                  {{ tokenInfo.client_id }}
                </el-descriptions-item>
                <el-descriptions-item label="User Name" v-if="tokenInfo.user_name">
                  {{ tokenInfo.user_name }}
                </el-descriptions-item>
                <el-descriptions-item label="Active" v-if="tokenInfo.active !== undefined">
                  <el-tag :type="tokenInfo.active ? 'success' : 'danger'">
                    {{ tokenInfo.active ? '有效' : '无效' }}
                  </el-tag>
                </el-descriptions-item>
              </el-descriptions>
              
              <!-- 显示完整 Token 信息（调试用） -->
              <el-collapse style="margin-top: 20px;">
                <el-collapse-item title="查看完整 Token 信息" name="1">
                  <pre class="token-info-json">{{ JSON.stringify(tokenInfo, null, 2) }}</pre>
                </el-collapse-item>
              </el-collapse>
            </div>
            
            <el-divider />
            <div class="quick-actions">
              <el-button type="primary" @click="goToAbout">查看关于</el-button>
              <el-button @click="handleLogout">退出登录</el-button>
            </div>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { exchangeCodeForToken, checkToken } from '../api/oauth'
import { saveTokens, saveUserInfo, clearTokens, getUserInfo as getStoredTokenInfo, isAuthenticated, getAccessToken } from '../utils/auth'

export default {
  name: 'HomePage',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const loading = ref(false)
    const tokenInfo = ref({})

    // 处理 OAuth2 回调
    const handleOAuthCallback = async () => {
      const code = route.query.code
      const error = route.query.error

      // 如果有错误，显示错误信息
      if (error) {
        ElMessage.error('授权失败: ' + (route.query.error_description || error))
        router.replace({ name: 'Welcome' })
        return
      }

      // 如果没有 code，说明不是回调，直接获取已存储的 token 信息
      if (!code) {
        loadStoredTokenInfo()
        return
      }

      // 有 code，进行 OAuth2 流程
      try {
        loading.value = true

        // 1. 使用 code 换取 token
        const tokenData = await exchangeCodeForToken(code)
        
        if (!tokenData.access_token) {
          throw new Error('未获取到访问令牌')
        }

        // 2. 保存 token
        const remember = true // 可以根据需要调整
        saveTokens(
          tokenData.access_token,
          tokenData.refresh_token,
          remember
        )

        // 3. 使用 token 校验并获取 token 信息
        const tokenCheckData = await checkToken(tokenData.access_token)
        
        // 4. 合并 token 信息（包含 check_token 返回的信息和原始 token 数据）
        const mergedTokenInfo = {
          ...tokenData,
          ...tokenCheckData
        }
        
        // 5. 保存 token 信息
        saveUserInfo(mergedTokenInfo, remember)
        tokenInfo.value = mergedTokenInfo

        ElMessage.success('登录成功！')

        // 6. 清除 URL 中的 code 参数，跳转到控制台
        router.replace({ name: 'Dashboard' })
      } catch (error) {
        console.error('OAuth callback error:', error)
        ElMessage.error('登录失败: ' + (error.message || '未知错误'))
        router.replace({ name: 'Welcome' })
      } finally {
        loading.value = false
      }
    }

    // 加载已存储的 token 信息
    const loadStoredTokenInfo = async () => {
      // 先尝试从本地存储获取
      const stored = getStoredTokenInfo()
      if (stored) {
        tokenInfo.value = stored
        return
      }

      // 如果本地没有，尝试用 token 重新获取
      if (isAuthenticated()) {
        try {
          loading.value = true
          const token = getAccessToken()
          if (token) {
            const tokenCheckData = await checkToken(token)
            // 合并信息
            const mergedTokenInfo = {
              access_token: token,
              ...tokenCheckData
            }
            saveUserInfo(mergedTokenInfo, true)
            tokenInfo.value = mergedTokenInfo
          }
        } catch (error) {
          console.error('Load token info error:', error)
          ElMessage.warning('获取 Token 信息失败，请重新登录')
          clearTokens()
          router.push({ name: 'Welcome' })
        } finally {
          loading.value = false
        }
      } else {
        // 未登录，跳转到主页
        router.push({ name: 'Welcome' })
      }
    }

    onMounted(() => {
      handleOAuthCallback()
    })

    const handleLogout = () => {
      clearTokens()
      ElMessage.success('已退出登录')
      router.push({ name: 'Welcome' })
    }

    const goToAbout = () => {
      router.push({ name: 'About' })
    }

    return {
      loading,
      tokenInfo,
      handleLogout,
      goToAbout
    }
  }
}
</script>

<style scoped>
.home-container {
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

.welcome-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  font-weight: 600;
  font-size: 18px;
}

.welcome-content {
  text-align: center;
  padding: 20px;
}

.welcome-content h3 {
  color: #409eff;
  margin-bottom: 10px;
}

.welcome-content p {
  color: #666;
  font-size: 16px;
}

.quick-actions {
  margin-top: 20px;
}

.quick-actions .el-button {
  margin: 0 10px;
}

.token-info {
  margin-top: 20px;
  text-align: left;
}

.token-info-json {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  color: #666;
}

.token-info :deep(.el-text) {
  word-break: break-all;
  font-family: monospace;
}
</style>