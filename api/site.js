import {
	http
} from '@/common/service/service.js'

/**
 * 切换默认站点
 */
export function setSite(params) {

	return http.get(`/sites/${params.id}/default`)
}

/**
 *  获取单个站点详细信息
 */
export function getSites(data) {
	return http.request({
		url: '/sites/' + data.id,
		method: 'get'
	})
}
/**
 *  获取单个站点二维码信息
 */
export function getSitesQR(data) {
	
	return http.request({
		url: data&& data.id?'/employees/showsiteqr/'+data.id:'/employees/showsiteqr',
		method: 'get'
	})
}
/**
 *  站点二维码申请加入
 */
export function joinSites(data) {
	return http.request({
		url: '/employees/queryqr',
		method: 'post',
		data:data
	})
}



