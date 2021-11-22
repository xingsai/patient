<template>
	<view>
		<view class="index">
			<view class="type">
				<view v-if=" site_id">
					<view>这里是{{ hospital }}</view>
					<view class="name">{{ name }}科室</view>
				</view>
				<view v-if=" !site_id">
					<text>华思康源\n</text>
					<text>全自动测评系统</text>
				</view>
			</view>
			<image src="/static/images/indexbg.png" mode="widthFix" lazy-load="false">
			</image>
			<button class="btn-350 btn" style="width: 250rpx;" type="primary" v-if="showBtn"
				@tap="toAuthorize">我要注册</button>
		</view>
	</view>
</template>

<script>
	import {
		serializeParams
	} from '@/common/util/tool.js'
	import {
		ACCESS_TOKEN
	} from '@/common/util/constants.js'

	import {
		getSites
	} from "@/api/site.js"

	import {
		getInfo,
		checkUserExist,
		wxLogin
	} from "@/api/user.js"
	export default {
		data() {
			return {
				hospital: '', // 
				name: '', // 
				site_id: '',
				user_id: '',
				showBtn: false,
			}
		},
		mounted() {
		},
		onLoad(options) {
			 console.log('index', options);
			 console.log('index3333', options);
			//let options={q:"http://caredev.schillerchina.com/qrcode?site=200&user=4027c6b6-2da0-4da0-a8a5-7e514d987d8b&name=20Xugghhygg&birthday=1994-05-23&phone=13752773309&gender=1&height=0&weight=0&areacode=#/login?redirect=%2Fpatient%2Flist"}
			let paramsObj = {}
			// 如果是扫码进入小程序，把扫码参数存入运行时
			if (options && options.q) {
				const _uri = decodeURIComponent(options.q)
				paramsObj = serializeParams(_uri)
				console.log(_uri)
				console.log(paramsObj)
				// 如果是扫码进入小程序，把扫码参数存入缓存
				this.$store.dispatch("setqrcodeQueryInfo",paramsObj)
			}
			// 处理_site和_user 如果没有，默认传给后台0
			if (paramsObj.user) {
				this.user_id = paramsObj.user;
			}
			if (paramsObj.site) {
				this.site_id = paramsObj.site;
				// 取得医院信息
				getSites({
					id: paramsObj.site
				}).then(res => {
					const siteDetail = res.data;
					this.hospital = siteDetail.hospital;
					this.name = siteDetail.name;
					this.userData(paramsObj);
				});
			} else {
				this.userData(paramsObj);
			}

		},
		methods: {
			//获取微信用户信息 
			userData(params) {
				let self = this;
				const sameImplement = (id = null) => {
					self.userinfo().then(res => {
						console.log(res, 380);
						// 加工出事件对象e，以便commonLogin代码复用
						const e = {
							id
						};
						e.detail = {
							...res
						};
						console.log(e)
						if (res.encryptedData) {
							self.commonLogin(e, self);
						}
					}).catch(err => {
						console.log(err);
						self.showBtn = true

					})
				}
				if (params.user) {
					//判断用户是否存在
					checkUserExist(params).then(res => {
						sameImplement(res.data.id)
					})
				} else {
					sameImplement()
				}
			},
			commonLogin(e, self) {
				// 小程序登录api，取得用户手机标识code,encryptedData,iv
				console.log(e, 'commonLogin')
				uni.login({
					success: function(res) {
						// console.log(res, 'loginData')
						if (res.code) {
							//发起网络请求
							const checkExistData = {
								// openid 通过code,encryptedData,iv得到
								code: res.code,
								encryptedData: e.encryptedData,
								iv: e.iv,
								site_id: self.site_id,
								user_id: self.user_id
							}
							if (e.id) checkExistData.id = e.id
							wxLogin(checkExistData).then((res) => {
								/**
								 * @param https://public-schiller.oss-cn-beijing.aliyuncs.com/wx/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E7%94%A8%E6%88%B7%E9%80%89%E6%8B%A9%E9%80%BB%E8%BE%91%E5%9B%BE.jpeg 逻辑图
								 * @desc 未注册的用户会返回openid
								 * @desc 注册过的用户不暴露openid，通过access_token作为替代。
								 * @desc access_token 是系统认证体系，是访问后续接口的权限字符串
								 * @desc access_token是本人的，对应微信这个用户
								 * @desc 如果传了userid，返回userid对应的这个人的数据
								 */

								self.userDetail = res.data;
								console.log(res)
								let paramsStr = self.$store.getters.qrcodeQueryInfo
								//将请求回来的用户信息放入 缓存
								self.$store.dispatch("setqrcodeQueryInfo",{...paramsStr,userDetail:{...res.data}})
								//return 
								if (self.user_id) {
									/**
									 * @desc 有user_id：判断有没有openid，通过access_token 注册过的用户只返回access_token。
									 */
									if (res.access_token) { // 存在openid    微信已注册绑定过（1，是本人，2，不是本人） 
										uni.setStorageSync(ACCESS_TOKEN, res.access_token);
										if (res.data === '') { // 是本人，直接登录
											console.log(1);
											//self.$parent.globalData.token = res.data.access_token;
											uni.switchTab({
												url: '/pages/user/people'
											});
										} else {
											// 不是本人，查询id的用户信息 并返回openid对应access_token 并返回userid对应的用户信息。
											// 进入用户选择页，选择用户后，在用户选择页存下access_token
											console.log(2);
											if (res.data
												.isfamily) { // 如果亲友的isfamily=true 直接用亲友id在我的页面请求
												console.log(3);
												self.$store.dispatch("setOtherId", res.data.id)
												uni.switchTab({
													url: '/pages/user/people' 
												});
											} else { // 如果没有这个字段，就去绑定页绑定亲友关系
												console.log(4);
												self.toAuthorize()
											}
										}
									} else { // 不存在openid，进入绑定信息页，正常绑定信息
										// console.log(3)
										let _userinfo =  e.detail.userInfo;
										_userinfo.name = _userinfo.nickName;
										_userinfo.address = _userinfo.country + _userinfo.province +
											_userinfo.city;
										_userinfo.wx_openid = res.data.openid;
										uni.setStorage({
											key: 'tempUserInfo',
											data: _userinfo,
											success: () => {
												if (self.site_id) {
													uni.navigateTo({
														url: '/pages/user/binding?type=new&openid=' +
															_userinfo.wx_openid +
															'&siteid=' + self
															.site_id
													});
												} else {
													uni.navigateTo({
														url: '/pages/user/binding?type=new&openid=' +
															_userinfo.wx_openid
													});
												}
											}
										});
									}

								} else {
									/**
									 * @desc 没有user_id
									 */
									// console.log(4)
									if (res.access_token) { // 存在openid
										uni.setStorageSync(ACCESS_TOKEN, res.access_token);
										uni.switchTab({
											url: '/pages/user/people'
										});
									} else { // 不存在openid
										console.log(e)
										let _userinfo =  e.detail.userInfo;
										_userinfo.name = _userinfo.nickName;
										_userinfo.address = _userinfo.country + _userinfo
											.province + _userinfo.city;
										_userinfo.wx_openid = res.data.openid;
										uni.setStorage({
											key: 'tempUserInfo',
											data: _userinfo,
											success: () => {
												self.showBtn = true
											}
										});
									}
								}

							})

						} else {
							this.$tip.toast('登录失败');
						}
					}
				})
			},
			//获取用户信息
			userinfo() {
				return new Promise((resolve, reject) => {
					uni.getUserInfo({
						success: res => {
							resolve(res);
						},
						fail: err => {
							reject(err);
						}
					});
				})
			},
			//跳转页面
			toAuthorize() {
				console.log(this.user_id, this.site_id);
				uni.navigateTo({
					url: '/pages/user/authorize?user_id=' + this.user_id + '&site_id=' + this.site_id
				});
			},

		}
	}
