/**
 * Permission utility functions
 */
import { getMyMenuTree } from '@/api/me'

function collectPermissions(tree) {
  let result = []
  for (const node of tree) {
    if (node.permlabel) {
      result.push(node.permlabel)
    }
    if (Array.isArray(node.children) && node.children.length > 0) {
      result = result.concat(collectPermissions(node.children))
    }
  }
  return result
}

/**
 * Check if user has a specific permission
 * @param {string|string[]} permission - Permission label(s) to check
 * @returns {boolean} - True if user has the permission
 */
export async function hasPermission(permission) {
  if (!permission) {
    return false
  }

  // 从缓存中获取权限
  let permissions = null
  try {
    const cached = localStorage.getItem('permissions')
    if (cached) {
      permissions = JSON.parse(cached)
    }
  } catch (error) {
    console.error('Failed to parse permissions from cache:', error)
    permissions = null
  }

  if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
    // 从后端获取菜单树
    try {
      const menuTree = await getMyMenuTree()
      permissions = collectPermissions(menuTree)
      // 存储到缓存中
      localStorage.setItem('permissions', JSON.stringify(permissions))
    } catch (error) {
      console.error('Failed to get menu tree:', error)
      return false
    }
  }

  return permissions.includes(permission)
}
