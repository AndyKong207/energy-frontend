import request from '../utils/request'

export const createEnergyType = payload => request('/api/energyType/post', payload)
export const updateEnergyType = payload => request('/api/energyType/update', payload)
export const searchEnergyType = payload => request('/api/energyType', payload)
export const deleteEnergyType = payload => request('/api/energyType/del', payload)
