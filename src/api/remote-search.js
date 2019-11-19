import request from '@/utils/request'

export function searchUser(name) {
  return request({
    url: '/search/user',
    method: 'get',
    params: { name }
  })
}

export function transactionList(query) {
  return request({
    url: '/transaction/list',
    method: 'get',
    params: query
  })
}

export function initDashboard(query) {
  return request({
    url: '/center/overview',
    method: 'get',
    params: query,
    baseURL: ''
  })
}
export function closeClient(query) {
  return request({
    url: '/client/overview',
    method: 'post',
    params: query,
    baseURL: ''
  })
}
