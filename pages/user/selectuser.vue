<template>
	<view>
		<cu-custom :bgColor="NavBarColor" :isBack="true">
			<block slot="content">列表</block>
		</cu-custom>
		<view class="sluser">
			<view v-for="(item,index) in renderArr" :key="index">
				<view class="item " :class="{ 'self':( index === 0 ? true :false)}" @click="choiceHandler(index)">
					<view class="header">
						<view class="intro">
							<view class="name">{{ item.name }}</view>
							<view class="tips">{{ item.title }}</view>
							<view class="gender">{{ item.sex }}</view>
						</view>
						<view class="change" v-if=" index !== 0 " @click.stop="removeHandler(index)">解绑</view>
					</view>
					<view class="cutline"></view>
					<view class="content">
						<view class="birthday">
							<text>出生日期：</text>
							<text>{{ item.birthday }}</text>
						</view>
						<view class="idcard">
							<text>身份证号：</text>
							<text>{{ item.idcard }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="cover" :class="{ 'cover-block':( showCover ? true :false)}">
			<view class="cover-main" :class="{ 'cover-show':( showCover ? true :false)}">
				<view class="cover-tip">解除绑定后信息将不会找回哦～</view>
				<view class="cover-confirm" @tap="confirmHandler">解除绑定</view>
				<view class="cover-cancel" @tap="hideCover">取消</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		unfamily
	} from '@/api/user.js'
	export default {
		data() {
			return {
				renderArr: [], // 当前渲染的项
				nowUser: {}, // 用户的所有数据
				showCover: false, // 弹层
				nowIndex: '', // 当前要删除的索引
				animationData: '',
			};
		},
		watch: {

		},
		onLoad(options) {
			if (options.choice) {
				// 代表点击切换用户按钮进入的
				this.getUserAllInfo();
			} else {
				this.getUserAllInfo();
			}
		},
		methods: {
			//获取用户的所有信息
			async getUserAllInfo() {
				let self = this;
				this.$store.dispatch("getCurrentUserInfo", {
					//token: uni.getStorageSync(ACCESS_TOKEN)
					refresh: true
				}).then((res) => {
					const nowUser = res
					self.renderArr.push({
						name: nowUser.name,
						id: nowUser.id,
						sex: nowUser.sex,
						birthday: nowUser.birthday,
						idcard: nowUser.idcard,
						title: '本人'
					});
					self.nowUser = nowUser;
					self.renderArr.push(...nowUser.family);
				})
			},
			//选择切换用户
			choiceHandler(index) {
				const render = this.renderArr;
				if (index == 0) {
					this.$store.dispatch("setOtherId", 0)
					uni.switchTab({
						url: '/pages/user/people'
					});
				} else {
					this.$store.dispatch("setOtherId", render[index].id)
					uni.switchTab({
						url: '/pages/user/people'
					});
				}
			},
			//解绑
			removeHandler(index) {
				this.nowIndex = index;
				this.showCover = !this.showCover;
			},
			//取消弹窗
			hideCover() {
				this.showCover = !this.showCover;
			},
			//解除绑定
			confirmHandler() {
				const index = this.nowIndex,
					render = this.renderArr,
					delData = {
						id: render[index].id
					};
				this.showCover = !this.showCover;
				unfamily(delData).then(res => {
					render.splice(index, 1);
					this.$tip.success("解绑成功")
				}).catch(err => {
					console.log(err);
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.sluser {
		padding: 24rpx
	}

	.item {
		width: 100%;
		height: 243rpx;
		margin-top: 20rpx;
		border-radius: 6rpx;
		background: $uni-bg-color;
		box-shadow: 0rpx 0rpx 4rpx 1rpx rgba(227, 231, 237, 0.5);

		// &:first-child {
		// 	margin-top: 0;
		// }

		.header {
			display: flex;
			justify-content: space-between;
			font-size: 34rpx;
			padding: 22rpx 27rpx;

			.intro {
				display: flex;
				justify-content: space-between;

				.name {
					margin-right: 16rpx;
				}

				.tips {
					min-width: 80rpx;
					height: 32rpx;
					line-height: 32rpx;
					transform: translateY(-5rpx);
					margin-right: 49rpx;
					font-size: 20rpx;
					border-radius: 15rpx;
					padding: 4rpx;
					box-sizing: border-box;
					text-align: center;
					color: #4D7ECD;
					background: rgba(77, 126, 205, 0.1);
				}
			}

			.change {
				color: #4D7ECD;
			}
		}

		.cutline {
			width: 100%;
			height: 1rpx;
			//background: url('https://oss.schillerchina.com/wx/selectuser-space-line.png') no-repeat;
			background-size: contain;
		}

		.content {
			padding: 20rpx 0 29rpx 27rpx;
			font-size: 30rpx;
			line-height: 42rpx;
			color: #9B9B9B;

			.idcard {
				margin-top: 17rpx;
			}
		}
	}

	.self {
		color: $uni-bg-color;
		background: linear-gradient(135deg, rgba(132, 181, 232, 1) 0%, rgba(77, 126, 205, 1) 100%);

		.header {
			.intro {
				.tips {
					color: #4D7ECD;
					background: $uni-bg-color;
				}
			}

			.change {
				color: $uni-bg-color;
			}
		}

		.content {
			color: $uni-bg-color;
		}
	}

	.cover {
		display: none;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: rgba(0, 0, 0, .5);
		font-size: 32rpx;
		line-height: 45rpx;
		text-align: center;

		.cover-main {
			position: absolute;
			bottom: -316rpx;
			width: 100%;
			background: $uni-bg-color;
			text-align: center;

			.cover-tip {
				padding: 35rpx 0 32rpx 0;
				font-size: 26rpx;
				line-height: 37rpx;
				border-bottom: 2rpx solid rgba(0, 0, 0, .1);
			}

			.cover-confirm {
				padding: 30rpx 0;
				border-bottom: 4rpx solid rgba(0, 0, 0, .1);
				color: #FE785C;
			}

			.cover-cancel {
				padding: 30rpx 0;
			}
		}
	}

	.cover-block {
		display: block;
	}

	.cover-show {
		animation: coverAnimate .2s linear forwards;
	}

	.cover-hide {
		animation: coverAnimate 0.2s linear reverse forwards;
	}

	@keyframes coverAnimate {
		from {
			bottom: -316rpx;
		}

		to {
			bottom: 0;
		}
	}
</style>
