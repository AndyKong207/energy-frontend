import request from '../utils/request'

export const createArea = payload => request('/api/area/post', payload)
export const updateArea = payload => request('/api/area/update', payload)
export const searchArea = payload => request('/api/area', payload)
export const deleteArea = payload => request('/api/area/del', payload)
