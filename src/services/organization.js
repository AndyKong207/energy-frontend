import request from '../utils/request'

export const createOrg = payload => request('/api/organization/post', payload)
export const updateOrg = payload => request('/api/organization/update', payload)
export const searchOrg = payload => request('/api/organization', payload)
export const deleteOrg = payload => request('/api/organization/del', payload)
