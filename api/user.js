import {
	http
} from '@/common/service/service.js'

import configService from '../common/service/config.service.js'
let apiUrl = configService.apiUrl;

/**
 * 上传图片地址I
 */
export function uploadImageUrl() {

	return apiUrl+"/media/upload"
}
/**
 * 上传身份证
 */
export function uploadIdcardUrl() {

	return apiUrl+"/users/idcard"
}

/**
 * 上传头像地址
 */
export function uploadAvatarUrl() {

	return apiUrl+"/users/avatar"
}
/**
 * 亲友关系绑定
 */
export function bindFamily(data) {

	return http.post(`/users/${data.id}/family`, data.data)
}

/**
 * 返回登录人信息
 */
export function getInfo(token) {

	return http.get(`/users/me`, {
		params: {
			
		}
	})
}

/**
 * 获取用户详情信息
 */
export function getUserInfoDetail({
	params
}) {
	return http.get(`/users/${params.id}`, {
		params
	})
}
/**
 * 修改用户详情信息
 */
export function updateUserInfoDetail(data) {
	return http.post(`/users/${data.id}`, data.data)
}
/**
 * 新增用户详情信息
 */
export function addUserInfoDetail(data) {
	return http.post(`/users/register`, data)
}



/**
 * 微信登录 code 换 token
 */
export function wxUserLogin(data) {
	return http.post(`/employees/loginByDoctorWx`, data)
}


/**
 * 微信---注册信息
 * name avatar  phone phoneCode title email password
 */
export function wxUserRegister(data) {
	return http.post(`/employees/registerByDoctorWx`, data)
}
/**
 * 微信 手机号,是否已经注册
 * phone phoneCode
 */
export function wxUserCheckMsgCode(data) {
	return http.post(`/employees/registerByDoctorCheck`, data)
}
/**
 * 发送验证码
 * phone 
 */
export function wxSendCode(data) {
	return http.post(`/employees/code`, data)
}
/**
 * 检测用户是否存在
 *  
 */
export function checkUserExist(data) {
	return http.post(`/users/prelogin`, data)
}
/**
 * 微信登录
 *  
 */
export function wxLogin(data) {
	return http.post(`/users/wxlogin`, data)
}

/**
 * 解除绑定
 *  
 */
export function unfamily(data) {
	return http.post(`/users/${data.id}/unfamily`, data)
}
/**
 * 运动心率上传
 *  
 */
export function actRecordSubmit(data) {
	return http.post(`/users/acts/${data.id}/records`, data.data)
}




