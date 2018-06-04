import request from '../utils/request'

export const createDevice = payload => request('/api/device/post', payload)
export const updateDevice = payload => request('/api/device/update', payload)
export const searchDevice = payload => request('/api/device', payload)
export const deleteDevice = payload => request('/api/device/del', payload)
