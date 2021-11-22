<template>
	<!-- 添加报告 -->
	<view>
		<cu-custom :bgColor="NavBarColor" :isBack="true">
			<block slot="content">添加报告</block>
		</cu-custom>
		<view class="testing">
			<view class="section">
				<picker class="picker" @change="bindTempChange($event)" :value="tempIndex" :range="temps"
					range-key="name">
					<view class="flex-box">
						<text class="grey-font">报告类型</text>
						<text class="right">{{tempIndex!=null&&temps[tempIndex]?temps[tempIndex].name:''}}</text>
					</view>
				</picker>
			</view>
			<view class="section">
				<picker mode="date" :value="date" start="2015-09-01" @change="bindDateChange($event)">
					<view class="flex-box">
						<text class="grey-font">报告时间</text>
						<text class="right">{{date}}</text>
					</view>
				</picker>
			</view>

			<view class="section">
				<view class="grey-font">照片</view>
				<view class="imgs">
					<image class="img" src="/static/images/healthy/upload-image-icon.png" @tap="uploadImg" />
					<view v-for="(item,index) in imgs" :key="index" index="index" item="item">
						<view class="record-img">
							<image class="img" :src="item" @tap="" />
							<image class="delete-icon" src="/static/images/healthy/delete-icon.png"
								@tap="deleteImg(item,index)" />
						</view>
					</view>
				</view>
			</view>

			<view class="submit">
				<button class="submit" type="primary" @tap="submit">完成</button>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		ACCESS_TOKEN
	} from '@/common/util/constants.js'
	import {
		gettemplates,
		addDataset
	} from '@/api/health.js'
	import {
		uploadImageUrl
	} from '@/api/user.js'
	import {
		spliceTimeStr
	} from '@/common/util/tool.js'

	export default {
		data() {
			return {
				user: null,
				temps: null,
				tempIndex: null,
				date: '',
				imgs: [],
				imgsPath: []
			};
		},
		watch: {

		},
		onLoad() {
			let self = this
			gettemplates().then(res => {
				self.temps = res.data
			})
			let UserInfo = this.$store.getters.currentUserInfo
			console.log(UserInfo)
			self.user = UserInfo
		},
		methods: {
			//更新个人所有数据
			updateMe(self) {
				this.$store.dispatch("getCurrentUserInfo", {
					token: uni.getStorageSync(ACCESS_TOKEN),
					refresh: true
				}).then(res => {
					// let _data = res;
					// // 切掉多余的时间
					// if (_data.birthday && _data.birthday !== null) {
					// 	_data.birthday = spliceTimeStr(_data.birthday);
					// }
					uni.navigateBack({
						delta: 1
					})

				}).catch(err => {
					console.log(err);
					uni.showToast({
						title: '更新',
						icon: 'none',
						duration: 2000,
					})
				});
			},
			bindTempChange(e) {
				console.log(e.detail.value);
				this.tempIndex = e.detail.value
			},
			bindDateChange(e) {
				// console.log(e.detail.value);
				this.date = e.detail.value
			},
			//上传图片
			uploadImg() {
				const self = this
				if (this.imgs.length) {
					uni.showToast({
						title: '图片只能添加一张',
						icon: 'none',
						duration: 2000,
					})
					return
				}
				uni.chooseImage({
					count: 1, // 默认9
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success: function(res) {
						console.log(res)
						if( res.tempFiles[0].size>2*1024*1024){
							self.$tip.toast("图片大小限制:2M")
							return
						}
						// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
						const tempFilePath = res.tempFilePaths[0]
						uni.showLoading({
							title: '上传中...'
						})
						console.log(111111111111)
						console.log(uploadImageUrl())
						uni.uploadFile({
							url: uploadImageUrl(),
							filePath: tempFilePath,
							name: 'file',
							formData: {
								'user': 'test'
							},
							success: function(res) {
								console.log(res)
								uni.hideLoading()
								let _data = JSON.parse(res.data).data;
								// console.log('_data', _data);
								self.imgs.push(_data.url)
								self.imgsPath.push(_data.path)
							},
							fail: function(err) {
								console.log(err)
								uni.showToast({
									title: '图片上传失败',
									icon: 'none',
									duration: 2000,
								})
							}
						})
					}
				})
			},
			//删除图片
			deleteImg(item, index) {
				// console.log(e, 'e');
				const idx = index
				this.imgs.splice(idx, 1)
				this.imgsPath.splice(idx, 1)
			},
			//提交数据
			submit() {
				if (this.tempIndex==null || !this.date) {
					uni.showToast({
						title: '信息不完整，不能保存',
						icon: 'none',
						duration: 2000,
					})
					return;
				}

				if (!this.imgs.length) {
					uni.showToast({
						title: '未上传图片',
						icon: 'none',
						duration: 2000,
					})
					return;
				}
				const self = this
				// const {id: template_id, practices: pracs} = this.temps[this.tempIndex]
				const {
					id: template_id
				} = this.temps[this.tempIndex]
				// pracs.forEach(p => p.order = 0)

				const turnover = {
					record_at: this.date,
					storage_at: this.imgsPath[0],
					user_id: this.user.id,
					supplier_id: 2,
					type: 1
				}
				const target = {
					template_id,
					pracs: [],
					...turnover
				}
				// console.log(target);
				addDataset(target).then(res => {
					self.updateMe()
				}).catch(err => {
					uni.showToast({
						title: '保存失败',
						icon: 'none',
						duration: 2000,
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.flex-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.grey-font {
		color: #9B9B9B;
	}

	.text-right {
		text-align: right;
	}

	.testing {
		box-sizing: border-box;
		border-top: 10rpx solid #F6F6F6;
		overflow-y: scroll;
		background-color: #fff;

		.section {
			box-sizing: border-box;
			padding: 24rpx 30rpx;
			border-bottom: 1px solid #EFEFF0;

			.imgs {
				margin-top: 15rpx;
				display: flex;
			}

			.img {
				display: inline-block;
				width: 200rpx;
				height: 200rpx;
				margin-right: 20rpx;

				&:active {
					opacity: .2;
				}
			}

			.record-img {
				display: inline-block;
				position: relative;

				.img {
					&:active {
						opacity: 1;
					}
				}

				.delete-icon {
					width: 36rpx;
					height: 36rpx;
					position: absolute;
					right: 4px;
					top: -4px;

					&:active {
						opacity: .2;
					}
				}
			}
		}

		.submit {
			position: absolute;
			bottom: 40rpx;
			left: 20rpx;
			right: 20rpx;
		}
	}
</style>
