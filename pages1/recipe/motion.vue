<template>
	<view>
		<cu-custom :bgColor="NavBarColor" :isBack="true">
			<block slot="content">运动处方</block>
		</cu-custom>
		<view class="motion">
			<view class="nav">
				<view class="nav-item" :class="{ 'nav-select':( nowIdx == 0 ? true :false)}" @tap="getList('0')">
					<text class="">准备运动</text>
				</view>
				<image src="/static/images/recipelImg/sport-recipel-icon.png" class="nav-icon" mode="widthFill"
					lazy-load="false">
				</image>
				<view class="nav-item" :class="{ 'nav-select':( nowIdx == 1? true :false)}" @tap="getList('1')">
					<text class="">有氧运动</text>
				</view>
				<image src="/static/images/recipelImg/sport-recipel-icon.png" class="nav-icon" mode="widthFill"
					lazy-load="false">
				</image>
				<view class="nav-item" :class="{ 'nav-select':( nowIdx ==2 ? true :false)}" @tap="getList('2')">
					<text class="">阻抗运动</text>
				</view>
				<image src="/static/images/recipelImg/sport-recipel-icon.png" class="nav-icon" mode="widthFill"
					lazy-load="false">
				</image>
				<view class="nav-item" :class="{ 'nav-select':( nowIdx == 3 ? true :false)}" @tap="getList('3')">
					<text class="">整理运动</text>
				</view>
			</view>
			<view class="content">
				<view v-for="(item,index) in actsList" :key="index">
					<recipelList :type="'1'" :index="index" :act="item"></recipelList>
				</view>
				<view v-if="actsList.length === 0">
					<no-info :msgText="'暂无记录'"></no-info>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import recipelList from './components/recipelList'

	export default {
		data() {
			return {
				nowIdx: 0, // 当前点击的索引
				actsSort: {}, // 排序后的actSort
				actsList: [], // 具体要渲染的列表
			}
		},
		components: {
			recipelList
		},
		created() {
			
		},
		onShow() {
			//获取站点信息
			this.getData(true)
		},
		methods: {
			getList(index) {

				this.nowIdx = index; // 控制nav当前下滑块样式
				this.actsList = this.actsSort[+index + 1]; // 取得当前nav下的数组 用于渲染列表

				// 处理用于详情页数据
				const _data = {},
					_type = +index + 1;
				switch (_type) {
					case 1:
						_data.type = '准备运动'
						break;
					case 2:
						_data.type = '有氧运动'
						break;
					case 3:
						_data.type = '阻抗运动'
						break;
					case 4:
						_data.type = '整理运动'
						break;

				}
				_data.actsList = this.actsList;
				uni.setStorage({ // 存入缓存，用于在详情页获取
					key: 'actsList',
					data: _data
				});

				console.log(this.actsList)
			},
			//获取站点信息
			async getData(flag) {
				let data = this.$store.getters.currentUserInfo
				let acts = data.acts,
					sortObj = {};
				// 添加默认介绍信息，默认展示3项
				acts.forEach(item => {
					const pracs = item.pracs.length;
					if (pracs == 3 || pracs > 3) {
						item.intro = item.pracs.slice(0, 3);
					} else if (pracs == 2) {
						item.intro = item.pracs.slice(0, 2);
					} else if (pracs == 1) {
						item.intro = item.pracs.slice(0, 1);
					} else if (pracs == 0) {
						item.intro = [];
					}

				})

				// 如果sortObj没有这个属性就创建，否则直接推入
				if (acts.length == 0) {
					// 如果返回一个空数组，就手动对列表排序成4个数组用于渲染
					sortObj = {
						1: [],
						2: [],
						3: [],
						4: []
					}
				} else {
					acts.forEach(item => {
						if (!sortObj.hasOwnProperty(item.phase_id)) {
							sortObj[item.phase_id] = [];
							sortObj[item.phase_id].push(item);
						} else {
							sortObj[item.phase_id].push(item);
						}
					});
				}

				// 防止切换空项报错操作
				const range = [1, 2, 3, 4];
				for (let i = 1; i < range.length + 1; i++) {
					const index = range[i];
					Object.keys(sortObj).forEach((key, index) => {
						if (!sortObj.hasOwnProperty(i)) {
							sortObj[i] = [];
						}
					});
				}

				// 展示当前页面的默认列表
				this.actsSort = sortObj;
			//	this.actsList = this.actsSort[(this.nowIdx+1)]; // 存在对象中 1 是默认属性

				// 设置数据
		        this.getList(this.nowIdx)


			},


		}
	}
</script>
<style lang="scss" scoped>
	.motion {

		.nav {
			display: flex;
			align-items: center;
			padding: 21rpx 0 0 50rpx;
			background: $uni-bg-color;
			font-size: 28rpx;
			line-height: 40rpx;

			.nav-item {
				display: flex;
				align-items: center;
				padding: 0 0 29rpx 0;
				white-space: nowrap;
			}

			.nav-icon {
				width: 15rpx;
				height: 14rpx;
				margin: 0 24rpx 29rpx 29rpx;
			}

			.nav-select {
				color: $uni-color-primary;
				border-bottom: 2rpx solid $uni-color-primary;
			}
		}

		.content {
			padding: 30rpx;
		}
	}
</style>
