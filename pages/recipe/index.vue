<template>
	<view>
		<!-- 各处方入口 -->
		<cu-custom :bgColor="NavBarColor" :isBack="false" backRouterName="index">
			<block slot="content">处方</block>
		</cu-custom>
		<view class="recipel">
			<view v-for="(item ,index) in renderData" :key="index" :index="index">
				<navigator :url="item.href" open-type="navigate" hover-class="none">
					<view class="item">
						<view class="type">
							<image class="type-icon" :src="item.imgurl" mode="widthFix" lazy-load="false">
							</image>
						</view>
						<view class="intro">
							<view class="name">{{item.name}}</view>
							<view class="intro-icon">
								<image src="/static/images/link-icon.png" mode="widthFix" lazy-load="false">
								</image>
							</view>
						</view>
					</view>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				renderData: [{
						href: '/pages1/recipe/motion',
						imgurl: '/static/images/recipelImg/heart.png',
						name: '运动处方'
					},
					{
						href: '/pages1/recipe/pharmacy',
						imgurl: '/static/images/recipelImg/corss.png',
						name: '用药计划'
					},
					{
						href: '/pages1/recipe/nutrition',
						imgurl: '/static/images/recipelImg/cooking.png',
						name: '营养计划'
					}
				],
			}
		},
		created() {

		},
		methods: {

		}
	}
</script>
<style lang="scss" scoped>
	.recipel {
		padding: 34rpx 30rpx;

		.item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-sizing: border-box;
			width: 100%;
			height: 235rpx;
			padding: 39rpx 50rpx 39rpx 93rpx;
			margin-bottom: 19rpx;
			background: $uni-bg-color;

			.type {
				.type-icon {
					width: 202rpx;
					height: 157rpx;
				}
			}

			.intro {
				display: flex;
				align-items: center;
				font-size: 34rpx;
				line-height: 48rpx;

				.intro-icon {
					margin-left: 73rpx;
					color: #9B9B9B;
					width: 20rpx;
					height: 35rpx;

					&>image {
						width: 100%;
					}
				}
			}
		}
	}
</style>
