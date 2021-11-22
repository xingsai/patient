<template>
	<view>
		<cu-custom :bgColor="NavBarColor" :isBack="true">
			<block slot="content">个人信息</block>
		</cu-custom>
		<view class="baseinfo">
			<view class="header"  >
				<image src="/pages1/static/headbg.png" mode="widthFix" class="bg-img" lazy-load="false">
				</image>
				<view class="head">
					<image :src="userData.avatar_url?userData.avatar_url:''"  @tap="uploadAvatar" lazy-load="false">
					</image>
				</view>
				<image v-if="!userData.id" class="camera" :src="'/static/images/camera.png'" mode="scaleToFill"
					@tap="goBack" lazy-load="false">
				</image>
			</view>
			<view class="form">
				<form>
					<view class="label">
						<text class="intro">姓名</text>
						<input placeholder="用户姓名" :value="userData.name" type="text" data-type="name"
							@input="bindChange" />
					</view>
					<view class="label sexct">
						<text class="intro">性别</text>
						<input placeholder="用户性别" :value="sex" type="text" disabled data-type="gender" />
						<picker @change="bindPickerGender" :value="userData.gender" :range="sexArr">
							<button class="sexbtn" type="default">选择</button>
						</picker>
					</view>
					<view class="label">
						<text class="intro">手机号</text>
						<input placeholder="用户手机号" :value="userData.phone" type="number" data-type="phone"
							@input="bindChange" />
					</view>
					<view class="label">
						<text class="intro">出生日期</text>
						<picker class="birth-picker" mode="date" :value="userData.birthday" data-type="birthday"
							@change="bindChange">
							<view class="picker">
								<text v-if=" userData.birthday == ''">年-月-日</text>
								{{userData.birthday}}
							</view>
						</picker>
					</view>
					<view class="label">
						<text class="intro">身份证号</text>
						<input placeholder="用户身份证号" :value="userData.idcard" type="text" data-type="idcard"
							@input="bindChange" />
					</view>
					<view class="label">
						<text class="intro">身高(cm)</text>
						<input placeholder="净身高" :value="userData.height" type="number" data-type="height"
							@input="bindChange" />
					</view>
					<view class="label">
						<text class="intro">体重(kg)</text>
						<input placeholder="现体重" :value="userData.weight" type="number" data-type="weight"
							@input="bindChange" />
					</view>
					<view class="label">
						<text class="intro">地区</text>
						<picker mode="region" @change="bindRegionChange" :value="userData.areacode">
							<view class="picker">
								{{userData.area[0]}}/{{userData.area[1]}}/{{userData.area[2]}}
							</view>
						</picker>
						<!-- 		<uni-data-picker  :map="map" placeholder="请选择地址" popup-title="请选择城市" :localdata="areas" 
						 @change="onchange" @nodeclick="onnodeclick">
						    </uni-data-picker> -->
					</view>
					<view class="primary">
						<button type="primary" @tap="formSubmit">保存</button>
					</view>
				</form>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		ACCESS_TOKEN
	} from '@/common/util/constants.js'
	import {
		checkMobile,
		checkIdcard
	} from '@/common/util/tool.js'
	import {
		getInfo,
		updateUserInfoDetail,
		addUserInfoDetail,
		uploadAvatarUrl
	} from '@/api/user.js'
	export default {
		name: "people",
		data() {
			return {
				staticDomainURL:this.$config.staticDomainURL,
				map: {
					text: 'label',
					value: 'value'
				},
				areas: [],
				edit: false, // 是否为完善资料进入
				userId: '', // 用于更新资料是传用户id
				site_id: '',
				auto_height: true,
				userData: {
					openid: '', // 如果是上传身份证方式	onload读取缓存拿不到
					birthday: '',
					name: '',
					gender: '',
					phone: '', // 如果是上传身份证方式	onload读取缓存拿不到
					idcard: '',
					avatar: '',
					avatar_url: 'https://oss.schillerchina.com/wx/head.png',
					formId: '',
					area: ['省', '市', '区'],
					areacode: '',
					height: '',
					weight: '',
				},
				sexArr: ['未知', '男', '女'],
				sex: '',
			};
		},
		computed: {},
		watch: {

		},

		onLoad(options) {
			console.log(options, 'baseinfo')
			this.edit = options.edit;
			this.userId = options.id;
			this.site_id = options.siteid;

			let self = this;
			// 已填写信息的用户重新编辑时，
			if (options.id) {
				let _data = this.$store.getters.currentUserInfo
				console.log(_data)
				// 处理性别
				const gender = _data.gender;
				if (gender == 0) {
					self.sex = '未知'
				} else if (gender == 1) {
					self.sex = '男'
				} else if (gender == 2) {
					self.sex = '女'
				}
				// 更新视图 合并对象，避免直接赋值一些属性变成不存在的情况
				let userData = Object.assign({}, self.userData, _data);
				self.userData = userData;

				// 处理地区选择器
				if (_data.area.length > 0) {
					const area = _data.area.split(',').splice(1);
					self.userData.area = area;
				} else {
					self.userData.area = ['省', '市', '区'];
					self.userData.areacode = '';
				}
				if (!self.userData.birthday) self.userData.birthday = '';

			} else {
				// 新用户填写信息时，读取身份证信息后返回的数据进行回显
				uni.getStorage({
					key: 'tempUserInfo',
					success(res) {
						let _data = res.data,
							gender = _data.gender;
						// self.userData = res.data;
						// self.userData.openid = _data.wx_openid;
						console.log(res.data, 'baseinfo-storage')

						if (gender == 0) {
							self.sex = '未知'
						} else if (gender == 1) {
							self.sex = '男'
						} else if (gender == 2) {
							self.sex = '女'
						}
						// console.log(_data)
						// _data.sex = self.sexArr[_data.gender]

						/**
						 * @desc 用Object.assign
						 * @desc var newobj = Object.assign({}, obj1, obj2)
						 */
						// 更新视图 合并对象，避免直接赋值一些属性变成不存在的情况						
						let userData = Object.assign({}, self.userData, _data);
						self.userData = userData;

						// 处理地区选择器: !!!重新赋值userData会把地区选择器要用到的变量变成不存在，所以要重新制定地区选择器用到的数据类型
						self.userData.area = ['省', '市', '区'];
						self.userData.areacode = '';

						if (_data.wx_openid === '') self.userData.wx_openid = options.openid;
						if (typeof self.userData.birthday === 'undefined') self.userData.birthday =
							''; //生日扫完身份证返回的信息没有带过来。所以判断了一次
						if (!self.userData.hasOwnProperty('avatar_url')) self.userData.avatar_url =
							'https://oss.schillerchina.com/wx/head.png';
						console.log(self.userData, '355');
					}
				});
			}

		},
		methods: {
			onchange(e) {
				const value = e.detail.value
			},
			onnodeclick(node) {},
			bindChange(e) {
				let res = (e.detail.value + '').trim(),
					datas = e.currentTarget.dataset;
				// console.log(datas)
				this.userData[datas.type] = datas.inputType == 'num' ? +res : res; //如果输数字类型 将字符串转成数字
			},
			bindPickerGender(e) {
				this.userData.gender = e.detail.value
				this.sex = this.sexArr[e.detail.value];
			},
			genderChange(e) {
				console.log(e.detail.value);

				let value = e.detail.value;
				if (value == 0) {
					this.userData.gender = 1;
				} else if (value == 1) {
					this.userData.gender = 2;
				}
				console.log(this.userData.gender)
			},
			//区域选择
			bindRegionChange(e) {
				console.log(e)
				this.userData.areacode = e.detail.code[2];
				this.userData.area = e.detail.value;
				console.log(this.userData.areacode)
			},
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			//增加，或修改 用户信息
			formSubmit(e) {
				const self = this,
					info = this.userData;
				// console.log(info, '257')
				// 验证输入信息
				if (info.name !== '' && info.name.length > 20) {
					this.$tip.error('用户名过长', 1000);
					return;
				} else if (info.hasOwnProperty('phone') && info.phone !== '' && info.phone !== null && !checkMobile(info
						.phone)) {
					this.$tip.error('手机号有误', 1000);
					return;
				} else if (info.hasOwnProperty('idcard') && info.idcard !== '' && info.idcard !== null && !checkIdcard(info
						.idcard)) {
					this.$tip.error('身份证有误', 1000);
					return;
				}
				/**
				 * @desc 如果edit为ture代表是完善资料
				 * @desc 否则表示新用户注册填写资料
				 */
				if (this.edit) { // 编辑
					updateUserInfoDetail({
						data: info,
						id: this.userId
					}).then(res => {
						uni.switchTab({
							url: '/pages/user/people'
						});
					});
				} else { // 新建
					addUserInfoDetail(info).then(res => {
						const register = res;
						if (register.access_token) {
							uni.setStorageSync(ACCESS_TOKEN, res
								.access_token);
							if (self.site_id) {
								// 关联siteid，发请求后跳转我的页面
								const userId = register.data.id,
									siteData = {
										site_id: self.site_id
									};
								updateUserInfoDetail({
									data: siteData,
									id: userId
								}).then(update => {
									 console.log(update, 'update-baseinfo');
									if (update.status_code === 200) {
										this.$store.dispatch("setOtherId", 0)
										uni.switchTab({
											url: '/pages/user/people'
										});
									}
								})
							} else {
								this.$store.dispatch("setOtherId", 0)
								uni.switchTab({
									url: '/pages/user/people'
								});
							}
						}
					});
				}
			},
			//上传头像
			uploadAvatar() {
				let self = this;
				uni.chooseImage({
					count: 1,
					sizeType: [ 'compressed'],
					sourceType: ['album', 'camera'],
					success: res => {
						const tempFilePaths = res.tempFilePaths;
						this.$set(this.userData,"avatar_url",tempFilePaths[0])
						uni.showLoading({
							title: '上传中'
						});
						uni.uploadFile({
							url: uploadAvatarUrl(),
							filePath: tempFilePaths[0],
							name: 'avatar',
							success: res => {
								uni.hideLoading();
								let _data = JSON.parse(res.data).data;
								self.userData.avatar = _data.avatar;
								self.userData.avatar_url = _data.avatar_url;
							},
							fail: err => {
								self.$tip.error('上传失败', 1500);
							}
						});
					}
				});
			},

		}
	}
