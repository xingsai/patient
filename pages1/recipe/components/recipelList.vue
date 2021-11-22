<template>
	<view>
		<view class="list" @tap="showDetail(index)">
			<view class="list-header">
				<view class="title-wrap">
					<view class="title">
						<text>{{ act.name !== undefined  ? act.name : drg.drug }}</text>
						<image v-if=" act.records.length " class="image-icon"
							src="/static/images/recipelImg/complete-icon.png" mode="widthFill" lazy-load="false">
						</image>
						<text v-if=" !act.records.length " class="circle-icon"></text>
					</view>
				</view>
				<image src="/static/images/recipelImg/recipel-detail.png" class="list-icon" mode="widthFix"
					lazy-load="false">
				</image>
			</view>
			<!-- type == 1 展示运动处方 -->
			<view class="list-content type-1 "
				:class="{ 'change-list-tips':(  act.acts&& act.acts[0] && act.acts[0].pracs&&act.acts[0].pracs.length > 0? true :false)}"
				v-if="type == 1 ">
				<view v-for="(slip,idx) in act.intro" :key="idx" index="idx" item="slip">
					<view class="list-item">
						<text class="intro">{{ slip.slot }}：</text>
						<text>{{ slip.level }}</text>
					</view>
				</view>
				<view class="list-tips" :class="{ 'has-list-tips':(  act.intro&& act.intro.length > 0? true :false)}"
					v-if=" act.acts&& act.acts[0] && act.acts[0].pracsact.acts[0].pracs.length > 0 ">
					<image class="tips-icon" src="/static/images/recipelImg/motion-tips-icon.png" mode="widthFix"
						lazy-load="false">
					</image>
					<view class="tips-item">
						<view v-for="(pracs,adx) in act.acts[0].pracs " :key="adx" index="adx" item="pracs">
							<view>{{ pracs.level }}</view>
							<block v-if=" !(act.acts[0].pracs.length - 1 === adx)">
								<image class="space-icon" src="/static/images/recipelImg/motion-textsapce-icon.png"
									mode="widthFix" lazy-load="false">
								</image>
							</block>
						</view>
					</view>
				</view>
			</view>
			<!-- type == 2 展示用药计划 -->
			<view class="list-content type-2" v-if=" type == 2 ">
				<view class="list-date">
					<text class="stop-date">停药日期：</text>
					<!-- 先用record_at这个字段对付一下日期，以后正式的字段是'.prac' -->
					<text>{{ drg.record_at }}</text>
				</view>
				<view v-for="(drug,idx) in drg.intro" :key="idx" index="idx" item="drug">
					<view class="list-item" v-if=" idx < 2 ">
						<text>{{ drug.slot }}：</text>
						<text v-if=" drug.level ">{{ drug.level }}</text>
						<text v-if=" !drug.level ">{{ drug.value }}</text>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import api from '@/api/api'
	export default {
		data() {
			return {

			};
		},
		props: {
			type: String,
			index: Number,
			act: {
				type: Object,
				default: function() {
					return {
						records: []
					}
				}
			},
			drg: {
				type: Object,
				default: function() {
					return {}
				}
			}
		},
		mounted() {
			console.log(this.act)
		},
		watch: {

		},
		methods: {
			showDetail(index) {
				wx.navigateTo({
					url: '/pages1/recipe/recipelDetail?type=' + this.type + '&index=' + index
				});
			}

		}
	}
</script>

<style lang="scss" scoped>
	.list {
		width: 100%;
		min-height: 230rpx;
		margin-bottom: 20rpx;
		background: #fff;
		box-shadow: 0rpx 0rpx 4rpx 1rpx rgba(227, 231, 237, 0.5);
		border-radius: 10rpx;
		border: 1rpx solid rgba(227, 231, 237, 1);
		margin-top:20rpx;

		&:last-child {
			margin-bottom: 0;
		}

		.list-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 22rpx 20rpx 15rpx 29rpx;
			border-bottom: 1rpx solid #E3E7ED;
			font-size: 36rpx;
			line-height: 50rpx;

			.title-wrap {

				.title {

					.image-icon {
						margin: 0 0 0 17rpx;
						width: 115rpx;
						height: 40rpx;
					}

					.circle-icon {
						display: inline-block;
						margin: 0 0 0 6rpx;
						transform: translateY(-16rpx);
						width: 10rpx;
						height: 10rpx;
						border-radius: 50%;
						background: rgba(254, 120, 92, 1);
					}
				}

				.tip {
					font-size: 26rpx;
					line-height: 37rpx;
					color: #9B9B9B;
				}
			}

			.list-icon {
				width: 20rpx;
				height: 34rpx;
			}

		}

		.list-content {
			padding: 13rpx 29rpx 28rpx 29rpx;
			font-size: 30rpx;
			line-height: 42rpx;
			color: #9B9B9B;

			// type = 1
			.list-item {
				display: flex;
				justify-content: space-between;
				padding: 0 29rpx;

				.intro {
					display: inline-block;
					min-width: 230rpx;
				}
			}

			.list-tips {
				display: flex;
				align-items: center;
				padding: 13rpx 32rpx 0 32rpx;


				.tips-icon {
					width: 26rpx;
					height: 24rpx;
					margin-right: 13rpx;
				}

				.tips-item {
					display: flex;
					align-items: center;

					.space-icon {
						width: 4rpx;
						height: 4rpx;
						margin: 0 14rpx;
					}
				}
			}

			.has-list-tips {
				margin: 20rpx 0 0 0;
				border-top: 1rpx solid #E3E7ED;
			}

			// type = 2
			.list-date {
				display: flex;
				justify-content: space-between;

				.stop-date {
					display: inline-block;
					margin-right: 5rpx;
				}
			}

			.list-detail {
				display: flex;
				justify-content: space-between;
				margin-top: 16rpx;
			}
		}

		.type-1 {
			padding: 13rpx 0 28rpx 0;
		}

		.type-2 {
			.list-item {
				padding: 0;
			}
		}

		.change-list-tips {
			padding-bottom: 16rpx;
		}
	}
</style>
