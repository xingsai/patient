<template>
	<view>
		<!-- 检测记录 -->
		<cu-custom :bgColor="NavBarColor" :isBack="true">
			<block slot="content">检测记录</block>
		</cu-custom>

		<view class="testrecord">
			<view class="step">
				<view class="step-iconct" v-if="!navClick">
					<image class="step-cicon" src="/static/images/step/step-compile.png" mode="widthFill"
						lazy-load="false"></image>
					<image class="step-licon" src="/static/images/step/step-line2.png" mode="widthFill"
						lazy-load="false"></image>
					<image class="step-cicon" src="/static/images/step/step-compile.png" mode="widthFill"
						lazy-load="false"></image>
					<image class="step-licon" src="/static/images/step/step-line2.png" mode="widthFill"
						lazy-load="false"></image>
					<image class="step-cicon" src="/static/images/step/step-compiling.png" mode="widthFill"
						lazy-load="false"></image>
				</view>
				<view class="step-iconct" v-else>
					<image class="step-cicon" src="/static/images/step/step-compile.png" mode="widthFill"
						lazy-load="false" @tap="navigateToBasic"></image>
					<image class="step-licon" src="/static/images/step/step-line1.png" mode="widthFill"
						lazy-load="false"></image>
					<image class="step-cicon" src="/static/images/step/step-compile.png" mode="widthFill"
						lazy-load="false" @tap="navigateToDisease"></image>
					<image class="step-licon" src="/static/images/step/step-line1.png" mode="widthFill"
						lazy-load="false"></image>
					<image class="step-cicon" src="/static/images/step/step-compiling.png" mode="widthFill"
						lazy-load="false"></image>
				</view>
				<view class="step-introct">
					<text class="step-introd">基本信息</text>
					<text class="step-introd">病史信息</text>
					<text class="step-introd">检测记录</text>
				</view>
			</view>
			<view class="info">
				<view class="header">
					<!-- <view class="picker">
		                    <picker mode="date" fields="month" fields="year" value="{{year}}" start="2018" bindchange="getDateTime">
		                        <view class="selectDate">
		                            {{year}}年
		                            <image src="../../static/image/healthy/calendar-icon.png" />
		                        </view>
		                    </picker>
		                </view> -->
					<view></view>
					<button type="default" class="testing-btn" @tap="navigateToTesting">添加报告</button>
				</view>
				<view class="space-line"></view>
				<view class="main">
					<view v-for="(item,index) in exams" :key="index" index="index" item="item">
						<view class="wrap" @tap="navigateToTestList(item,index)">
							<view class="left">
								<image class="seat-icon" src="/static/images/healthy/seat-icon.png" />
								<text>{{item.template_name}}</text>
							</view>
							<view class="right">{{item.record_at}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="submit">
				<button class="submit-btn" type="primary" @tap="submitHandler">完成</button>
			</view>
		</view>

	</view>
</template>

<script>
	import api from '@/api/api'
	export default {
		data() {
			return {
				userId: '',
				infoId: '',
				year: '2018',
				navClick: false,
				user: null,
				exams: [],
			};
		},
		watch: {

		},
		onLoad(options) {
			this.userId = options.userId
			this.infoId = options.infoId
		},
		onShow() {
			let UserInfo = this.$store.getters.currentUserInfo
			console.log(UserInfo)
			this.navClick = UserInfo.info
			this.user = UserInfo
			this.getexams()
		},
		computed: {

		},
		methods: {
			getexams() {
				if (this.user) {
					const newExams = this.user.exams.map(item => {
						return {
							...item,
							record_at: item.record_at.split(' ')[0]
						}
					})
					this.exams = newExams
				}
			},
			navigateToBasic() {
				uni.navigateTo({
					url: '/pages1/healthy/basic?userId=' + this.userId + '&infoId=' + this.infoId
				});
			},
			navigateToDisease() {
				uni.navigateTo({
					url: '/pages1/healthy/disease?userId=' + this.userId + '&infoId=' + this.infoId
				});
			},
			navigateToTesting() {
				uni.navigateTo({
					url: '/pages1/healthy/testing?userId=' + this.userId + '&infoId=' + this.infoId
				});
			},
			getDateTime(e) {
				// console.log('getDateTime', e);
				this.year = e.detail.value
			},
			navigateToTestList(item) {
				// console.log(e);
				uni.navigateTo({
					url: `/pages1/healthy/testlist?id=${item.id}`
				});
			},
			submitHandler() {
				uni.switchTab({
					url: '/pages/user/people'
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.testrecord {
		flex-grow: 1;
		display: flex;
		flex-direction: column;

		.info {
			flex-grow: 1;
			margin-top: 20rpx;

			.header {
				box-sizing: border-box;
				padding: 26rpx 32rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.picker {
					.selectDate {
						display: flex;
						align-items: center;

						image {
							width: 50rpx;
							height: 50rpx;
							margin-left: 10rpx;
						}
					}
				}

				.testing-btn {
					box-sizing: border-box;
					background: rgba(77, 126, 205, 0.1);
					border-radius: 10rpx;
					border: 1px solid #4D7ECD;
					color: #4D7ECD;
					font-size: 26rpx;
					margin: 0;
				}
			}

			.main {
				.wrap {
					display: flex;
					justify-content: space-between;
					align-items: center;
					box-sizing: border-box;
					padding: 26rpx 32rpx;
					border-bottom: 1px solid #F6F6F6;

					&:active {
						opacity: .2;
					}

					.left {
						display: flex;

						.seat-icon {
							width: 40rpx;
							height: 40rpx;
							margin-right: 28rpx;
						}
					}

					.right {
						color: #9FA0A2;
					}
				}
			}

			.space-line {
				height: 5rpx;
				background: #F6F6F6;
			}
		}

		.submit {
			padding: 90rpx 38rpx 56rpx;

			.submit-btn {
				width: 100%;

			}
		}
	}

	/* step步骤样式 */
	.step {
		border-top: 10rpx solid #f6f6f6;
		border-bottom: 10rpx solid #f6f6f6;
		padding: 83rpx 76rpx 51rpx;
		background-color: #fff;

		.step-iconct {
			position: relative;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 34rpx;

			image.step-cicon {
				width: 50rpx;
				height: 50rpx;

			}

			image.step-licon {
				position: absolute;
				top: 24rpx;
				left: 70rpx;
				width: 460rpx;
				height: 2rpx;
			}
		}

		.step-introct {
			display: flex;
			justify-content: space-between;
			color: #9EBBE5;
			font-size: 30rpx;
			line-height: 42rpx;

			.step-introd {
				color: #4D7ECD;
			}
		}
	}
</style>
