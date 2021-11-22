<template>
	<view>
		<cu-custom :bgColor="NavBarColor" :isBack="true">
			<block slot="content">评测结果</block>
		</cu-custom>
		<view class="grade" >
			<image src="/pages1/static/score-bg.png" mode="widthFix" class="bg-img" lazy-load="false">
			</image>
			<view class="total-grade">{{tableData.score}}</view>
		</view>
		<view class="wavect">
			<view class="wave"></view>
		</view>
		<view class="main">
			<view class="detail-grade">
				<view class="nav " :class="{ 'border-line':( showScore? true :false)}">
					<view class="tip">
						<view class="tip-icon score-icon"></view>
						<text>得分详情</text>
					</view>
					<view class="spread" @tap="showScoreHandler">{{ !showScore ? '展开' : '收起' }}</view>
				</view>
				<view class="chart" v-if=" showScore ">
					<scroll-view scroll-x style="height: 209rpx;">
						<view class="chart-wrap">
							<view v-for="(item ,index) in tableData.stats" :key="index" index="index" item="item">
								<view class="chart-item">
									<view class="per">{{item.score}}</view>
									<view class="map">
										<view class="map-per" :style="{height: item.score+'%'}"></view>
									</view>
									<view class="name">{{item.name}}</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
			<view class="comment">
				<view class="tip">
					<view class="tip-icon"></view>
					<view>评语</view>
				</view>
				<view class="content">{{tableData.comment}}</view>
			</view>
			<navigator :url="'/pages/index/scale'" open-type="switchTab" hover-class="none">
				<view class="btnct">
					<button type="primary" class="backindex">返回首页</button>
				</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				tableData: {},
				percentH: 60, // 柱状图高度
				showScore: false
			};
		},
		computed: {},
		watch: {

		},
		created() {

		},
		onLoad(options) {
			let self = this;
			this.id = options.id;
			uni.getStorage({
				key: 'tableDone',
				success(res) {
					console.log(res.data, 'score');
					self.tableData = res.data;
				}
			});
		},
		methods: {
			showScoreHandler() {
				this.showScore = !this.showScore;
			},
		}
	}
</script>

<style lang="scss" scoped>
	@keyframes scrollHeight {
		from {
			height: 0;
		}

		to {
			height: 209rpx;
		}
	}

	page {
		position: relative;
	}

	.tip {
		display: flex;
		padding: 20rpx 25rpx;
		align-items: center;
		font-size: 36rpx;
		line-height: 50rpx;
		color: #4A4A4A;
		border-bottom: 1rpx solid #e3e3e3;

		.tip-icon {
			margin-right: 13rpx;
			width: 38rpx;
			height: 28rpx;
			background: url('/static/images/comment-detail-icon.png') no-repeat;
			background-size: contain;
		}

		.score-icon {
			background: url('/static/images/score-detail-icon.png') no-repeat;
			background-size: contain;
		}
	}

	// .score {
	//     position: relative;
	// flex-grow: 1;
	// display: flex;
	// flex-direction: column;
	// padding-bottom: 80rpx;

	.grade {
		position: absolute;
		z-index: 2;
		width: 100%;
		height: 430rpx;
		
		.bg-img{
			position: absolute;
			top:0;
			right:0;
			bottom: 0;
			left:0;
			height: 100%;
			width:100%;			
		}

		.total-grade {
			// min-width: 100rpx;
			height: 84rpx;
			line-height: 84rpx;
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			transform: translateY(-10rpx);
			margin: auto;
			font-size: 60rpx;
			text-align: center;
			color: $uni-bg-color;
		}
	}

	.wavect {
		/* 用于控制页面溢出，产生横向滚动条bug */
		position: relative;
		width: 750rpx;
		height: 750rpx;
		overflow: hidden;
		/* end */

		.wave {
			position: absolute;
			z-index: 2;
			left: 0;
			right: 0;
			top: 900rpx;


			&::before,
			&::after {
				content: "";
				position: absolute;
				width: 750rpx;
				height: 750rpx;
				top: -5%;
				left: 25%;
				background-color: rgba(255, 255, 255, .4);
				border-radius: 41%;
				transform: translate(-50%, -70%) rotate(0);
				animation: rotate 10s linear infinite;
				z-index: 10;
			}

			&::after {
				top: -10%;
				left: 75%;
				border-radius: 43%;
				background-color: rgba(255, 255, 255, .9);
				transform: translate(-50%, -70%) rotate(0);
				animation: rotate 10s linear infinite;
				animation-delay: 1s;
				z-index: 20;
			}
		}
	}

	.main {
		position: absolute;
		z-index: 3;
		top: 530rpx;
		left: 0;
		right: 0;
		padding-bottom: 55rpx;

		.detail-grade {
			width: 700rpx;
			min-height: 100rpx;
			margin: 0 auto;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0rpx 0rpx 8rpx 5rpx rgba(239, 239, 239, 1);
			border-radius: 10rpx;
			transition: all 1s;

			.nav {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.tip {
					border: none;
					margin-top: 5rpx;
				}

				.spread {
					margin-right: 21rpx;
					font-size: 30rpx;
					line-height: 50rpx;
					color: $uni-color-primary;
					padding: 0 20rpx;
					border: 1rpx solid $uni-color-primary;
					border-radius: 25rpx;
				}
			}

			.border-line {
				border-bottom: 1rpx solid #e3e3e3;
			}
		}

		.hide-grade {
			visibility: hidden;
		}

		.comment {
			box-sizing: border-box;
			margin: auto;
			margin-top: 32rpx;
			width: 700rpx;
			min-height: 300rpx;
			background: $uni-bg-color;
			box-shadow: 0rpx 0rpx 8rpx 5rpx rgba(239, 239, 239, 1);
			border-radius: 10rpx;
			font-size: 30rpx;
			line-height: 42rpx;


			.content {
				padding: 20rpx 34rpx;
				color: #909193;
			}
		}

		// 按钮样式
		.btnct {
			margin-top: 102rpx;

			.backindex {
				width: 650rpx;
				height: 90rpx;
				border-radius: 10rpx;
				font-size: 32rpx;
			}
		}
	}

	// 图标样式
	.chart {
		padding: 22rpx 80rpx;
		font-size: 27rpx;
		line-height: 38rpx;

		.chart-scroll {
			height: 209rpx;
			animation: scrollHeight .5 forwards;
		}

		.chart-wrap {
			min-width: 750rpx;
			display: flex;

			.chart-item {
				display: flex;
				flex-direction: column;

				align-items: center;
				margin-right: 65rpx;

				.map {
					display: flex;
					flex-direction: column;
					justify-content: flex-end;

					width: 31rpx;
					height: 138rpx;

					.map-per {
						width: 100%;
						height: 100%;
						background: url('/static/images/percent.png') no-repeat;
						background-size: cover;
					}
				}

				.name {
					white-space: nowrap;
				}
			}
		}
	}
	@keyframes rotate {
	    50% {
	        transform: translate(-50%, -73%) rotate(180deg);
	    } 100% {
	        transform: translate(-50%, -70%) rotate(360deg);
	    }
	}

	// }
</style>
