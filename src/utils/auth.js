/**
 * 认证相关工具函数
 */

/**
 * 检查是否已登录
 */
export function isAuthenticated() {
  return !!(localStorage.getItem('access_token') || sessionStorage.getItem('access_token'))
}

/**
 * 获取访问令牌
 */
export function getAccessToken() {
  return localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
}

/**
 * 获取刷新令牌
 */
export function getRefreshToken() {
  return localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token')
}

/**
 * 保存令牌
 * @param {string} accessToken - 访问令牌
 * @param {string} refreshToken - 刷新令牌（可选）
 * @param {boolean} remember - 是否记住（使用 localStorage）
 */
export function saveTokens(accessToken, refreshToken = null, remember = false) {
  const storage = remember ? localStorage : sessionStorage
  storage.setItem('access_token', accessToken)
  if (refreshToken) {
    storage.setItem('refresh_token', refreshToken)
  }
}

/**
 * 清除令牌
 */
export function clearTokens() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('userInfo')
  sessionStorage.removeItem('access_token')
  sessionStorage.removeItem('refresh_token')
  sessionStorage.removeItem('userInfo')
}

/**
 * 保存用户信息
 * @param {object} userInfo - 用户信息
 * @param {boolean} remember - 是否记住
 */
export function saveUserInfo(userInfo, remember = false) {
  const storage = remember ? localStorage : sessionStorage
  storage.setItem('userInfo', JSON.stringify(userInfo))
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  const userInfoStr = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo')
  if (userInfoStr) {
    try {
      return JSON.parse(userInfoStr)
    } catch (e) {
      return null
    }
  }
  return null
}
