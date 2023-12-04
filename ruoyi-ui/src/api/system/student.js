import request from '@/utils/request'

// 查询学生列表
export function listStudent(query) {
  return request({
    url: '/system/student/list',
    method: 'get',
    params: query,
  })
}
// 根据学生no查询
export function selectStudentNo(studentNo) {
  return request({
    url: '/system/student/' + studentNo,
    method: 'get',
  })
}

// 删除
export function delStudent(studentNo) {
  return request({
    url: '/system/student/' + studentNo,
    method: 'delete'
  })
}
// 修改菜单
export function updateStudent(data) {
  return request({
    url: '/system/student',
    method: 'put',
    data: data
  })
}
// 新增岗位
export function addStudent(data) {
  return request({
    url: '/system/student',
    method: 'post',
    data: data
  })
}
//导出
export function exportExcel(data){
  return request({
    url: '/system/student/export',
    method: 'get',
    data: data
  })
}
//导入
export function importExcel(data){
  return request({
    url: '/system/student/import',
    method: 'post',
    data: data
  })
}