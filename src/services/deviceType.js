import request from '../utils/request'

export const createDeviceType = payload => request('/api/deviceType/post', payload)
export const updateDeviceType = payload => request('/api/deviceType/update', payload)
export const searchDeviceType = payload => request('/api/deviceType', payload)
export const deleteDeviceType = payload => request('/api/deviceType/del', payload)
