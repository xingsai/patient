<template>
	<view>
		<cu-custom :bgColor="NavBarColor" :isBack="true">
			<block slot="content">营养计划</block>
		</cu-custom>
		<view class="nutrition">
			<view class="header">
				<view class="summary " :class="{ 'tinder-bg':( nowUnit == 2 ? true :false)}">
					<view class="tab">
						<text :class="{ 'deep-font':( nowUnit == 2 ? true :false)}"  @tap="unitChange(2)">交换份</text>
						<text class="space">|</text>
						<text :class="{ 'deep-font':(nowUnit == 1 ? true :false)}"  @tap="unitChange(1)">卡路里</text>
					</view>
					<view class="total">
						<block v-if=" nowUnit == 1 ">
							<text class="value">{{ exChangeNum }}</text>
							<text>交换份</text>
						</block>
						<block v-else>
							<text class="value">{{ nutrition.rate }}</text>
							<text>Kcal</text>
						</block>
					</view>
					<view class="info deep-font">
						<block v-if="weight">
							<view class="detail">
								<text>身高：</text>
								<text>{{ height }}cm</text>
							</view>
							<view class="detail">
								<text>体重：</text>
								<text>{{ weight }}公斤</text>
							</view>
							<view class="detail">
								<text>BMI：</text>
								<text>{{ bmi }}</text>
							</view>
						</block>
					</view>
				</view>
			</view>
			<view class="content content-color ">
				<view class="guild">
					<view class="food " :class="{ 'item-select':( nowFood == 1 ? true :false)}" @tap="foodChange"
						data-index="1">推荐食物</view>
					<view class="food " :class="{ 'item-select':(nowFood == 2 ? true :false)}" @tap="foodChange"
						data-index="2">禁忌食物</view>
				</view>
				<view class="menu "
					:class="{ 'menu-flex':(allowFoods.length > 0 || allowFoods.length > 0 ? false :true)}">
					<block v-if="nowFood == 1">
						<view v-for="(item,index) in allowFoods " :key="index" :index="index">
							<navigator :url="'/pages1/recipe/nutriDetail?type=1&index='+ index " open-type="navigate"
								hover-class="none">
								<view class="list">
									<view class="left">
										<view class="name">{{ item.name }}</view>
										<view class="unit">
											<view v-if=" nowUnit == 1 " class="msg"><text
													class="stress">{{ item.exchange }}</text>g/交换份</view>
											<view v-if=" nowUnit == 2 " class="msg"><text
													class="stress">{{ item.calories }}</text>千卡/100g</view>
										</view>
									</view>
									<view class="right">
										<view class="percent">{{ item.rate }}</view>
										<view class="length green-slip">
											<image class="per-icon" :style="{width:  item.percent +'%'}"
												src="/static/images/recipelImg/green-percent-icon.png" mode="scaleToFill"
												lazy-load="false">
											</image>
										</view>
										<view class="ratings">推荐指数</view>
									</view>
								</view>
							</navigator>
						</view>
						<view v-if=" allowFoods.length === 0 " class="menu-empty">
							<text style="margin-top:30rpx">暂时无记录</text>
						</view>
					</block>
					<block v-if="nowFood == 2">
						<view v-for="(item,index) in avoidFoods" :key="index">
							<navigator :url="'/pages1/recipe/nutriDetail?type=2&index='+ index " open-type="navigate"
								hover-class="none">
								<view class="list red-list">
									<view class="left">
										<view class="name red-name">{{ item.name }}</view>
									</view>
									<view class="right">
										<view class="percent red-percent">{{ item.rate }}</view>
										<view class="length red-slip">
											<image class="per-icon" :style="{width:  item.percent +'%'}"
												src="/static/images/recipelImg/red-percent-icon.png" mode="scaleToFill"
												lazy-load="false">
											</image>
										</view>
										<view class="ratings">禁忌指数</view>
									</view>
								</view>
							</navigator>
						</view>
						<view v-if="avoidFoods.length === 0 " class="menu-empty">
							<text style="margin-top:30rpx">暂时无记录</text>
						</view>
					</block>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nowFood: 1, // 当前的选择的食物 1代表推荐 2代表禁忌
				nowUnit: 1, // 当前选择的单位 1代表交换份 2代表卡路里
				nutrition: {},
				allowFoods: [],
				avoidFoods: [],
				exChangeNum: '',
				height: '',
				weight: '',
				bmi: '',
			}
		},
		created() {
			let self=this
			//获取信息
			let UserInfo = this.$store.getters.currentUserInfo
			console.log(UserInfo)
			//this.getsiteInfo(true)
			const nutrition = UserInfo.nutrition,
				Foods = UserInfo.foods, // 卡路里数组
				allowFoods = [], // 推荐食物
				avoidFoods = [], // 禁忌食物
				height = UserInfo.height, // 身高
				weight = UserInfo.weight; // 体重
			console.log(nutrition)
			console.log(Foods)

			/**
			 * @todo 1.分组推荐食物数组和禁忌食物数组
			 * @todo 2.对每项添加交换份字段
			 * @todo 3.添加控制条形图宽度的字段
			 */
			Foods.forEach(item => {
				// 对每项添加交换份字段
				// item.exchange = Math.round(item.calories / 90);
				item.exchange = Math.round(100 * 90 / item.calories);

				// 添加控制宽度字段
				item.percent = Math.abs(item.rate / 10 * 100);

				// 分组
				if (item.rate > 0) {
					allowFoods.push(item);
				} else {
					avoidFoods.push(item);
				}
			});
			// console.log(allowFoods)
			// console.log(avoidFoods)

			// 存缓存，用于在详情页读取
			const foodsData = {
				allowFoods,
				avoidFoods
			}
			uni.setStorage({
				key: 'foods',
				data: foodsData
			});

			// 渲染默认单位交换份列表
			self.nutrition = nutrition[0];
			self.allowFoods = allowFoods;
			self.avoidFoods = avoidFoods;
			self.height = height;
			self.weight = weight;
			// 处理交换份标题数值
			if (nutrition.length !== 0) {
				self.exChangeNum = Math.abs(90 / nutrition[0].rate);
			} else {
				// 如果什么也没返 默认展示0
				self.nutrition = {
					rate: 0
				};
				self.exChangeNum = 0;
			}
			// 处理bmi比率
			self.bmi = (weight / (height * height) * 10000).toFixed(1);
		},
		methods: {
			unitChange(e) {
				if (this.nowUnit === 1&&e==1) {
					this.nowUnit = 2;
				} else if (this.nowUnit === 2&&e==2) {
					this.nowUnit = 1;
				}
			},
			foodChange(e) {
				console.log(e)
				let index = e.currentTarget.dataset.index;
				this.nowFood = index;
			}
		}
	}
