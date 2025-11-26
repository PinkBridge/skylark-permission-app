import http from '@/api/http'

const APP_NAME = process.env.APP_NAME || 'permission'
const ROLE_PREFIX = "/" + APP_NAME + "/roles"

/**
 * Get role page
 */
export function getRolePage(currentPage, pageSize, params) {
  return http.get(`${ROLE_PREFIX}/page?page=${currentPage}&size=${pageSize}`, { ...params })
}

/**
 * Get role by id
 */
export function getRoleById(id) {
  return http.get(`${ROLE_PREFIX}/${id}`)
}

/**
 * Delete role by id
 */
export function deleteRoleById(id) {
  return http.delete(`${ROLE_PREFIX}/${id}`)
}

/**
 * Update role by id
 */
export function updateRoleById(id, role) {
  return http.put(`${ROLE_PREFIX}/${id}`, role)
}

/**
 * Create role
 */
export function createRole(role) {
  return http.post(`${ROLE_PREFIX}`, role)
}

