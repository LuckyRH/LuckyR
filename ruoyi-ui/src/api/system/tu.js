import request from '@/utils/request'
// 查询学生列表
export function SelectPro(query) {
    return request({
      url: '/system/product/list',
      method: 'get',
      params: query,
    })
  }