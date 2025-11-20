import http from '@/api/http'


const APP_NAME = process.env.APP_NAME || 'permission'

const MENU_PREFIX = "/" + APP_NAME + "/menus"

/**
 * Get current user's menu tree
 */
export function getMyMenuTree() {
  return http.get(`${MENU_PREFIX}/me/tree`)
}

/**
 * Get menu detail by ID
 * @param {string|number} id
 */
export function getMenuDetail(id) {
  return http.get(`${MENU_PREFIX}/${id}`)
}

/**
 * Create menu
 * @param {object} payload
 */
export function createMenu(payload) {
  return http.post(MENU_PREFIX, payload)
}

/**
 * Update menu
 * @param {string|number} id
 * @param {object} payload
 */
export function updateMenu(id, payload) {
  return http.put(`${MENU_PREFIX}/${id}`, payload)
}

/**
 * Delete menu
 * @param {string|number} id
 */
export function deleteMenu(id) {
  return http.delete(`${MENU_PREFIX}/${id}`)
}
