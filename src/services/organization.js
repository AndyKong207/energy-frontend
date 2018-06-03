import request from '../utils/request'

export const createOrg = payload => request('/api/organization/post', payload)
export const searchOrg = payload => request('/api/organization', payload)
