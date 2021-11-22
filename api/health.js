import {
	http
} from '@/common/service/service.js'


/**
 * 获取模板
 */
export function getTemplates(params) {
	console.log(params)
	return http.get(`/datasets/templates/1`)
}
/**
 * 获取数据
 */
export function getSubmitTemplates(params) {
	console.log(params)
	return http.get(`/datasets/${params}`)
}
/**
 * 获取数据
 */
export function deletTemplates(params) {
	console.log(params)
	return http.request({
		url:`/datasets/${params}`,
		method: 'DELETE',
		
	})
}
/**
 * 个人档案基本信息修改
 */
export function userInfoEdit(data) {
	console.log(data)
	let url = data.id ? `/datasets/pracs/${data.id}` : `/datasets/pracs`
	console.log(url)
	//更新数据集  如果加上pid是修改，不加是新增
	return http.request({
		url,
		method: 'post',
		data: data.data
	})
}
/**
 * 个人档案基本信息  获取
 */
export function getUserPracsInfo(data) {
	console.log(data)
	return http.get(`/datasets/pracs/${data}`)
}
/**
 * 新建数据集合
 */
export function addDataset(data) {
	console.log(data)
	return http.request({
		url: `/datasets`,
		method: 'post',
		data: data
	})
}
/**
 *  //请求检查模板列表
 */
export function gettemplates(data) {
	console.log(data)
	return http.request({
		url: `/datasets/templates?type=D`,
		method: 'get',
		
	})
}

       

// // 根据id返回对应量表详情
// export function getScale(data) {
//   return http.get(
//     '/scales/' + data.id + '/setting',
//   )
// }
// // 编辑评语
// export function editSheet(data) {
//   return http.request({
//     url: '/scales/' + data.id + '/sheets/' + data.sheet_id,
//     method: 'post',
//     data: data
//   })
// }
