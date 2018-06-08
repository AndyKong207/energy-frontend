import request from '../utils/request'

export const createUser = payload => request('/api/user/post', payload)
export const updateUser = payload => request('/api/user/update', payload)
export const searchUser = payload => request('/api/user', payload)
export const deleteUser = payload => request('/api/user/del', payload)
