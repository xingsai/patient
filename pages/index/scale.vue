<template>
	<view class="scale wrap" v-if="flagTitle">
		<cu-custom :bgColor="NavBarColor" :isBack="false" backRouterName="index">
			<block slot="content">测评列表</block>
		</cu-custom>
		<view class="main" v-if="newsData.length">
			<view v-for="(news,index) in newsData" :key="index">
				<navigator :url="'/pages1/scale/write?id='+news.id" open-type="navigate" hover-class="none">
					<view class="item " :class="{ 'colorbg':( news.sheets.length === 0? true :false)}">
						<view class="titlect header">
							<view class="title" :class="{ 'blue':( news.sheets.length === 0? true :false)}">
								{{news.name}}
							</view>
							<view class="alert" v-if="news.sheets.length === 0"></view>
							<view class="times" @tap.stop="gorecords(news,index)">
								<image class="timesbg" v-if="news.sheets.length === 0"
									src="/static/images/orange-times.png" mode="widthFix" lazy-load="false">
								</image>
								<image class="timesbg" v-if="news.sheets.length !== 0"
									src="/static/images/blue-times.png" mode="widthFix" lazy-load="false">
								</image>
								<text>{{news.sheets.length}}次</text>
							</view>
						</view>
						<view class="content">
							<text>{{news.desc}}</text>
						</view>
						<view class="lately">
							<text>{{news.lately}}</text>
						</view>
					</view>
				</navigator>
			</view>
		</view>
		<view v-else>
			<no-info :msgText="'暂无记录'"></no-info>
		</view>
	</view>
</template>
<script>
	import {
		debounce
	} from "@/common/util/tool.js"
	import {
		getScaleList
	} from "@/api/scale.js"
	export default {
		data() {
			return {
				id: '',
				index: '',
				newsData: [],
				flagTitle: false,
				searchInfo: '', //搜索信息
			}
		},
		onShow() {
			// 请求-量表清单
			this.getList();
		},
		computed: {
			style() {
				var StatusBar = this.StatusBar;
				var CustomBar = this.CustomBar;
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				return style
			},
		},
		onLoad: function() {
			this.flagTitle = true
		},
		methods: {
			//进入详情页面
			gorecords(item, index) {
				this.index = index;
				let times = item.sheets.length;
				if (times == 0) return;
				wx.navigateTo({
					url: '/pages1/scale/records?index=' + this.index
				});
			},

			//获取缓则列表信息
			getList(page) {

				getScaleList(this.$store.getters.currentUserInfo.id).then(res => {
					this.newsData = res.data;
				}).catch(() => {
					//联网失败, 结束加载

				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.scale {
		image {
			width: 64rpx;
			height: 70rpx;
		}

		.main {
			padding-bottom: 34rpx;

			.item {
				position: relative;
				width: 690rpx;
				height: 235rpx;
				margin: 0 auto;
				margin-top: 30rpx;
				background-color: #fff;
				background: url('/static/images/item-greybg.png') no-repeat;
				background-size: cover;
				box-shadow: 0px 0px 4px 2px rgba(227, 231, 237, 0.5);

				.titlect {
					padding: 22rpx 27rpx;
					border-bottom: 1px solid #E3E7ED;
				}

				.header {
					display: flex;

					.title {
						// 控制文字在两行以内
						max-width: 350rpx;
						overflow: hidden;
						align-items: center;
						font-size: 34rpx;
						line-height: 48rpx;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.alert {
						width: 10rpx;
						height: 10rpx;
						border-radius: 50%;
						background: #fe785c;
						margin-left: 4rpx;
						margin-top: 15rpx;
					}

					.times {
						position: absolute;
						top: 0rpx;
						right: 68rpx;
						z-index: 1;
						width: 64rpx;
						height: 70rpx;
						font-size: 24rpx;
						line-height: 33rpx;
						color: $uni-bg-color;

						&>text {
							position: absolute;
							top: 15rpx;
							right: 0;
							bottom: 0;
							left: 0;
							z-index: 2;
							margin: auto;
							text-align: center;
							white-space: nowrap;
						}
					}
				}

				.content {
					padding: 14rpx 22rpx 14rpx 27rpx;
					font-size: 26rpx;
					line-height: 37rpx;

					text {
						// 控制文字在两行以内
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}
				}

				.lately {
					position: absolute;
					bottom: 13rpx;
					right: 19rpx;
					font-size: 20rpx;
					line-height: 28rpx;
				}
			}

			.colorbg {
				background: url('/static/images/item-colorbg.png') no-repeat;
				background-size: cover;
			}
		}
	}
</style>
