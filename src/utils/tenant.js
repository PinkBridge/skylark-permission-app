export function getTenant() {
  const tenantStr = localStorage.getItem('tenant')
  if (!tenantStr) {
    return null
  }
  try {
    return JSON.parse(tenantStr)
  } catch (error) {
    console.error('Error parsing tenant from localStorage:', error)
    return null
  }
}

export function setTenant(tenant) {
  localStorage.setItem('tenant', JSON.stringify(tenant))
}

export function removeTenant() {
  localStorage.removeItem('tenant')
}

export function getTenantByDomain(domain) {
  return fetch(`${process.env.VUE_APP_API_BASE_URL}/permission/tenants/domain/${domain}`)
    .then(response => {
      if (response.ok) {
        return response.json()
      }
      throw new Error('Failed to fetch tenant')
    })
    .then(data => {
      if (data && data.data) {
        setTenant(data.data)
        return data.data
      }
      return null
    })
    .catch(error => {
      console.error('Error fetching tenant:', error)
      return null
    })
}