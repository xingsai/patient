
import { http } from '@/common/service/service.js' 
// 数据集模板详情
export function getDatasetTemp(data) {
  return  http.request({
    url: '/datasets/templates/' + data.id,
    method: 'get'
  })
}
// 获取提交数据数据，并整合回显 （temp_id   ： //48   心肺评估     75  心电图）
export function getsubdataset(data) {
  return  http.request({
    url: '/datasets/' + data.id + '/templates/' + data.temp_id,
    method: 'get'
  })
}
// 数据集详情 id   ： //48   心肺评估     75  心电图）
export function getDataset(data) {
  return http.request({
    url: '/datasets/' + data.id,
    method: 'get'
  })
}
// 返回呼吸数据
export function getsubdatasetdetail(data) {
  return http.request({
    url: '/datasets/' + data.id + '/sub/' + data.sub,
    method: 'get'
  })
}
// 图表数据
export function getDatasetGraph(data) {
  return http.request({
    url: '/datasets/' + data.id + '/graph',
    method: 'get'
  })
}
// 待合并数据集
export function getDatasetsArrange(data) {
  return http.request({
    url: '/datasets/arrange',
    method: 'get',
    params: data
  })
}
// 合并报告
export function datasetMerge(data) {
  return http.request({
    url: '/datasets/merge',
    method: 'post',
    data: data
  })
}