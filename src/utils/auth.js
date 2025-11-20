/**
 * Authentication utility functions
 */

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!(localStorage.getItem('access_token') || sessionStorage.getItem('access_token'))
}

/**
 * Get access token
 */
export function getAccessToken() {
  return localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
}

/**
 * Get refresh token
 */
export function getRefreshToken() {
  return localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token')
}

/**
 * Save tokens
 * @param {string} accessToken - Access token
 * @param {string} refreshToken - Refresh token (optional)
 * @param {boolean} remember - Whether to remember (use localStorage)
 */
export function saveTokens(accessToken, refreshToken = null, remember = false) {
  const storage = remember ? localStorage : sessionStorage
  storage.setItem('access_token', accessToken)
  if (refreshToken) {
    storage.setItem('refresh_token', refreshToken)
  }
  window.dispatchEvent(new CustomEvent('auth-token-changed', {
    detail: { accessToken, refreshToken, remember }
  }))
}

/**
 * Clear tokens
 */
export function clearTokens() {
  const hadToken = !!getAccessToken()
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('userInfo')
  sessionStorage.removeItem('access_token')
  sessionStorage.removeItem('refresh_token')
  sessionStorage.removeItem('userInfo')
  if (hadToken) {
    window.dispatchEvent(new CustomEvent('auth-token-changed', {
      detail: { accessToken: null, refreshToken: null }
    }))
  }
  window.dispatchEvent(new CustomEvent('auth-userinfo-changed', {
    detail: null
  }))
}

/**
 * Save user information
 * @param {object} userInfo - User information
 * @param {boolean} remember - Whether to remember
 */
export function saveUserInfo(userInfo, remember = false) {
  const storage = remember ? localStorage : sessionStorage
  storage.setItem('userInfo', JSON.stringify(userInfo))
  window.dispatchEvent(new CustomEvent('auth-userinfo-changed', {
    detail: userInfo
  }))
}

/**
 * Get user information
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
