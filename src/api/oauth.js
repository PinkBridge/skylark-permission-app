import axios from 'axios'

const API_BASE = process.env.VUE_APP_OAUTH_BASE || 'http://localhost:9527/oauth'

const normalizeBase = (base) => base.replace(/\/$/, '')
const normalizedBase = normalizeBase(API_BASE)

const OAUTH_CONFIG = {
  authorizationUrl: `${normalizedBase}/authorize`,
  tokenUrl: `${normalizedBase}/token`,
  checkTokenUrl: `${normalizedBase}/check_token`, 
  logoutUrl: `${normalizedBase}/logout`, 
  clientId: process.env.CLIENT_ID || 'app2',
  clientSecret: process.env.CLIENT_SECRET || '112233',
  redirectUri: process.env.VUE_APP_REDIRECT_URI || 'http://localhost:8080/home'
}

const apiClient = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

/**
 * Get OAuth2 authorization URL
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
 * Exchange authorization code for access token
 * @param {string} code - Authorization code
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
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error('Token exchange error:', error)
    throw new Error(error.response?.data?.error_description || 'Failed to get access token')
  }
}

/**
 * Check token and get token information
 * @param {string} accessToken - Access token
 */
export async function checkToken(accessToken) {
  try {
    const params = new URLSearchParams({
      token: accessToken
    })

    const credentials = btoa(`${OAUTH_CONFIG.clientId}:${OAUTH_CONFIG.clientSecret}`)

    const response = await apiClient.post(
      OAUTH_CONFIG.checkTokenUrl,
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Check token error:', error)
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout, please check if OAuth2 service is running')
    }
    throw new Error(error.response?.data?.error_description || error.message || 'Token validation failed')
  }
}

/**
 * Refresh access token
 * @param {string} refreshToken - Refresh token
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
    throw new Error(error.response?.data?.error_description || 'Failed to refresh token')
  }
}

/**
 * Logout
 * @param {string} accessToken - Access token
 */
export async function logout(accessToken) {
  try {
    // Logout endpoint usually requires token
    const params = new URLSearchParams({
      token: accessToken,
      client_id: OAUTH_CONFIG.clientId,
      client_secret: OAUTH_CONFIG.clientSecret
    })

    const credentials = btoa(`${OAUTH_CONFIG.clientId}:${OAUTH_CONFIG.clientSecret}`)

    const response = await apiClient.post(
      OAUTH_CONFIG.logoutUrl,
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Logout error:', error)
    throw new Error(error.response?.data?.error_description || error.message || 'Logout failed')
  }
}