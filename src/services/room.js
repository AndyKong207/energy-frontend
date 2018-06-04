import request from '../utils/request'

export const createRoom = payload => request('/api/room/post', payload)
export const updateRoom = payload => request('/api/room/update', payload)
export const searchRoom = payload => request('/api/room', payload)
export const deleteRoom = payload => request('/api/room/del', payload)
