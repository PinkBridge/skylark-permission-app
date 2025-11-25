import http from '@/api/http'

const APP_NAME = process.env.APP_NAME || 'permission'
const API_PREFIX = "/" + APP_NAME + "/apis"

/**
 * Get API page
 */
export function getApiPage(currentPage, pageSize, config = {}) {
  const params = config.params || {}
  // Build query string from params
  const queryParams = new URLSearchParams()
  if (params.path) queryParams.append('path', params.path)
  if (params.permlabel) queryParams.append('permlabel', params.permlabel)
  if (params.module_key) queryParams.append('module_key', params.module_key)
  if (params.sort) queryParams.append('sort', params.sort)
  if (params.order) queryParams.append('order', params.order)
  
  const queryString = queryParams.toString()
  const url = queryString 
    ? `${API_PREFIX}/page?page=${currentPage}&size=${pageSize}&${queryString}`
    : `${API_PREFIX}/page?page=${currentPage}&size=${pageSize}`
  
  return http.get(url)
}

/**
 * Get API by id
 */
export function getApiById(id) {
  return http.get(`${API_PREFIX}/${id}`)
}

/**
 * Delete API by id
 */
export function deleteApiById(id) {
  return http.delete(`${API_PREFIX}/${id}`)
}

/**
 * Update API by id
 */
export function updateApiById(id, api) {
  return http.put(`${API_PREFIX}/${id}`, api)
}

/**
 * Create API
 */
export function createApi(api) {
  return http.post(`${API_PREFIX}`, api)
}

