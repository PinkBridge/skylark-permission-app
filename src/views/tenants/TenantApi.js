import http from '@/api/http'

const APP_NAME = process.env.APP_NAME || 'permission'
const TENANT_PREFIX = '/' + APP_NAME + '/tenants'

/**
 * Get tenant page
 */
export function getTenantPage(currentPage, pageSize, params) {
  return http.get(`${TENANT_PREFIX}/page?page=${currentPage}&size=${pageSize}`, { ...params })
}

/**
 * Get tenant by id
 */
export function getTenantById(id) {
  return http.get(`${TENANT_PREFIX}/${id}`)
}

/**
 * Delete tenant by id
 */
export function deleteTenantById(id) {
  return http.delete(`${TENANT_PREFIX}/${id}`)
}

/**
 * Update tenant by id
 */
export function updateTenantById(id, tenant) {
  return http.put(`${TENANT_PREFIX}/${id}`, tenant)
}

/**
 * Create tenant
 */
export function createTenant(tenant) {
  return http.post(`${TENANT_PREFIX}`, tenant)
}
