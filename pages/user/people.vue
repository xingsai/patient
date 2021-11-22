<template>
	<view>
		<cu-custom :bgColor="NavBarColor" :isBack="false" backRouterName="index">
			<block slot="content">我的</block>
		</cu-custom>
		<view class="content">
			<view class=" popup" :class="{ 'show-qr':( showQrcode ? true :false)}">
				<view class="qr-ct">
					<image class="img-style qr-img" @click="goAdd" :src="qrimg" mode="widthFix" />
					<!-- <canvas class="qr-img" canvas-id="myQrcode"></canvas> -->
					<view class="qr-text">{{qrText}}</view>
					<view class="btn-ct qr-btn-ct">
						<button class="btn flex-1 left-btn" @tap="riseQrIndex">切换</button>
						<button type="default" class="btn flex-1" @tap="closeQrcode">关闭</button>
					</view>
				</view>
			</view>
			<view class="switch-user active">
				<view @tap="toFiles('/pages/user/selectuser?choice=true')">
					<image class="switch-btn" src="/static/images/me/switch-btn.png"></image>
					<text>切换用户</text>
				</view>
			</view>

			<view class="information">
				<view class="header">
					<view class="header-left">
						<text class="name">{{userData.name}}</text>
						<text class="is-owner">{{owner.id === userData.id ? '本人' : '亲友'}}</text>
						<text class="gender" v-if="userData.gender == 1">男</text>
						<text class="gender" v-if="userData.gender == 2">女</text>
					</view>
					<view class="health" @tap="toFiles('/pages1/healthy/basic')">
						<text>健康档案</text>
					</view>
				</view>
				<view class="main">
					<view class="item">
						<text>出生日期：</text>
						<text v-if="!userData.birthday"></text>
						<text v-if="userData.birthday">{{userData.birthday}}</text>
					</view>
					<view class="item">
						<text>身份证号：</text>
						<text v-if="!userData.idcard"></text>
						<text v-if="userData.idcard">{{userData.idcard}}</text>
					</view>
					<view class="item">
						<text>手机号：</text>
						<text v-if="!userData.phone"></text>
						<text v-if="userData.phone">{{userData.phone}}</text>
					</view>
					<view class="item">
						<text>地区：</text>
						<text>{{userData.area}}</text>
					</view>
					<view class="item">
						<text>身高：</text>
						<text v-if="userData.height">{{userData.height}}cm</text>
					</view>
					<view class="item">
						<text>体重：</text>
						<text v-if="userData.weight">{{userData.weight}}kg</text>
					</view>
				</view>
				<navigator :url="'/pages1/user/baseInfo?edit=true&id='+userId" open-type="navigate" hover-class="none">
					<image class="edit-info active" src="/static/images/me/edit-info.png"></image>
				</navigator>
			</view>
			<view class="btnct submit">
				<button class=" evpi" type="primary" @tap="gernateQrcode">我的二维码</button>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		ACCESS_TOKEN
	} from '@/common/util/constants.js'
	import {
		getInfo,
		getUserInfoDetail
	} from '@/api/user.js'
	import * as QR from "@/common/util/wxqrcode.js"
	export default {
		name: "people",
		data() {
			return {
				qrimg: '',
				logined: false, //是否登录
				owner: {},
				userId: '',
				userData: {
					name: '',
					gender: '',
					birthday: '',
					idcard: '',
					phone: '',
					area: ''
				},
				showQrcode: false,
				qrIndex: 0,
			};
		},
		computed: {
			qrText() {
				if (this.userData.sites && this.userData.sites.length) {
					return this.userData.sites[this.qrIndex].title
				}
				return ''
			}
		},
		watch: {
			 "$store.getters.otherId":{
			      handler(val,oldval){
					//获取用户的所有信息
					this.getUserAllInfo()	
			      },
			      // 深度观察监听
			      deep: true
			    }
		},
		onLoad(query) {
			//获取用户的所有信息
			this.getUserAllInfo()
		},
		onShow() {

		},
		onPullDownRefresh() {
			//获取用户的所有信息
			this.getUserAllInfo()
		},
		methods: {
			toFiles(url) {
				uni.navigateTo({
					url: url //有健康档案
				});
			},
			riseQrIndex() {
				this.qrIndex++

				if (this.qrIndex === this.userData.sites.length) {
					this.qrIndex = 0
				}
				this.qrimg = QR.createQrCodeImg(this.userData.sites[this.qrIndex].title, {
					'size': 200
				});
			},
			gernateQrcode() {
				if (!this.userData.sites.length) {
					wx.showToast({
						title: '信息不全，无法获取二维码',
						icon: 'none',
						duration: 2000,
					})
					return;
				}
				this.qrimg = QR.createQrCodeImg(this.userData.sites[this.qrIndex].title, {
					'size': 200
				});
				this.toggleQrcode()
			},
			toggleQrcode() {
				this.showQrcode = !this.showQrcode
			},
			closeQrcode() {
				this.toggleQrcode()
			},
			//获取用户的所有信息
			async getUserAllInfo() {
				let id = this.$store.getters.otherId
				console.log(this.$store.getters.otherId)
				if (id) {
					//获取亲友信息
					getUserInfoDetail({
						params: {
							id
						}
					}).then((res) => {
						console.log(res)
						this.userData = res.data
						this.userId = res.data.id
						this.$store.commit('SET_CURRENTUSERINFO', res.data)
						uni.stopPullDownRefresh();

					})
				} else {
					//获取本人信息
					this.$store.dispatch("getCurrentUserInfo", {
						token: uni.getStorageSync(ACCESS_TOKEN),
						refresh: true
					}).then((res) => {
						console.log(res)
						this.owner = res
						this.userData = res
						this.userId = res.id
						uni.stopPullDownRefresh();
					})
				}

			},
		}
	}
