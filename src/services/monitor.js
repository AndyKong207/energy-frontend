import request from '../utils/request'

export const createMonitor = payload => request('/api/monitor/post', payload)
export const updateMonitor = payload => request('/api/monitor/update', payload)
export const searchMonitor = payload => request('/api/monitor', payload)
export const deleteMonitor = payload => request('/api/monitor/del', payload)
