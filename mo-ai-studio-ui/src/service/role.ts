import { apiService } from "./api"

const url = ""

/**
 * 创建智能体
 * @param {Object} data - 智能体信息
 * @returns {Promise<Object>} 创建结果
 */
export const createRole = async (data) => {
  const res = await apiService.post(`/api/roles`, data)
  return res.data
}

/**
 * 查询智能体
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} 智能体列表
 */
export const queryRoles = async (params) => {
  const res = await apiService.get(`/api/roles`, { params })
  return res.data
}

/**
 * 更新智能体
 * @param {Object} data - 智能体信息
 * @returns {Promise<Object>} 更新结果
 */
export const updateRole = async (data) => {
  const res = await apiService.put(`/api/roles/${data.id}`, data)
  return res.data
}

/**
 * 获取智能体详情
 * @param {string} id - 智能体ID
 * @returns {Promise<Object>} 智能体详情
 */
export const getRoleDetails = async (id) => {
  const res = await apiService.get(`/api/roles/${id}`)
  return res.data
}

/**
 * 禁用智能体
 * @param {string} id - 智能体ID
 * @returns {Promise<Object>} 禁用结果
 */
export const disableRole = async (id) => {
  const res = await apiService.put(`/api/roles/${id}/disable`)
  return res.data
}

/**
 * 启用智能体
 * @param {string} id - 智能体ID
 * @returns {Promise<Object>} 启用结果
 */
export const enableRole = async (id) => {
  const res = await apiService.put(`/api/roles/${id}/enable`)
  return res.data
}

/**
 * 删除智能体
 * @param {string} id - 智能体ID
 * @returns {Promise<Object>} 删除结果
 */
export const deleteRole = async (id) => {
  const res = await apiService.delete(`/api/roles/${id}`)
  return res.data
}

/**
 * 根据RAM用户分配智能体
 * @param {string} ramUserId - RAM用户ID
 * @param {string[]} roleIds - 智能体ID列表
 * @returns {Promise<Object>} 分配结果
 */
export const byRamUser = async (ramUserId, roleIds) => {
  const res = await apiService.post(`/api/user-roles/by-ram-user`, {
    roleIds: roleIds,
    ramUserId,
  })
  return res.data
}