</script>
<style lang="scss" scoped>
	// 控制样式部分
	.deep-font {
		color: rgba(255, 255, 255, 0.6);
	}

	.unit-select {
		color: rgba(255, 255, 255, 1);
	}

	.item-select {
		color: $uni-color-primary;
		border-bottom: 2rpx solid $uni-color-primary;
	}

	.content-color {
		background: #fff;
	}

	// 结束

	.nutrition {
		flex-grow: 1; // 自身成长到撑满容器
		display: flex;
		flex-direction: column;
		padding-top:24rpx;

		.header {
			padding: 0 29rpx 30rpx 29rpx;
			background: #fff;

			.summary {
				overflow: hidden; // 生成BFC，避免子元素margin-top在容器外
				width: 100%;
				height: 300rpx;
				box-shadow: 0rpx 0rpx 4rpx 2rpx rgba(221, 221, 221, 1);
				border-radius: 10rpx;
				background: url('/static/images/recipelImg/cup-bg.png') no-repeat;
				background-size: cover;
				font-size: 26rpx;
				line-height: 37rpx;
				color: rgba(255, 255, 255, 1);

				.tab {
					margin: 25rpx auto 0 491rpx;

					.space {
						display: inline-block;
						margin: 0 8rpx;
					}
				}

				.total {
					margin: 50rpx 0 0 0;
					display: flex;
					justify-content: center;
					align-items: baseline;

					.value {
						display: inline-block;
						margin-right: 6rpx;
						font-size: 70rpx;
						line-height: 98rpx;
					}
				}

				.info {
					display: flex;
					justify-content: space-around;
					margin: 26rpx 0 0 0;
				}
			}

			// 切换卡路里
			.tinder-bg {
				background: url('/static/images/recipelImg/tinder-bg.png') no-repeat;
				background-size: cover;
			}
		}

		.content {
			width: 100%;
			margin-top: 15rpx;
			flex-grow: 1; // 自身成长到撑满容器剩余部分
			display: flex;
			flex-direction: column;

			.guild {
				display: flex;
				width: 100%;
				margin-top: 15rpx;
				background: #fff;

				.food {
					width: 50%;
					padding: 24rpx 0 30rpx 0;
					text-align: center;
				}
			}

			.no-records {
				position: absolute;
				bottom: 36%;
				left: 41%;
				color: #9B9B9B;
				font-size: 26rpx;
			}

			.menu {
				flex-grow: 1;
				display: flex;
				flex-direction: column;

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

							.msg {
								display: inline-block;

								.stress {
									color: $uni-color-primary;
								}
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

				.red-list {
					align-items: center;
				}
			}

			.menu-flex {
				display: flex;
			}

			.menu-empty {
				flex-grow: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				text-align: center;
				background: #F2F2F3;
				color: #9B9B9B;
			}
		}
	}
</style>
