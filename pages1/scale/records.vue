<template>
	<view>
		<cu-custom :bgColor="NavBarColor" :isBack="true">
			<block slot="content">量表测评</block>
		</cu-custom>
		<view class="records">
			<view v-for="(record,index) in records" :key="index">
				<navigator :url="'/pages1/scale/write?id='+id+'&sheets='+record.id" open-type="navigate"
					hover-class="none">
					<view class="item">
						<view class="header">
							<view class="titlect">
								<view class="title">{{record.scale_name}}</view>
								<view class="tag textOverflow" v-if="record.employee_name">{{record.employee_name}}
								</view>
							</view>
							<view class="score">{{record.score_total}}分</view>
						</view>
						<view class="main">
							<text>评语：{{record.comment?record.comment:"无"}}</text>
						</view>
						<view class="lately">
							<text>{{record.record_at}}</text>
						</view>
					</view>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		deepCopy
	} from '@/common/util/tool.js'
	export default {
		data() {
			return {
				index: '', //外层对象进入时的索引 外层第0个跳入的，读取缓存后就展示第0个对象的数据
				id: '', //请求具体一条数据用的最外层id
				detailId: '', //跳转下个页面的id
				recordsData: [],
				records: {}
			}
		},
		onLoad(options) {
			let self = this;
			this.index = options.index;
			console.log(this.$store.getters.currentUserInfo);
			let currentUserInfo = this.$store.getters.currentUserInfo
			let _data = currentUserInfo.scales; //取得所有表类型
			self.id = _data[self.index].id; //取得外层的id
			self.records = _data[self.index].sheets; //第几个类型下的表
		},
		created() {

		},
		watch: {

		},

		methods: {

		}
	}
</script>
<style lang="scss" scoped>
	.records {
		padding-bottom: 30rpx;

		.item {
			position: relative;
			width: 690rpx;
			height: 235rpx;
			margin: 0 auto;
			margin-top: 30rpx;
			background: url('/static/images/item-greybg.png') no-repeat;
			background-size: cover;
			box-shadow: 0px 0px 4px 2px rgba(227, 231, 237, 0.5);

			.header {
				display: flex;
				justify-content: space-between;
				font-size: 34rpx;
				line-height: 48rpx;
				border-bottom: 1px solid #e3e3e3;
				padding: 22rpx 27rpx;


				.titlect {
					display: flex;
					border-bottom: none;
					padding: 0;

					.title {
						margin-right: 19rpx;
						max-width: 300rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.tag {
						background: url('/static/images/tag.png') no-repeat;
						background-size: cover;
						width: 160rpx;
						height: 55rpx;
						text-align: center;
						line-height: 55rpx;
					}

				}

				.score {
					color: #FE785C;
				}
			}

			.main {
				padding: 14rpx 22rpx 14rpx 27rpx;
				font-size: 26rpx;
				line-height: 37rpx;
				color: #909193;

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
	}
</style>
