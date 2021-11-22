import modules from './modules'
import Vue from 'vue'
import store from '../../store'
import Router from '@/plugin/uni-simple-router/index.js'
import {
	ACCESS_TOKEN
} from '@/common/util/constants.js'
import {
	wxUserLogin
} from '@/api/user.js'
Vue.use(Router)
//初始化
const router = new Router({
	encodeURI: true,
	routes: [...modules] //路由表
});

const whiteList = ['/pages/index/index', "/pages/user/authorize", "/pages/user/binding",'/pages1/user/baseInfo']


//全局路由前置守卫
router.beforeEach((to, from, next) => {
	// uni.setStorageSync(ACCESS_TOKEN,
	// 	"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvY2FyZWRldi5zY2hpbGxlcmNoaW5hLmNvbVwvYXBpXC91c2Vyc1wvd3hsb2dpbiIsImlhdCI6MTYzNjUyMTkzOCwiZXhwIjoxNjM3MTI2NzM4LCJuYmYiOjE2MzY1MjE5MzgsImp0aSI6InJOcldOZ005T1R5dDlCTDQiLCJzdWIiOjIwMDA2LCJwcnYiOiJmNmI3MTU0OWRiOGMyYzQyYjc1ODI3YWE0NGYwMmI3ZWU1MjlkMjRkIn0.f0Xgof2Zrip_TXyoZToOVC6IU7uZyKFq9RbnoX-TtAY"
	// );
	// next()
	// return
	let token = uni.getStorageSync(ACCESS_TOKEN);
	console.log(33333333)
	console.log(to.path)
	console.log(token)
	// 有token 直接进入页面
	if (token) {
		next()
	} else {
		// 没有有token 判读是否在白名单中
		if (whiteList.indexOf(to.path) !== -1) {
			next()
		} else {
			next({
				path: '/pages/index/index'
			})
		}
	}


})



// 全局路由后置守卫
router.afterEach((to, from) => {
	console.log(to.path)
	console.log(from.path)
	console.log("afterEach")
})
export default router;
