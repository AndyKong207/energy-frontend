import request from '../utils/request'

export const createEnergy = payload => request('/api/energy/post', payload)
export const updateEnergy = payload => request('/api/energy/update', payload)
export const searchEnergy = payload => request('/api/energy', payload)
export const deleteEnergy = payload => request('/api/energy/del', payload)
