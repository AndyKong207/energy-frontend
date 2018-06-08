import request from '../utils/request'

export const createEnvironment = payload => request('/api/environment/post', payload)
export const updateEnvironment = payload => request('/api/environment/update', payload)
export const searchEnvironment = payload => request('/api/environment', payload)
export const deleteEnvironment = payload => request('/api/environment/del', payload)
export const searchEnvironmentNew = payload => request('/api/environment/new', payload)
