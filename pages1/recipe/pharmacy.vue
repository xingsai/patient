<template>
	<view>
		<cu-custom :bgColor="NavBarColor" :isBack="true" >
			<block slot="content">用药计划</block>
		</cu-custom>
		<view class="pharmacy">
			<view v-for="(item,index) in drgs " :key="index" index="index" item="item">
				<recipelList type="2" :index="index" :drg="item"></recipelList>
			</view>
			<view v-if=" drgs.length === 0 " class="empty">
				<no-info :msgText="'暂时无记录'"></no-info>
			</view>
		</view>
	</view>
</template>

<script>
	import recipelList from './components/recipelList'
	export default {
		data() {
			return {
				drgs: [], // 用药计划列表数组
			}
		},
		created() {

		},
		components: {
			recipelList
		},
		onLoad() {
			this.getData();
		},
		methods: {
			getData() {
				const self = this;
				const drgs =this.$store.getters.currentUserInfo.drgs;			
				// 如果pracs长度大于3，就切成3。由此递推
				drgs.forEach(item => {
					const pracs = item.pracs.length;
					if (pracs == 3 || pracs > 3) {
						item.intro = item.pracs.slice(0, 3);
					}
					if (pracs == 2) {
						item.intro = item.pracs.slice(0, 2);
					} else if (pracs == 1) {
						item.intro = item.pracs.slice(0, 1);
					} else if (pracs == 0) {
						item.intro = [];
					}
				})
				console.log(drgs);
				// 更新视图数据
				this.drgs = drgs;
				// 存缓存用于在recipelDetail页面中读取
				wx.setStorage({
					key: 'drgsList',
					data: drgs
				});
			}

		}
	}
</script>
<style lang="scss" scoped>
	.pharmacy {
		padding: 20rpx 30rpx;

		// .empty {
		// 	// padding: 292rpx 214rpx 0 214rpx;
		// 	margin-top: 350rpx;

		// 	.empty-image {
		// 		margin: auto;
		// 		width: 322rpx;
		// 		height: 183rpx;
		// 		background: url('https://oss.schillerchina.com/wx/motion-empty.png') no-repeat;
		// 		background-size: cover;
		// 	}

		// 	.text {
		// 		margin: 0 auto;
		// 		margin-top: 35rpx;
		// 		font-size: 26rpx;
		// 		line-height: 37rpx;
		// 		text-align: center;
		// 		color: #9B9B9B;
		// 	}
		// }
	}
</style>
