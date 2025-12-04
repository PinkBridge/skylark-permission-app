import http from '@/api/http'

const APP_NAME = process.env.APP_NAME || 'permission'
const RESOURCE_PREFIX = '/' + APP_NAME + '/resources'

/**
 * Get resource page
 */
export function getResourcePage(currentPage, pageSize, params) {
  return http.get(`${RESOURCE_PREFIX}/page?page=${currentPage}&size=${pageSize}`, { ...params })
}

/**
 * Get resource by id
 */
export function getResourceById(id) {
  return http.get(`${RESOURCE_PREFIX}/${id}`)
}

/**
 * Delete resource by id
 */
export function deleteResourceById(id) {
  return http.delete(`${RESOURCE_PREFIX}/${id}`)
}

/**
 * Update resource by id
 */
export function updateResourceById(id, resource) {
  return http.put(`${RESOURCE_PREFIX}/${id}`, resource)
}

/**
 * Create resource
 */
export function createResource(resource) {
  return http.post(`${RESOURCE_PREFIX}`, resource)
}

/**
 * Upload file resource
 * @param {File} file - File to upload
 */
export function uploadResource(file) {
  const formData = new FormData()
  formData.append('file', file)
  return http.post(`${RESOURCE_PREFIX}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

