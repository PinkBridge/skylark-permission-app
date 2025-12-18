import http from '@/api/http'

const APP_NAME = process.env.APP_NAME || 'permission'
const USER_PREFIX = "/" + APP_NAME + "/users"

/**
 * Get user information
 */
export function getMyInfo() {
  return http.get(`${USER_PREFIX}/me`)
}

/**
 * Change password
 */
export function changePassword(data) {
  return http.put(`${USER_PREFIX}/me/password`, data)
}

const MENU_PREFIX = "/" + APP_NAME + "/menus"

/**
 * Get current user's menu tree
 */
export function getMyMenuTree() {
  return http.get(`${MENU_PREFIX}/me/tree`)
}