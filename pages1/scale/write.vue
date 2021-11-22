<template>
	<view>
		<cu-custom :bgColor="NavBarColor" :isBack="true">
			<block slot="content">量表测评</block>
		</cu-custom>
		<view class="write" v-if="showPage">
			<view class="filling" v-if="showFill">
				<view class="header">
					<view class="title">
						<text>{{tableData.name}}</text>
					</view>
					<view class="intro">
						<text>{{tableData.desc}}</text>
					</view>
				</view>
				<view class="cutline">
					<view class="line"></view>
				</view>
				<view class="main">
					<form>
						<view class="formct">
							<!-- question.type 单选是1 4 多选是2 -->
							<view v-for="(question,index) in tableData.questions" :key="index">
								<view class="single" v-if="question.type == 1">
									<view class="quest">{{index + 1}}、{{question.content}}</view>
									<view class="answer">
										<radio-group class="radio-group" @change="radioChange(question,index,$event)">
											<view v-for="(item,idx) in question.options" :key="idx">
												<label class="radio" :class="{ 'first':( idx == 0? true :false)}">
													<radio :value="item.inn+''" :checked="item.checked"
														style="transform:scale(0.7)" />
													{{item.content}}
												</label>
											</view>
										</radio-group>
									</view>
								</view>
								<view class="multiple" v-if="question.type == 2">
									<view class="quest">{{index + 1}}、{{question.desc}}</view>
									<view class="answer">
										<checkbox-group class="checkbox-group"
											@change="checkboxChange(question,index,$event)">
											<view v-for="(item,idx) in question.options" :key="idx">
												<label class="checkbox" :class="{ 'first':( idx == 0? true :false)}">
													<checkbox :value="item.inn+''" :checked="item.checked"
														style="transform:scale(0.7)" />
													{{item.content}}
												</label>
											</view>
										</checkbox-group>
									</view>
								</view>
								<view class="input" v-if="question.type == 3">
									<view class="quest" v-if="question.desc != '描述'">{{index + 1}}、{{question.desc}}
									</view>
									<view class="quest" v-if="question.desc == '描述'">{{index + 1}}、{{question.content}}
									</view>
									<view class="answer">
										<input type="number" :value=" question.choice"
											@input="inputChange(question,index,$event)" />
									</view>
								</view>
							</view>

						</view>

						<button v-if="!record" type="primary" :class="{ 'setgrey':( !pass? true :false)}"
							@tap="formSubmit">
							提交
						</button>
					</form>
					<navigator :url="'/pages1/scale/score?id='+id" open-type="navigate" hover-class="none">
						<button v-if="record" type="primary" class="goscore">查看结果</button>
					</navigator>
				</view>
			</view>
			<view class="filldone" v-if="!showFill">
				<image src="/static/images/post-success.png" class="sucimg" mode="widthFix" lazy-load="false">
				</image>
				<navigator :url="'/pages1/scale/score?id='+id" open-type="navigate" hover-class="none">
					<button type="primary" class="goscore">查看结果</button>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getScaleDetail,
		submitScaleDetail,
		getScaleSubmit
	} from "@/api/scale.js"

	import {
		deepCopy
	} from '@/common/util/tool.js'
	export default {
		data() {
			return {
				userId: '', // 
				id: '', // 组件进入的?id=1路径
				sheets: '', // 回显时的第二个参数
				showPage: false, //数据请求完成后变成true 展示页面
				showFill: true,
				tableData: {}, // 渲染的data
				postData: {}, // 填写后的data 上传给后台的，
				pass: false, // 未选完表单不允许发送
				record: false, // 是否为回显状态
			}
		},

		watch: {
			postData: {
				handler() {
					// 验证所有表单是否都有值。都有值才可以请求
					this.pass = this.postData.questions.every((item) => {
						console.log(this.pass)
						if (item.choice[0] == NaN) return false;
						return item.choice.length > 0;
					});
				},
				deep: true
			}
		},
		onLoad(options) {
			console.log(options) // { id: ..., aaa: 2 }
			this.id = options.id;
			if (options.sheets) {
				// 如果url参数有sheets就回显
				this.sheets = options.sheets;
				this.record = true;
				this.getRecords();
			} else {
				// 如果只有id就正常填写
				this.getData();
			}
		},
		methods: {
			//提交填写数据
			formSubmit(e) {
				console.log(this.postData);
				if (!this.pass) return;
				submitScaleDetail({
					data: this.postData,
					userId: this.$store.getters.currentUserInfo.id
				}).then(res => {
					this.showFill = false;
					let _data = res.data;
					uni.setStorage({
						key: 'tableDone',
						data: _data
					})
				}).catch(() => {
					//联网失败, 结束加载
					this.$tip.error('请重试');
				})
			},
			//radio 选择
			radioChange(item, index, e) {
				let _index = index,
					_choice = this.postData.questions[_index].choice;
				if (_choice.length === 0) {
					_choice.push(parseInt(e.detail.value));
				} else {
					_choice.splice(0, 1, parseInt(e.detail.value));
				}
			},
			checkboxChange(item, index, e) {
				let _index = index;
				this.postData.questions[_index].choice = e.detail.value.map(item => parseInt(item));
			},
			inputChange(item, index, e) {
				let _index = index,
					_choice = this.postData.questions[_index].choice;
				if (_choice.length === 0) {
					_choice.push(parseInt(e.detail.value));
				} else {
					_choice.splice(0, 1, parseInt(e.detail.value));
				}
			},
			//获取数据信息
			getData() {
				getScaleDetail(this.id).then(res => {
					let _data = res.data;
					for (let i = 0; i < _data.questions.length; i++) {
						_data.questions[i]['choice'] = [];
					}
					this.tableData = _data;
					this.postData = deepCopy(this.tableData);
					this.showPage = true;
				}).catch((err) => {
					console.log(err)
					//联网失败, 结束加载
					this.$tip.error('请重试');
				})
			},
			//数据回显 加载记录
			getRecords() {
				getScaleSubmit({
					id: this.id,
					sheets: this.sheets
				}).then(res => {
					let _data = res.data,
						_quest = _data.questions;
					// 遍历，对choice项 添加checked选中状态
					for (let i = 0; i < _quest.length; i++) { //遍历外层 得到question
						if (_quest[i].type == 301 || _quest[i].type == 3 || _quest[i].type == 0) {
							continue;
						} else if (_quest[i].choice.length != 0) {
							for (let o = 0; o < _quest[i].choice.length; o++) { //遍历choice，
								let choice = _quest[i].choice[o];
								for (let j = 0; j < _quest[i].options
									.length; j++) { //遍历question的选项列表的 choice项
									let option = _quest[i].options;
									option[choice].checked = true;
								}
							}
						}
					}
					console.log(_data);
					this.tableData = _data;
					uni.setStorage({
						key: 'tableDone',
						data: _data
					})
					this.showPage = true;
					this.pass = true;
				}).catch((err) => {
					console.log(err)
					//联网失败, 结束加载

				})
			}

		}
	}
