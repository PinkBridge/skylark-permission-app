/**
 * Authentication utility functions
 */

// Memory cache for tokens to avoid timing issues
let tokenCache = {
  accessToken: null,
  refreshToken: null
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!(tokenCache.accessToken || localStorage.getItem('access_token') || sessionStorage.getItem('access_token'))
}

/**
 * Get access token
 * Priority: memory cache > localStorage > sessionStorage
 */
export function getAccessToken() {
  if (tokenCache.accessToken) {
    return tokenCache.accessToken
  }
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
  if (token) {
    tokenCache.accessToken = token
  }
  return token
}

/**
 * Get refresh token
 * Priority: memory cache > localStorage > sessionStorage
 */
export function getRefreshToken() {
  if (tokenCache.refreshToken) {
    return tokenCache.refreshToken
  }
  const token = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token')
  if (token) {
    tokenCache.refreshToken = token
  }
  return token
}

/**
 * Save tokens
 * @param {string} accessToken - Access token
 * @param {string} refreshToken - Refresh token (optional)
 * @param {boolean} remember - Whether to remember (use localStorage)
 */
export function saveTokens(accessToken, refreshToken = null, remember = false) {
  // Update memory cache first for immediate availability
  tokenCache.accessToken = accessToken
  if (refreshToken) {
    tokenCache.refreshToken = refreshToken
  }
  
  // Then save to storage
  const storage = remember ? localStorage : sessionStorage
  storage.setItem('access_token', accessToken)
  if (refreshToken) {
    storage.setItem('refresh_token', refreshToken)
  }
}

/**
 * Clear tokens
 */
export function clearTokens() {
  tokenCache.accessToken = null
  tokenCache.refreshToken = null
  
  // Then clear storage
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('userInfo')
  sessionStorage.removeItem('access_token')
  sessionStorage.removeItem('refresh_token')
  sessionStorage.removeItem('userInfo')
}

/**
 * Save user information
 * @param {object} userInfo - User information
 * @param {boolean} remember - Whether to remember
 */
export function saveUserInfo(userInfo, remember = false) {
  const storage = remember ? localStorage : sessionStorage
  storage.setItem('userInfo', JSON.stringify(userInfo))
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
