import request from '../utils/request'

export const createBuilding = payload => request('/api/building/post', payload)
export const updateBuilding = payload => request('/api/building/update', payload)
export const searchBuilding = payload => request('/api/building', payload)
export const deleteBuilding = payload => request('/api/building/del', payload)
