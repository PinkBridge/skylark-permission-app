import axios from 'axios'

// OAuth2 配置
// 开发环境使用代理，生产环境需要根据实际情况调整
const isDevelopment = process.env.NODE_ENV === 'development'
const API_BASE = isDevelopment ? '/api/oauth' : 'http://localhost:9527/oauth'

const OAUTH_CONFIG = {
  authorizationUrl: 'http://localhost:9527/oauth/authorize', // 授权 URL 需要完整路径，由浏览器跳转
  tokenUrl: `${API_BASE}/token`,
  checkTokenUrl: `${API_BASE}/check_token`, // Token 校验接口
  clientId: 'app2',
  clientSecret: '112233',
  redirectUri: 'http://localhost:8080/home'
}

// 创建 axios 实例
const apiClient = axios.create({
  timeout: 30000, // 增加超时时间到 30 秒
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

/**
 * 获取 OAuth2 授权 URL
 */
export function getAuthorizationUrl() {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: OAUTH_CONFIG.clientId,
    redirect_uri: OAUTH_CONFIG.redirectUri
  })
  return `${OAUTH_CONFIG.authorizationUrl}?${params.toString()}`
}

/**
 * 使用授权码换取访问令牌
 * @param {string} code - 授权码
 */
export async function exchangeCodeForToken(code) {
  try {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      client_id: OAUTH_CONFIG.clientId,
      client_secret: OAUTH_CONFIG.clientSecret,
      redirect_uri: OAUTH_CONFIG.redirectUri
    })

    const response = await apiClient.post(OAUTH_CONFIG.tokenUrl, params.toString())
    return response.data
  } catch (error) {
    console.error('Token exchange error:', error)
    throw new Error(error.response?.data?.error_description || '获取访问令牌失败')
  }
}

/**
 * 校验 Token 并获取 Token 信息
 * @param {string} accessToken - 访问令牌
 */
export async function checkToken(accessToken) {
  try {
    // check_token 接口使用 POST 请求，使用 x-www-form-urlencoded 格式
    // 使用 HTTP Basic Authentication，client_id 和 client_secret 放在 Authorization header 中
    const params = new URLSearchParams({
      token: accessToken
    })
    
    // 创建 Basic Auth 凭证
    const credentials = btoa(`${OAUTH_CONFIG.clientId}:${OAUTH_CONFIG.clientSecret}`)
    
    console.log('请求 check_token:', {
      url: OAUTH_CONFIG.checkTokenUrl,
      params: params.toString()
    })
    
    // 使用 HTTP Basic Authentication
    const response = await apiClient.post(
      OAUTH_CONFIG.checkTokenUrl, 
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`
        },
        timeout: 30000 // 单独为这个请求设置超时时间
      }
    )
    return response.data
  } catch (error) {
    console.error('Check token error:', error)
    if (error.code === 'ECONNABORTED') {
      throw new Error('请求超时，请检查 OAuth2 服务是否正常运行')
    }
    throw new Error(error.response?.data?.error_description || error.message || '校验 Token 失败')
  }
}

/**
 * 刷新访问令牌
 * @param {string} refreshToken - 刷新令牌
 */
export async function refreshToken(refreshToken) {
  try {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: OAUTH_CONFIG.clientId,
      client_secret: OAUTH_CONFIG.clientSecret
    })

    const response = await apiClient.post(OAUTH_CONFIG.tokenUrl, params.toString())
    return response.data
  } catch (error) {
    console.error('Refresh token error:', error)
    throw new Error(error.response?.data?.error_description || '刷新令牌失败')
  }
}