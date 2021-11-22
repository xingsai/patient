<template>
	<view>
		<cu-custom :bgColor="NavBarColor" :isBack="true">
			<block slot="content">检测记录</block>
		</cu-custom>
		<view class="testlist">
			<view class="header">
				<view class="h">心电检查结论：</view>
				<view class="content " :class="{ 'extend':( heightExtend? true :false)}">
					{{testDetail.comment}}
				</view>
			</view>
			<view class="height-operate" @tap="toggleHeight">
				<image src="/static/images/healthy/height-extend-icon.png" class="height-extend-icon" />
				<text>{{ heightExtend ? '收缩' : '展开'}}</text>
			</view>
			<view class="imgs" v-if="testDetail.storage_at">
				<image :src="testDetail.storage_at?(staticDomainURL+testDetail.storage_at):''" class="img" />
			</view>
			<view class="table" v-if="testDetail.pracs && testDetail.pracs.length">
				<view class="tr flex-between">
					<view class="flex-2"></view>
					<view class="flex-2">项目</view>
					<view class="flex-1">结果</view>
					<view class="flex-1"></view>
					<view class="flex-1">单位</view>
				</view>
				<repeat v-for="(item,index) in testDetail.pracs" :key="index" index="index" item="item">
					<view class="td flex-between" @tap="navigateToTestItem(item,index)">
						<view class="flex-2">{{item.name}}</view>
						<view class="flex-2">{{item.slot}}</view>

						<view class="flex-1" v-if="item.type[0] === 'D' || item.type[0] === 'S'">{{item.level}}</view>
						<view class="flex-1" v-if="item.type[0] === 'L'">
							{{item.value == 0 ? '无' : item.value == 1 ? '阳性' : '阴性'}}
						</view>
						<view class="flex-1" v-else>{{item.value}}</view>
						<view class="flex-1">
							<image class="status-icon" v-if="item.order == 1"
								src="/static/images/healthy/rise-icon.png"></image>
							<image class="status-icon" v-if="item.order == -1"
								src="/static/images/healthy/fall-icon.png"></image>
						</view>
						<view class="flex-1">{{item.unit}}</view>
					</view>
				</repeat>
			</view>
			<view class="table empty-table" v-else>
				<view class="tr flex-between">
					<view class="flex-2"></view>
					<view class="flex-2">项目</view>
					<view class="flex-1">结果</view>
					<view class="flex-1"></view>
					<view class="flex-1">单位</view>
				</view>
				<view class="empty-td">暂无数据...</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getSubmitTemplates
	} from '@/api/health.js'
	export default {
		data() {
			return {
				heightExtend: false,
				testDetail: {},
				staticDomainURL:this.$config.staticDomainURL,
			};
		},
		watch: {

		},
		onLoad(options) {
			// console.log(options);
			const self = this
			getSubmitTemplates(options.id).then(res => {
				const data = res.data
				console.log(data)
				data.pracs && data.pracs.length && data.pracs.reverse()
				const commentIndex = data.pracs.findIndex(i => i.practice_id == 1526)
				let comment = ''
				if (commentIndex > -1) {
					comment = data.pracs[commentIndex].level
					data.pracs.splice(commentIndex, 1)
				}

				self.testDetail = {
					...data,
					comment
				}

			})
		},
		methods: {
			toggleHeight() {
				this.heightExtend = !this.heightExtend
			},
			navigateToTestItem(item) {
				// console.log(e);
				

				if (item.pid) {
					wx.navigateTo({
						url: `/pages1/healthy/testitem?id=${item.pid}`
					});
				} else {
					wx.showToast({
						title: 'pid缺失',
						icon: 'none',
						duration: 2000,
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.flex-between {
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		padding: 26rpx 30rpx;
	}

	.flex-1 {
		flex: 1;
		text-align: center;
		word-wrap: break-word;
		word-break: break-all;
		overflow: hidden;
		// width: 16%;

	}

	.flex-2 {
		flex: 2;
		text-align: center;
		word-wrap: break-word;
		word-break: break-all;
		overflow: hidden;
		// width: 25%;
	}

	.text-center {
		text-align: center;
	}

	.testlist {
		box-sizing: border-box;
		border-top: 10rpx solid #F6F6F6;

		.header {
			box-sizing: border-box;
			padding: 30rpx 20rpx;

			.h {
				height: 45rpx;
				font-size: 32rpx;
				font-weight: bold;
			}

			.content {
				overflow: hidden;
				height: 80rpx;
				transition: .5s all;
			}

			.extend {
				height: 350rpx;
			}
		}

		.height-operate {
			color: #9FA0A2;
			font-size: 26rpx;
			text-align: center;
			box-sizing: border-box;
			padding: 17rpx 0;

			.height-extend-icon {
				width: 22rpx;
				height: 19rpx;
				margin-right: 9rpx;
			}
		}

		.imgs {
			box-sizing: border-box;
			border-top: 10rpx solid #F6F6F6;
			padding: 12rpx 12rpx 0 12rpx;

			.img {
				width: 200rpx;
				height: 200rpx;
			}
		}

		.table {
			box-sizing: border-box;
			border-top: 10rpx solid #F6F6F6;

			.tr {
				border-bottom: 4rpx solid #F6F6F6;
				font-weight: bold;
			}

			.td {
				border-bottom: 1rpx solid #F6F6F6;

				.status-icon {
					width: 20rpx;
					height: 36rpx;
					transform: translateY(3px);
				}
			}
		}

		.empty-table {
			.empty-td {
				text-align: center;
				margin-top: 20rpx;
				opacity: .5;
			}
		}
	}
</style>
