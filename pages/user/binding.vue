<template>
	<view>
		<cu-custom :bgColor="NavBarColor" :isBack="true">
			<block slot="content">信息填写</block>
		</cu-custom>
		<view class="binding">
			<view class="photograph">
				<image :src="picUrl?picUrl:'/static/images/binding-bg.png'" mode="widthFix" @tap="getHeadImg" lazy-load="false">
				</image>
			</view>
			<view class="fill" @tap="fillBaseInfo">
				<text>手动输入基本信息</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		ACCESS_TOKEN
	} from '@/common/util/constants.js'
	import {
		uploadIdcardUrl
	} from "@/api/user.js"
	import * as QR from "@/common/util/wxqrcode.js"
	export default {
		data() {
			return {
				wx_openid: '',
				site_id: '',
				picUrl:''
			}
		},
		mounted() {

		},

		watch: {

		},
		computed: {

		},
		beforeDestroy() {

		},
		onLoad(options) {
			console.log(options, 'binding-onload');
			this.wx_openid = options.openid;
			this.site_id = options.siteid;
		},
		methods: {
			getHeadImg() {
				let self = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: res => {
						// console.log(res);
						const tempFilePaths = res.tempFilePaths;
						console.log(tempFilePaths);
						this.picUrl=tempFilePaths[0]
						
                        uni.showLoading();
						uni.uploadFile({
							url:uploadIdcardUrl(), //身份证url
							filePath: tempFilePaths[0],
							name: 'idcard',
							success: function(res) {
								uni.hideLoading();
								let _data = JSON.parse(res.data).data;
								_data.wx_openid = self.wx_openid;
								uni.setStorage({
									key: 'tempUserInfo',
									data: _data,
									success: () => {
										if (self.site_id) {
											uni.navigateTo({
												url: '/pages1/user/baseInfo?type=new&openid=' +
													self.wx_openid +
													'&siteid=' + self.site_id
											});
										} else {
											uni.navigateTo({
												url: '/pages1/user/baseInfo?type=new&openid=' +
													self.wx_openid
											});
										}
									}
								});
							}
						})
					},
					fail: err => {
						console.log(err);
					}
				})
			},
			fillBaseInfo() {
				if (this.site_id) {
					uni.navigateTo({
						url: '/pages1/user/baseInfo?type=new&openid=' + this.wx_openid + '&siteid=' + this.site_id
					});
				} else {
					uni.navigateTo({
						url: '/pages1/user/baseInfo?type=new&openid=' + this.wx_openid
					});
				}
			}

		}
	}
</script>
<style lang="scss" scoped>
	image {
		width: 650rpx;
		height: 414rpx;
	}

	.binding {
		.photograph {
			padding: 70rpx 50rpx 0 50rpx;
		}

		.fill {
			width: 350rpx;
			height: 90rpx;
			margin: auto;
			margin-top: 396rpx;
			background: rgba(77, 126, 205, 1);
			box-shadow: 0rpx 0rpx 10rpx 0rpx rgba(77, 126, 205, 1);
			border-radius: 47rpx;
			font-size: 32rpx;
			color: #fff;
			line-height: 90rpx;
			text-align: center;
		}
	}
</style>