</script>

<style lang="scss" scoped>
	.active {
		&:active {
			opacity: .5;
		}
	}

	.flex-1 {
		flex: 1;
	}

	.flex-2 {
		flex: 2;
	}

	.switch-user {
		margin-top: 40rpx;
		font-size: 32rpx;
		font-weight: 400;
		line-height: 45rpx;
		text-align: center;

		.switch-btn {
			width: 25rpx;
			height: 25rpx;
			margin-right: 10rpx;
		}
	}

	.information {
		position: relative;
		width: 690rpx;
		margin: 0 auto;
		min-height: 679rpx;
		margin-top: 39rpx;
		box-sizing: border-box;
		background: url('/static/images/me/me-bg.png') no-repeat;
		background-size: cover;


		.header {
			display: flex;
			justify-content: space-between;
			padding: 22rpx 29rpx 22rpx 27rpx;
			border-bottom: 1px solid #e3e3e3;

			.name {
				font-size: 34rpx;
				line-height: 48rpx;
				margin-right: 20rpx;
			}

			.health {
				color: $uni-color-primary;
			}

			.is-owner {
				display: inline-block;
				margin-right: 46rpx;
				transform: translateY(-10rpx);
				box-sizing: border-box;
				padding: 5rpx;
				font-size: 22rpx;
				font-weight: 400;
				color: #4D7ECD;
				line-height: 30rpx;
				background: rgba(77, 126, 205, 0.1);
				border-radius: 15rpx;
			}
		}

		.main {
			font-size: 30rpx;
			line-height: 42rpx;
			color: $uni-text-color-grey;
			padding: 20rpx 27rpx;

			.item {
				padding-bottom: 17rpx;
			}
		}

		.edit-info {
			position: absolute;
			right: 63rpx;
			bottom: 33rpx;
			width: 50rpx;
			height: 50rpx;
		}
	}

	.submit {
		margin-top: 90rpx;

		.evpi {
			width: 350rpx;
			height: 90rpx;
			line-height: 90rpx;
			font-size: 36rpx;
			border-radius: 47rpx;
			box-shadow: 0rpx 0rpx 10rpx 0rpx rgba(77, 126, 205, 1);
		}
	}

	.switch {
		margin-top: 40rpx;

		.evpi {
			box-shadow: none;
			border: 1rpx solid rgba(0, 0, 0, 1);
		}
	}

	.popup {
		position: absolute;
		top: 100%;
		left: 0;
		bottom: -100%;
		right: 0;
		background: #ccc;
		display: none;
		// transition: .5s all;
		z-index: -1;
	}

	.qrcode {
		margin-top: 40rpx;
	}

	.qr-ct {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.qr-img {
		width: 200px;
		height: 200px;
		margin: auto;
	}

	.qr-text {
		margin-top: 10rpx;
		text-align: center;
	}

	.qr-btn-ct {
		margin-top: 40rpx;
		display: flex;

		.btn {
			font-size: 35rpx;
			line-height: 75rpx;
		}

		.left-btn {
			margin-right: 20rpx;
		}
	}

	.show-qr {
		display: block;
		top: 0;
		bottom: 0;
		z-index: 100;
	}
</style>