</script>
<style lang="scss" scoped>
	.write {
		// padding-bottom: 85rpx;
		flex-grow: 1;
		display: flex;
		flex-direction: column;

		&::before {
			display: block;
			content: '';
			width: 100%;
			height: 2rpx;
			background: #e3e3e3;
		}

		.filling {
			.header {
				padding: 42rpx 35rpx 27rpx;

				.title {
					text-align: center;
					font-size: 34rpx;
					line-height: 48rpx;
					color: $uni-color-primary;
				}

				.intro {
					font-size: 26rpx;
					line-height: 37rpx;
					color: $uni-text-color-grey;
					margin-top: 15rpx;
				}
			}

			.cutline {
				padding: 0 15rpx;

				.line {
					border: 1rpx dashed $uni-text-color-grey;
				}
			}

			.main {
				padding: 33rpx 35rpx 55rpx;

				.formct {
					min-height: 758rpx;

					.quest {
						font-size: 30rpx;
					}

					.answer {
						padding: 43rpx 45rpx 53rpx;

						input {
							background: #EFEFEF;
							border: 1rpx solid #dcdfe6;
							border-radius: 4rpx;
							padding: 0 30rpx;
						}
					}
				}


				.submit {
					margin-top: 52rpx;
					width: 650rpx;
					height: 90rpx;
				}

				.setgrey {
					background: #e3e3e3;
					color: #4A4A4A;
				}
			}

			.footer {
				.scorebtn {
					width: 650rpx;
					height: 90rpx;
					font-size: 32rpx;
				}

				.setgrey {
					background: #e3e3e3;
					color: #4A4A4A;
				}
			}
		}


		.filldone {
			flex-grow: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding: 50rpx 50rpx 80rpx 50rpx;

			.sucimg {
				width: 124rpx;
				height: 180rpx;
				margin: auto;
				margin-top: 172rpx;
			}

			.goscore {
				margin-top: 610rpx;
				width: 650rpx;
				height: 90rpx;
				line-height: 90rpx;
				font-size: 32rpx;
			}
		}
	}
</style>
