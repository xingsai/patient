<template>
	<view>
	<!-- 运动处方和用药处方是一个页面 -->
		<cu-custom :bgColor="NavBarColor" :isBack="true">
			<block slot="content">处方详情</block>
		</cu-custom>
		<view class="detail">
			<view class="header">
				<!-- detia.name 用于运动处方； detail.drug 用于用药处方 -->
				<view class="name">{{ detail.name ? detail.name : detail.drug }}</view>
				<view class="type">{{ type }}</view>
			</view>
			<view class="space"></view>

			<view class="article">
				<view class="content">
					<view v-for="(item,index) in detail.pracs" :key="index" index="index" item="item">
						<view class="list">
							<text class="slot">{{ item.slot }}</text>
							<!-- 针对运动用药计划做的条件展示 -->
							<text class="value" v-if="item.level ">{{ item.level }}</text>
							<text class="value" v-if="!item.level ">{{ item.value }} {{ item.unit }}</text>
						</view>
					</view>
				</view>
				<block v-if=" detail.acts&&detail.acts[0]&&detail.acts[0].pracs&&detail.acts[0].pracs.length > 0 ">
					<view class="space"></view>
					<view class="content">
						<view v-for="(item,index) in detail.acts[0].pracs" :key="index" index="index" item="item">
							<view class="list">
								<text class="slot">{{ item.slot }}</text>
								<text class="value">{{ item.level }} {{ item.unit }}</text>
							</view>
						</view>
					</view>
				</block>
			</view>

			<view class="footer">
				<button v-if=" comType === '1' && showButton " type="primary" class="btn"
					@tap="toBluetooth">开始扫描</button>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '@/api/api'
	export default {
		data() {
			return {
				type: '',
				detail: {}, // 当前要渲染的对象
				showButton: true,
				comType: '',
			};
		},
		watch: {

		},
		onLoad(options) {
			console.log(options)
			this.comType = options.type
			this.getData(options.type, options.index)
		},
		methods: {
			//获取信息
			getData(_type, _index) {
				const self = this;
				// options.type == 1 代表运动处方
				if (_type == 1) {
					uni.getStorage({
						key: 'actsList',
						success: res => {
							console.log(res);
							const _data = res.data;

							// 取得要渲染的类型，和要渲染的项
							self.type = _data.type;
							self.detail = _data.actsList[_index];

							self.detail.pracs.length ? this.showButton = true : this.showButton = false;
						}
					})
				} else if (_type == 2) { // options.type == 2 代表用药计划
					uni.getStorage({
						key: 'drgsList',
						success: res => {
							console.log(res);
							self.detail = res.data[_index];
							console.log(self.detail)

						}
					})
				}
			},
			toBluetooth() {
				console.log(this.detail)
				const sportTimeObj = this.detail.pracs.find(item => item.practice_id === 566)
				if(sportTimeObj&&sportTimeObj.value){
					console.log(sportTimeObj)
					const sportId = this.detail.id
					uni.navigateTo({
						url: '/pages1/recipe/bluetooth?time=' + sportTimeObj.value + '&id=' + sportId
					});
				}else{
					this.$tip.toast("该运动不支持该操作！")
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #fff;
	}

	.detail {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		// padding: 25rpx 41rpx 27rpx 41rpx;
		font-size: 30rpx;
		line-height: 42rpx;

		.header {
			padding: 25rpx 41rpx 27rpx 41rpx;

			.name {
				font-size: 36rpx;
				line-height: 50rpx;

			}

			.type {
				margin-top: 6rpx;
				color: blue;
			}
		}

		.space {
			width: 100%;
			height: 20rpx;
			background: #e3e3e3;
		}

		.article {
			flex-grow: 1;

			.content {
				.list {
					display: flex;
					justify-content: space-between;
					padding: 23rpx 20rpx 23rpx 41rpx;
					border-bottom: 1rpx solid #e3e3e3;

					.slot {
						margin-right: 50rpx;
					}
				}
			}
		}

		.footer {
			padding: 25rpx 50rpx;
		}
	}
</style>
