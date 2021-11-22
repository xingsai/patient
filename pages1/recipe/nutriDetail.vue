<template>
	<view>
		<cu-custom :bgColor="NavBarColor" :isBack="true">
			<block slot="content">营养处方</block>
		</cu-custom>
		<view class="nutri-detail">
			<view class="nav">
				<view class="list">
					<view class="left">
						<view class="name">{{ render.name }}</view>
						<view class="unit"><text class="stress">{{ type == 1 ? '推荐食物' : '禁忌食物' }}</text></view>
					</view>
					<view class="right">
						<view v-if=" type == 1">
							<view class="percent">{{ render.rate }}</view>
							<view class="length green-slip">
								<image class="per-icon" :style="{width:  render.percent +'%'}"
									src="/static/images/recipelImg/green-percent-icon.png" mode="scaleToFill"
									lazy-load="false">
								</image>
							</view>
							<view class="ratings">推荐指数</view>
						</view>
						<view v-if="type == 2">
							<view class="percent red-font">{{ render.rate }}</view>
							<view class="length red-slip">
								<image class="per-icon " :style="{width:  render.percent +'%'}"
									src="/static/images/recipelImg/red-percent-icon.png" mode="scaleToFill"
									lazy-load="false">
								</image>
							</view>
							<view class="ratings">禁忌指数</view>
						</view>
					</view>
				</view>
			</view>

			<view class="type space">
				<view class="common-item" v-if=" type == 1 ">
					<text>交换份（g/份）</text>
					<text class="article">{{ render.exchange }}</text>
				</view>
				<view class="common-item no-border">
					<text>卡路里（Kcal）</text>
					<text class="article">{{ render.calories}}</text>
				</view>
			</view>
			<view class="detail space">
				<view class="common-item">
					<text>碳水化合物（g）</text>
					<text class="article">{{ render.carbohydrate }}</text>
				</view>
				<view class="common-item no-border">
					<text>脂肪（g）</text>
					<text class="article">{{ render.fat }}</text>
				</view>
				<view class="common-item no-border">
					<text>蛋白质（g）</text>
					<text class="article">{{ render.protein }}</text>
				</view>
				<view class="common-item no-border">
					<text>纤维素（g）</text>
					<text class="article">{{ render.cellulose }}</text>
				</view>
			</view>
			<view class="advise space">
				<view class="common-item">
					<text class="intro">食用建议</text>
					<text class="article">{{ render.evaluation }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				type: null, // 区分渲染的食物类型 1代表推荐 2代表禁忌
				render: {},
			}
		},
		onLoad(options) {
			this.type = options.type;
			this.getData(options.type, options.index);
		},
		methods: {
			//获取信息
			async getData(_type, _index) {
				let self = this
				uni.getStorage({
					key: 'foods',
					success: res => {
						console.log(res)
						const allowFoods = res.data.allowFoods,
							avoidFoods = res.data.avoidFoods;
						if (_type == 1) {
							self.render = allowFoods[_index];
						} else {
							self.render = avoidFoods[_index]
						}
						console.log(self.render)
					}
				})
			},
		}
	}
</script>
<style lang="scss" scoped>
	.nutri-detail {
		flex-grow: 1;
		display: flex;
		flex-direction: column;

		.nav {
			background: #fff;
			border-top: 2rpx solid #F2F2F3;

			.list {
				display: flex;
				justify-content: space-between;
				padding: 16rpx 30rpx 16rpx 39rpx;
				border-bottom: 1rpx solid #e3e3e3;

				.left {
					margin-top: 1rpx;

					.name {
						font-size: 30rpx;
						line-height: 42rpx;
						font-weight: 400;
					}

					.unit {
						font-size: 26rpx;
						line-height: 37rpx;
						color: #9FA0A2;

						.stress {
							color: blue;
						}
					}
				}

				.right {
					font-size: 22rpx;
					line-height: 30rpx;
					color: #9FA0A2;
					text-align: center;

					.percent {
						color: #ABCD4D;
					}

					.red-font {
						color: #FE785C;
					}

					.red-percent {
						color: #FE785C;
					}

					.green-slip {
						background: url('/static/images/recipelImg/green-line-bg.png') no-repeat;
						background-size: cover;
					}

					.red-slip {
						background: url('/static/images/recipelImg/red-line-bg.png') no-repeat;
						background-size: cover;
					}

					.red-slip {
						background: url('/static/images/recipelImg/red-line-bg.png') no-repeat;
						background-size: cover;
					}

					.length {
						display: flex;
						width: 144rpx;
						height: 15rpx;
						overflow: hidden;
						border-radius: 10rpx;

						.per-icon {
							width: 100%;
							height: 15rpx !important;
							border-radius: 10rpx;
						}
					}

					.ratings {
						margin-top: 10rpx;
					}
				}
			}
		}

		.type,
		.detail,
		.advise {
			background: #fff;
		}

		.advise {
			flex-grow: 1;

			.intro {
				white-space: nowrap;
				margin-right: 103rpx;
			}
		}
	}

	.common-item {
		display: flex;
		justify-content: space-between;
		padding: 22rpx 29rpx 24rpx 41rpx;
		border-bottom: 1rpx solid #e3e3e3;
		font-size: 30rpx;
		line-height: 42rpx;
		color: #4A4A4A;
	}

	.article {
		color: #909193;
		// flex-grow: 2
	}

	.space {
		margin-top: 20rpx;
	}

	.no-border {
		border-bottom: none;
	}
</style>