</script>

<style lang="scss" scoped>
	.baseinfo {
		background-color: #fff;

		.header {
			position: relative;
			box-sizing: border-box;
			width: 100%;
			height: 350rpx;
			padding-top: 57rpx;
			.bg-img{
				position: absolute;
				top:0;
				right:0;
				bottom: 0;
				left:0;
				height: 100%;
				width:100%;			
			}
			

			.head {
				position: absolute;
				top:0;
				right:0;
				bottom: 0;
				left:0;
				width: 233rpx;
				height: 233rpx;
				margin: auto;
				border-radius: 50%;
				text-align: center;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.camera {
				position: absolute;
				top: 30rpx;
				right: 30rpx;
				width: 35rpx;
				height: 30rpx;
			}
		}

		.form {
			.label {
				display: flex;
				font-size: 32rpx;
				line-height: 45rpx;
				padding: 27rpx 0 23rpx 39rpx;
				border-bottom: 1rpx solid #EEEFF1;

				.intro {
					min-width: 128rpx;
					margin-right: 45rpx;
				}

				input,
				textarea,
				.picker {
					color: #9FA0A2;
				}

				textarea {
					height: 45rpx;
				}
			}

			.sexct {
				align-items: center;
			}
		}

		.submit {
			width: 674rpx;
			height: 90rpx;
			margin: 100rpx auto 0 auto;
			background: rgba(221, 221, 221, 1);
			border-radius: 10rpx;
			border: 1rpx solid rgba(221, 221, 221, 1);
			font-size: 30rpx;
			line-height: 90rpx;
			text-align: center;

			&.blue {
				background: $uni-color-primary;
				color: $uni-bg-color;
			}
		}

		.primary {
			padding: 100rpx 38rpx 50rpx 38rpx;
		}
	}

	.birth-picker {
		width: 500rpx;

		.picker {
			height: 44rpx;
		}
	}

	.sexbtn {
		width: 140rpx;
		height: 55rpx;
		line-height: 55rpx;
		font-size: 25rpx;
		color: #9FA0A2;
		margin-right: 30rpx;
	}
</style>
