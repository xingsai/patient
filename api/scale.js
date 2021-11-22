

import { http } from '@/common/service/service.js' 

	 
	 /**
	  * 获取量表列表
	  */
	export function getScaleList(params) {
		console.log(params)
		return http.get(`users/${params}/scales?public=true`)	
	}
	 /**
	  * 获取量表详情
	  */
	export function getScaleDetail(params) {
		console.log(params)
		return http.get(`scales/${params}`)	
	}
	
	/**
	  * 提交量表填写信息 
	  */
	export function submitScaleDetail(data) {
		console.log(data)
		return http.post(`/users/${data.userId}/takesheet`,data.data)	
	}
	
	
	/**
	  * 获取量表填写信息 
	  */
	export function getScaleSubmit(data) {
		console.log(data)
		return http.get(`scales/${data.id}/sheets/${data.sheets}`)	
	}
	





