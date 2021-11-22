import { http } from '@/common/service/service.js' 

	 
	 /**
	  * 获取患者列表
	  */
	export function getUsersList(params) {
		console.log(params)
		return http.get(`/users`,params)	
	}
// 根据id返回对应量表详情
export function getScale(data) {
  return http.get(
    '/scales/' + data.id + '/setting',
  )
}
// 编辑评语
export function editSheet(data) {
  return http.request({
    url: '/scales/' + data.id + '/sheets/' + data.sheet_id,
    method: 'post',
    data: data
  })
}