</script>
<style lang="scss" scoped>
	@keyframes flash {

		from,
		50%,
		to {
			opacity: 1;
		}

		25%,
		75% {
			opacity: 0;
		}
	}

	page {
		padding: 62rpx 0;
	}

	.index {

		font-weight: 400;
		text-align: center;

		.type {
			font-size: 40rpx;
			color: rgba(74, 74, 74, 1);
			line-height: 56rpx;
			margin-top: 200rpx;

			.name {
				color: $uni-color-primary;
			}
		}

		image {
			width: 750rpx;
			height: 416rpx;
			margin-top: 97rpx;
		}

		.btn {
			margin-top: 200rpx;
		}

		.tip {
			margin-top: 65rpx;
			font-size: 28rpx;
			height: 40rpx;
			color: rgba(155, 155, 155, 1);
			animation: flash 2s;
		}
	}

	.layer {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1;
		background: rgba(0, 0, 0, 0.5);
		opacity: 0;
		font-size: 32rpx;
		line-height: 45rpx;

		.container {
			width: 600rpx;
			height: 700rpx;
			padding: 89rpx 30rpx 50rpx 30rpx;
			border-radius: 10rpx;
			background: linear-gradient(135deg, rgba(132, 181, 232, 1) 0%, rgba(77, 126, 205, 1) 100%);
			margin: auto;
			// margin-top: 189rpx;
			margin-top: 35%;

			.identify {
				.container-bg {
					width: 260rpx;
					height: 260rpx;
				}

				.name {
					margin-top: 21rpx;
					text-align: center;
					color: #fff;
				}
			}

			.btnct {
				width: 100%;
				display: flex;
				justify-content: space-between;

				.btn {
					width: 250rpx;
					height: 80rpx;
					background: white;
					border-radius: 47rpx;
				}
			}
		}

		.close {
			width: 82rpx;
			height: 82rpx;
			margin: auto;
			margin-top: 50rpx;

			.close-icon {
				width: 100%;
				height: 100%;
			}
		}

		.white {
			color: rgba(255, 255, 255, 0.6);
		}

		.realation {
			padding: 194rpx 40rpx 0 40rpx;
			width: 100%;

			.input {
				padding: 0 20rpx;
				color: #fff !important;
			}

			.space-line {
				width: 100%;
				height: 2rpx;
				background: #fff;
				margin-top: 22rpx;
			}
		}
	}

	.selecte-user {
		display: none;
	}

	.show-selecte-layer {
		display: block;
	}
</style>
