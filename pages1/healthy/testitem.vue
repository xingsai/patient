<template>
	<view>
		<cu-custom :bgColor="NavBarColor" :isBack="true">
			<block slot="content">检测详情</block>
		</cu-custom>
		<view class="testitem">
			<view class="row">
				<view class="col">{{itemDetail.practice && itemDetail.practice.comment}}</view>
				<view class="col">{{itemDetail.prac && itemDetail.prac.slot}}</view>
			</view>

			<view class="row"
				v-if="itemDetail.practice && itemDetail.practice.type && itemDetail.practice.type[0] === 'L'">
				<view class="col">
					{{itemDetail.value > 0 ? '阳性' : '阴性'}}
				</view>
			</view>
			<view class="row"
				v-else-if="itemDetail.practice && itemDetail.practice.type && (itemDetail.practice.type[0] === 'S' || itemDetail.practice.type[0] === 'D')">
				<view class="col" v-if="itemDetail.level">
					{{itemDetail.level}}
				</view>
			</view>
			<view class="row" v-else>
				<view class="col col-2">{{itemDetail.value}}</view>
				<view class="col">
					<image class="status-icon" v-if="itemDetail.order > 0"
						src="/static/image/healthy/rise-icon.png"></image>
					<image class="status-icon" v-if="itemDetail.order == -1"
						src="/static/image/healthy/fall-icon.png"></image>
				</view>
				<view class="col">{{itemDetail.practice && itemDetail.practice.unit}}</view>
			</view>

			<view class="row" v-if="itemDetail.practice && itemDetail.practice.fml">
				<view class="col">参考值：{{itemDetail.practice && itemDetail.practice.fml}}</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		getUserPracsInfo
	} from '@/api/health.js'
	export default {
		data() {
			return {
				itemDetail: {},
			};
		},
		watch: {

		},
		onLoad(options) {
			// console.log('options', options);
			const self = this
			getUserPracsInfo(options.id||2121).then(res => {
				const data = res.data
				console.log('data', data);
				self.itemDetail = data
			})
		},
		methods: {
			goto(url) {
				uni.navigateTo({
					url: url
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
	.testitem {
		box-sizing: border-box;
		border-top: 10rpx solid #F6F6F6;
		line-height: 45rpx;
		font-size: 32rpx;

		.status-icon {
			width: 20rpx;
			height: 36rpx;
			transform: translateY(3px);
		}

		.row {
			border-bottom: 1rpx solid #F6F6F6;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.col {
				flex: 1;
				box-sizing: border-box;
				padding: 20rpx;
			}

			.col-2 {
				flex: 2;
			}
		}
	}
</style>
