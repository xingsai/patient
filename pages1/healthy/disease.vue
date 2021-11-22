<template>
	<view>
		<!-- 病史信息 -->
		<cu-custom :bgColor="NavBarColor" :isBack="true">
			<block slot="content">健康档案</block>
		</cu-custom>
		<view class="disease">
			<view class="step">
				<view class="step-iconct" v-if="!navClick">
					<image class="step-cicon" src="/static/images/step/step-compile.png" mode="widthFill"
						lazy-load="false"></image>
					<image class="step-licon" src="/static/images/step/step-line2.png" mode="widthFill"
						lazy-load="false"></image>
					<image class="step-cicon" src="/static/images/step/step-compiling.png" mode="widthFill"
						lazy-load="false"></image>
					<image class="step-licon" src="/static/images/step/step-line2.png" mode="widthFill"
						lazy-load="false"></image>
					<image class="step-cicon" src="/static/images/step/step-compiling.png" mode="widthFill"
						lazy-load="false"></image>
				</view>
				<view class="step-iconct" v-else>
					<image class="step-cicon" src="/static/images/step/step-compile.png" mode="widthFill"
						lazy-load="false" @tap="navigateToBasic"></image>
					<image class="step-licon" src="/static/images/step/step-line1.png" mode="widthFill"
						lazy-load="false"></image>
					<image class="step-cicon mg-row-5" src="/static/images/step/step-compiling.png" mode="widthFill"
						lazy-load="false"></image>
					<image class="step-licon" src="/static/images/step/step-line1.png" mode="widthFill"
						lazy-load="false"></image>
					<image class="step-cicon" src="/static/images/step/step-compile.png" mode="widthFill"
						lazy-load="false" @tap="navigateToTestRecord"></image>
				</view>
				<view class="step-introct">
					<text class="step-introd">基本信息</text>
					<text class="step-introd">病史信息</text>
					<text class="step-introd">检测记录</text>
				</view>
			</view>
			<view class="info">
				<!-- 1.先循环外层的病史类型 -->
				<view v-for="(item,index) in  tempsArr " :key="index" index="index" item="item">
					<view class="section">
						<view class="title-ct common-linebox">
							<view class="name-ct">

								<text>{{ item.name }}</text>
							</view>
							<text class="confirm-btn" @tap="editHandler(item,index)"
								v-if=" !item.checkObj.isCheck ">编辑</text>
							<view class="confirm-btn" v-if=" item.checkObj.isCheck ">
								<text class="confirm-btn" @tap="saveCancel(item,index)">取消</text>
								<text class="confirm-btn"  style="margin-left:20rpx;" @tap="saveHandler(item,index)">保存</text>
							</view>
						</view>

						<view class="edit-ct common-linebox" v-if=" editIndex === index ">
							<view v-for="(prac,idx) in  item.practices " :key="idx" index="idx" item="prac">

								<view class="line-one" v-if="prac.meta_code_id != null ">
									<picker :value="prac.selected.value " range-key="name"
										@change="bindPickerChange(index,idx,$event)" :range=" prac.meta.range ">
										<view class="picker">
											<text
												v-if=" prac.selected.value === ''">{{ prac.slot }}:</text>{{ prac.selected.name }}
										</view>
									</picker>
								</view>
								<view class="line-one" v-else-if="prac.type === 'DT' || prac.type[0] === 'D' ">
									<picker mode="date" class="picker-date" :value="prac.selected.value "
										@change="bindDateChange(index,idx,$event)">
										<view class="date-intro">
											<text
												v-if=" prac.selected.value === ''">{{ prac.slot }}:</text>{{ prac.selected.value }}
										</view>
									</picker>
								</view>

								<view class="input-ct line-one" v-else-if=" prac.type[0] == 'S' ">
									<text v-if=" prac.selected.value === ''">{{ prac.slot }}：</text>
									<!-- :type="practice.type == 'S1' ? 'textarea' : 'text'" -->
									<textarea style="width:380rpx" v-if="prac.type == 'S1'"
										:value=" prac.selected.value " @blur="bindChange(index,idx,$event)" />
									<input v-if="prac.type !== 'S1'" :value=" prac.selected.value "
										@blur="bindChange(index,idx,$event)" />
								</view>
								<view class="line-one" v-else-if="prac.type[0] == 'L'">
									<switch v-model="prac.value" />
								</view>

							</view>
						</view>

						<view class="content-ct">
							<view class="record" v-if=" item.renderArr.length === 0 ">
								<view class="record-none" :class="{ 'opacity-0':( editIndex === index? true :false)}"
									v-if="!recordsObj[item.id] ">无</view>
							</view>
							<view class="record" v-if="item.renderArr.length !== 0">
								<block v-if=" item.id === 33 || item.id === 37 ">
									<view v-for="(render,rdx) in  item.renderArr " :key="rdx" index="rdx" item="render">
										<view
											:class="{ 'slideInRight':(  render[0].removeSwitch? true :false),'slideOutRight':(  render[0].closeSwitch? true :false)}"
											class="record-article ">
											<view class="render-ct">
												<view class="render-section">
													<image v-if=" item.checkObj.isCheck " class="btn-icon"
														@tap="triggerRemove(index,rdx)"
														src="/static/images/step/remove-icon.png" mode="widthFix"
														lazy-load="false">
													</image>
													<view class="render-item grow-1" @touchstart="touchStart"
														@touchend="touchEnd" :data-index="index" :data-rdx="rdx">
														<text>{{ render[0].selected.name }}</text>
														<block v-if="item.id !== 37 ">
															<text>{{ render[1].selected.value }}</text>
														</block>
														<block v-if=" item.id === 37 ">
															<text>{{ render[1].selected.name }}</text>
														</block>
													</view>
												</view>
											</view>
											<view v-if=" item.checkObj.isCheck " class="render-right"
												@tap="removeItem(index,rdx)">
												<text>删除</text>
											</view>
										</view>
									</view>
								</block>
								<block v-else-if=" item.id === 38 ">
									<view v-for="(render,rdx) in  item.renderArr " :key="rdx" index="rdx" item="render">
										<view
											:class="{ 'slideInRight':(  render[0].removeSwitch? true :false),'slideOutRight':(  render[0].closeSwitch? true :false)}"
											class="record-article  ">
											<view class="render-ct">
												<view class="render-section">
													<image v-if=" item.checkObj.isCheck " class="btn-icon"
														@tap="triggerRemove(index,rdx)"
														src="/static/images/step/remove-icon.png" mode="widthFix"
														lazy-load="false">
													</image>
													<view class="render-item grow-1" @touchstart="touchStart"
														@touchend="touchEnd" :data-index="index" :data-rdx="rdx">
														<text>{{ render[1].selected.name }}</text>
														<text>{{ render[2].selected.value }}</text>
													</view>
												</view>
											</view>
											<view v-if=" item.checkObj.isCheck" class="render-right"
												@tap="removeItem(index,rdx)">
												<text>删除</text>
											</view>
										</view>
									</view>
								</block>

								<block v-else>

									<view v-for="(render,rdx) in  item.renderArr " :key="rdx" index="rdx" item="render">
										<view
											:class="{ 'slideInRight':(  render[0].removeSwitch? true :false),'slideOutRight':(  render[0].closeSwitch? true :false)}"
											class="record-article ">
											<view class="render-ct">
												<view class="render-section">
													<image v-if=" item.checkObj.isCheck " class="btn-icon"
														@tap="triggerRemove(index,rdx)"
														src="/static/images/step/remove-icon.png" mode="widthFix"
														lazy-load="false">
													</image>
													<view class="render-item grow-1" @touchstart="touchStart"
														@touchend="touchEnd" :data-index="index" :data-rdx="rdx">
														<text>{{ render[0].selected.value }}</text>
														<text>{{ render[1].selected.value }}</text>

													</view>
												</view>
											</view>
											<view v-if=" item.checkObj.isCheck " class="render-right"
												@tap="removeItem(index,rdx)">
												<text>删除</text>
											</view>
										</view>
									</view>
								</block>
							</view>

							<!-- 渲染回显记录 -->
							<block v-if=" item.id == 33 ">
								<view v-for="(record,recidx) in recordsObj['33']" :key="recidx" index="recidx"
									item="record">
									<view
										:class="{ 'slideInRight':( record.removeSwitch? true :false),'slideOutRight':(record.closeSwitch? true :false)}"
										class="record echo">
										<image class="btn-icon" v-if=" item.checkObj.isCheck "
											@tap="triggerRecord(item.id,recidx)"
											src="/static/images/step/remove-icon.png" mode="widthFix" lazy-load="false">
										</image>
										<view class="render-ct record-back" @touchstart="touchStart"
											@touchend="touchEndEcho" :data-index="index" :data-itemid="item.id"
											:data-recidx="recidx">
											<view class="records-item">
												<text>{{ record.pracs[1].level }}</text>
											</view>
											<view>
												<text>{{ record.pracs[0].level }}</text>
											</view>
										</view>
										<view v-if=" item.checkObj.isCheck" class="render-right record-delete"
											@tap="removeRecord(item.id,recidx)">
											<text>删除</text>
										</view>
									</view>
								</view>
							</block>
							<block v-if=" item.id === 34 ">
								<view v-for="(record,recidx) in recordsObj['34']" :key="recidx" index="recidx"
									item="record">
									<view
										:class="{ 'slideInRight':( record.removeSwitch? true :false),'slideOutRight':(record.closeSwitch? true :false)}"
										class="record echo">
										<image class="btn-icon" v-if=" item.checkObj.isCheck "
											@tap="triggerRecord(item.id,recidx)"
											src="/static/images/step/remove-icon.png" mode="widthFix" lazy-load="false">
										</image>
										<view class="render-ct record-back" @touchstart="touchStart"
											@touchend="touchEndEcho" :data-index="index" :data-itemid="item.id"
											:data-recidx="recidx">
											<view class="records-item">
												<text>{{ record.pracs[1].level }}</text>
											</view>
											<view>
												<text>{{ record.pracs[0].level }}</text>
											</view>
										</view>
										<view v-if=" item.checkObj.isCheck " class="render-right record-delete"
											@tap="removeRecord(item.id,recidx)">
											<text>删除</text>
										</view>
									</view>
								</view>
							</block>
							<block v-if=" item.id === 35 ">
								<view v-for="(record,recidx) in recordsObj['35'] " :key="recidx" index="recidx"
									item="record">
									<view
										:class="{ 'slideInRight':( record.removeSwitch? true :false),'slideOutRight':(record.closeSwitch? true :false)}"
										class="record echo ">
										<image class="btn-icon" v-if=" item.checkObj.isCheck "
											@tap="triggerRecord(item.id,recidx)"
											src="/static/images/step/remove-icon.png" mode="widthFix" lazy-load="false">
										</image>
										<view class="render-ct record-back" @touchstart="touchStart"
											@touchend="touchEndEcho" :data-index="index" :data-itemid="item.id"
											:data-recidx="recidx">
											<view class="records-item">
												<text>{{ record.pracs[1].level }}</text>
											</view>
											<view>
												<text>{{ record.pracs[0].level }}</text>
											</view>
										</view>
										<view v-if=" item.checkObj.isCheck " class="render-right record-delete"
											@tap="removeRecord(item.id,recidx)">
											<text>删除</text>
										</view>
									</view>
								</view>
							</block>
							<block v-if=" item.id == 36 ">
								<view v-for="(record,recidx) in recordsObj['36']" :key="recidx" index="recidx"
									item="record">
									<view
										:class="{ 'slideInRight':( record.removeSwitch? true :false),'slideOutRight':(record.closeSwitch? true :false)}"
										class="record echo ">
										<image class="btn-icon" v-if=" item.checkObj.isCheck "
											@tap="triggerRecord(item.id,recidx)"
											src="/static/images/step/remove-icon.png" mode="widthFix" lazy-load="false">
										</image>
										<view class="render-ct record-back" @touchstart="touchStart"
											@touchend="touchEndEcho" :data-index="index" :data-itemid="item.id"
											:data-recidx="recidx">
											<view class="records-item">
												<text>{{ record.pracs[1].level }}</text>
											</view>
											<view>
												<text>{{ record.pracs[0].level }}</text>
											</view>
										</view>
										<view v-if=" item.checkObj.isCheck " class="render-right record-delete"
											@tap="removeRecord(item.id,recidx)">
											<text>删除</text>
										</view>
									</view>
								</view>
							</block>
							<block v-if=" item.id == 37 ">
								<view v-for="(record,recidx) in recordsObj['37']" :key="recidx" index="recidx"
									item="record">
									<view
										:class="{ 'slideInRight':( record.removeSwitch? true :false),'slideOutRight':(record.closeSwitch? true :false)}"
										class="record echo ">
										<image class="btn-icon" v-if=" item.checkObj.isCheck "
											@tap="triggerRecord(item.id,recidx)"
											src="/static/images/step/remove-icon.png" mode="widthFix" lazy-load="false">
										</image>
										<view class="render-ct record-back" @touchstart="touchStart"
											@touchend="touchEndEcho" :data-index="index" :data-itemid="item.id"
											:data-recidx="recidx">
											<view class="records-item">
												<text>{{ record.pracs[0].level }}</text>
											</view>
											<view>
												<text>{{ record.pracs[1].level }}</text>
											</view>
										</view>
										<view v-if=" item.checkObj.isCheck " class="render-right record-delete"
											@tap="removeRecord(item.id,recidx)">
											<text>删除</text>
										</view>
									</view>
								</view>
							</block>
							<block v-if=" item.id == 38 ">
								<view v-for="(record,recidx) in recordsObj['38']" :key="recidx" index="recidx"
									item="record">
									<view
										:class="{ 'slideInRight':( record.removeSwitch? true :false),'slideOutRight':(record.closeSwitch? true :false)}"
										class="record echo">
										<image class="btn-icon" v-if=" item.checkObj.isCheck "
											@tap="triggerRecord(item.id,recidx)"
											src="/static/images/step/remove-icon.png" mode="widthFix" lazy-load="false">
										</image>
										<view class="render-ct record-back" @touchstart="touchStart"
											@touchend="touchEndEcho" :data-index="index" :data-itemid="item.id"
											:data-recidx="recidx">
											<view class="records-item">
												<text>{{ record.pracs[1].level }}</text>
											</view>
											<view>
												<text>{{ record.pracs[0].level }}</text>
											</view>
										</view>
										<view v-if=" item.checkObj.isCheck " class="render-right record-delete"
											@tap="removeRecord(item.id,recidx)">
											<text>删除</text>
										</view>
									</view>
								</view>
							</block>

						</view>
					</view>
				</view>
			</view>
			<view class="submit">
				<button class="submit-btn" type="primary" @tap="navigateToTestRecord">确定</button>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		getTemplates,
		getSubmitTemplates,
		userInfoEdit,
		addDataset,
		deletTemplates
	} from '@/api/health.js'
	import {
		spliceTimeStr,
		deepCopy,
		debounce
	} from "@/common/util/tool.js"
	import api from '@/api/api'
	export default {
		data() {
			return {
				userId: '',
				infoId: '',
				tempsArr: [], // 取得的默认列表
				renderArr: [], // 点击保存后用于本地渲染的数组
				// postRecord: [],                     // 新建病史返回的数据
				editIndex: '', // 当前编辑的容器 
				isFilling: false, // 禁止重复点击添加数据按钮
				recordsObj: {}, // 初始化回显数据保存的对象
				touchStartX: 0, // 滑动开始时坐标
				touchEndX: 0, // 滑动结束时坐标    
				slideIndex: '', // 当前滑动的索引
				reslideIndex: '', // 当前记录滑动的索引
				resetTemps: [],
				navClick: false,
			};
		},
		onLoad(options) {
			this.userId = options.userId; // 176
			this.infoId = options.infoId; // 1156
			console.log(this.infoId)
			this.getData();
		},
		watch: {

		},
		methods: {
			//获取数据，渲染页面
			getData() {
				let self = this;
				/**
				 * @params 首先取得列表的信息，渲染列表
				 * @params 再拿到info的id，用于新建数据集
				 */
				uni.getStorage({
					key: 'healthyData',
					success: res => {
						console.log(res, 621);
						let _temps = res.data.templates.slice(0, res.data.templates.length - 1);
						_temps.forEach(item => {
							// 去掉多余的字符
							let str = item.name;
							item.name = str.substr(0, str.length - 3);
							// 对每项添加编辑保存开关对象
							item.checkObj = {
								isCheck: false
							};
							// 对每项添加填写信息后的对象
							item.renderArr = [];
							// 对每项的practices数组中的 (item.practices[i])每一项添加selected对象，用于标识填写的值
							item.practices.forEach(prac => {
								if (prac.meta_code_id !== null) {
									prac.selected = {
										value: '', // 存提交时的value值
										name: '', // 用于picker选中后的展示
									}
								} else {
									prac.selected = {
										value: '' // 存时间类型
									}
								}
								// 对每项添加触发滑动删除开关
								prac.removeSwitch = false; // 展示删除
								prac.closeSwitch = false; // 关闭删除
								// console.log(prac, '799')
							});

						});
						self.tempsArr = _temps;
						// console.log(self.tempsArr, 'self.tempsArr')
						// console.log(this.infoId, 'infoId')
						// 回显数据
						if (this.infoId) {
							// let _url = url.health.datasets + '/' + self.infoId;
							// console.log(_url)
							getSubmitTemplates(self.infoId).then(res => {

								console.log(res, '回显病史');
								const datasets = res.data.datasets.reverse(),
									_recordsObj = self.recordsObj;

								// 匹配请求回来数据集，对初始项进行替换
								// 先组装数据
								datasets.forEach(item => {
									// 设置滑动删除开关
									item.removeSwitch = false; // 展示删除
									item.closeSwitch = false; // 关闭删除

									// 对时间字段切割
									item.record_at = spliceTimeStr(item.record_at);

									// 如果没有这个属性，就创建数组，推入数组
									if (!_recordsObj.hasOwnProperty(item.template_id)) {
										_recordsObj[item.template_id] = [];
										_recordsObj[item.template_id].push(item);
									} else {
										// 否则直接往里推
										_recordsObj[item.template_id].push(item);
									}
								});
								self.recordsObj = {
									..._recordsObj
								}
								console.log(_recordsObj, '802');


							}).catch(err => {
								console.log(err);
							})
						}

					}
				})

				let UserInfo = this.$store.getters.currentUserInfo
				self.navClick = UserInfo.info
			},
			//编辑
			editHandler(item, index) {
				console.log(item)
				/**
				 * 1.控制编辑与保存的样式
				 * 2.控制添加按钮
				 */
				//let index =index,
				let _temps = this.tempsArr[index];

				if (this.editIndex !== '' && this.editIndex !== index) return;
				this.editIndex = index;
				// 取数据操作
				let prac = this.tempsArr[index].practices;
				this.renderArr = prac;
				_temps.checkObj.isCheck = !_temps.checkObj.isCheck;

			},
			//取消保存
			saveCancel(item, ind) {
				let index = ind,
					tempid = item.id,
					_temps = this.tempsArr[index];
				this.editIndex = '';
				_temps.checkObj.isCheck = !_temps.checkObj.isCheck;

				// 对要删除项归位
				console.log(this.resetTemps, 523)
				this.resetTemps.removeSwitch = false;
				this.slideIndex = '';
				this.reslideIndex = '';
				_temps.practices.forEach(item => {
					if (item.meta_code_id !== null) {
						item.selected = {
							value: '',
							name: '',
						}
					} else {
						item.selected = {
							value: ''
						}
					}
				});
			},
			//保存编辑
			saveHandler(item, ind) {
				console.log(item)
				console.log(this.tempsArr)

				let index = ind,
					tempid = item.id,
					_temps = this.tempsArr[index];
				console.log(_temps, 439)
				// 检测是否有空项，有空项就不发请求
				let pass = _temps.practices.every(item => {
					if (item.format === 'L') return true; // 对L类型特殊处理，因为L类型未渲染在页面中，无法修改一直是空值
					return item.selected.value !== '';
				});
				if (!pass) {
					this.$tip.toast("提交信息存在空值")
					return
				};
				this.editIndex = '';
				_temps.checkObj.isCheck = !_temps.checkObj.isCheck;

				// 对要删除项归位
				console.log(this.resetTemps, 523)
				this.resetTemps.removeSwitch = false;
				this.slideIndex = '';
				this.reslideIndex = '';



				console.log(_temps, 452)

				// 每次保存时发送请求
				let subArr = _temps.practices.map(item => {
					return {
						prac_id: item.prac_id,
						practice_id: item.practice_id,
						value: item.selected.value
					}
				});
				let subObj = {
					user_id: this.userId,
					sup_id: this.infoId,
					template_id: tempid,
					supplier_id: 2,
					pracs: subArr
				};
				console.log(subObj, '469')

				// 记录当前保存的数据，用于本地渲染
				_temps.renderArr.push(deepCopy(_temps.practices));
				_temps.renderArr.reverse();


				// 发请求
				addDataset(subObj).then(res => {

					console.log(res, '472');

					// 将新建提交的数据存下来，用于查找本地删除时遍历匹配项
					// this.postRecord.push(res.data);

					// console.log(_temps.renderArr)
					// 每次对renderArr的最后一位进行数据绑定，用于删除时使用datasetid
					_temps.renderArr[_temps.renderArr.length - 1].forEach(item => {
						item.dataset_id = res.data.id;
					});
					console.log(_temps.renderArr, '562')

					// 点击保存以后清空当前的选择值
					_temps.practices.forEach(item => {
						if (item.meta_code_id !== null) {
							item.selected = {
								value: '',
								name: '',
							}
						} else {
							item.selected = {
								value: ''
							}
						}
					});

				}).catch(err => {
					console.log(err);
					this.$tip.toast('请再试一次');
				});
			},
			// 添加记录
			addRecord(e) {
				/**
				 * @todo 点击添加按钮时，处理picker的默认展示数据
				 */
				let index = e.currentTarget.dataset.index,
					prac = this.tempsArr[index].practices;
				this.editIndex = index;

				this.renderArr = prac;
				console.log(this.renderArr)
				// if (this.isFilling) return;
				// this.isFilling = true;      // 禁止重复点击添加按钮，不限制会一直对数组添加项

			},
			//下拉选择修改
			bindPickerChange(index, idx, e) {
				/**
				 * @todo 首先找到病史的类型index -> tempsArr[index]
				 * @todo 再根据tempsArr[index]的类型，找到具体的那一项tempsArr[index].practices[idx]
				 */
				let self = this,
					itemIdx = e.detail.value,
					range = this.tempsArr[index].practices[idx].meta.range;
				this.tempsArr[index].practices[idx].selected = {
					value: range[itemIdx].value,
					name: range[itemIdx].name
				}
			},
			//日期修改
			bindDateChange(index, idx, e) {
				let self = this
				this.tempsArr[index].practices[idx].selected.value = e.detail.value;
				console.log(this.tempsArr[index], 541)
			},
			//输入框的修改
			bindChange(index, idx, e) {
				/**
				 * 首先找到病史的类型index -> tempsArr[index]
				 * 再根据tempsArr[index]的类型，找到具体的那一项tempsArr[index].practices[idx]
				 */
				let self = this
				this.tempsArr[index].practices[idx].selected.value = e.detail.value;
				console.log(this.tempsArr[index]);
			},
			//点击删除图表，显示确认删除按钮
			triggerRemove(index, rdx) {
				/**
				 * @desc 用于触发删除按钮，针对保存新增的数据
				 */
				let prac = this.tempsArr[index].renderArr[rdx];
				console.log(index, rdx, 636)
				if (this.slideIndex !== '' || this.reslideIndex !== '') return;
				// 记录当前要滑动的索引
				this.slideIndex = rdx;
				prac[0].closeSwitch = false;
				prac[0].removeSwitch = true;
				// 用于归位操作
				this.resetTemps = prac[0];
			},
			//调用删除接口
			removeItem(index, rdx) {
				console.log("调用删除接口")
				/**
				 * @desc 仅删除推入renderArr数组新增的项
				 */
				let temp = this.tempsArr[index];
				// 找到dataset_id匹配项 reslideIndex
				let _dataset_id = temp.renderArr[rdx][0].dataset_id

				deletTemplates(_dataset_id).then(res => {
					console.log(res);
					this.$tip.toast('删除成功');
				}).catch(err => {
					this.$tip.toast('请再试一次');
				});
				temp.renderArr.splice(rdx, 1);
				this.slideIndex = '';
			},
			//记录的删除
			triggerRecord(itemid, recidx) {
				/**
				 * @desc 用于触发回显记录的删除按钮
				 */
				let records = this.recordsObj;
				// 用于禁止相邻元素可以滑动
				if (this.slideIndex !== '' || this.reslideIndex !== '') return;
				// 记录当前要滑动的索引
				this.reslideIndex = recidx;
				this.$set(records[itemid][recidx], 'closeSwitch', false)
				this.$set(records[itemid][recidx], 'removeSwitch', true)
				console.log(records[itemid][recidx])
				// 用于归位操作
				this.resetTemps = records[itemid][recidx];
			},
			//调用删除接口
			removeRecord(itemid, recidx) {
				/**
				 * @desc 仅删除回显记录后recordsObj的项
				 * @todo 1.删除recordsObj数组的指定项
				 * @todo 2.对指定项发送请求
				 */
				let records = this.recordsObj;
				let delId = records[itemid][recidx].id
				deletTemplates(delId).then(res => {
					records[itemid].splice(recidx, 1); // 删除视图中显示的项
				}).catch(err => {
					console.log(err);
					this.$tip.toast('请再试一次');
				});
				this.reslideIndex = '';
			},
			touchStart(e) {
				// console.log(e)
				this.touchStartX = e.changedTouches[0].clientX ? e.changedTouches[0].clientX : 0;
			},
			touchEnd(e) {
				let {
					index,
					rdx
				} = e.currentTarget.dataset;
				let prac = this.tempsArr[index].renderArr[rdx];

				// 用于禁止展开当前项 滑动其他项 会清空当前项的索引
				if (this.slideIndex === '' || this.slideIndex !== rdx) return;
				this.touchEndX = e.changedTouches[0].clientX;
				this.slideIndex = '';
				if (this.tempsArr[index].checkObj.isCheck && this.touchEndX - this.touchStartX > 20) { // 表示向右滑动
					prac[0].closeSwitch = true;
					prac[0].removeSwitch = false;
				}
			},
			touchEndEcho(e) {
				console.log(e)
				/**
				 * @desc 处理回显记录的滑动函数
				 */
				let {
					itemid,
					recidx,
					index
				} = e.currentTarget.dataset;
				let records = this.recordsObj;

				// console.log(this.reslideIndex)
				// 用于禁止展开当前项 滑动其他项 会清空当前项的索引
				console.log(this.reslideIndex)
				console.log(recidx)
				if (this.reslideIndex === '' || this.reslideIndex !== recidx) return;
				this.touchEndX = e.changedTouches[0].clientX;
				this.reslideIndex = '';
				console.log(this.tempsArr[index].checkObj.isCheck)
				console.log(this.touchEndX)
				console.log(this.touchStartX)
				if (this.tempsArr[index].checkObj.isCheck && this.touchEndX - this.touchStartX > 20) {
					console.log(23232323)
					records[itemid][recidx].closeSwitch = true;
					records[itemid][recidx].removeSwitch = false;
				}
				console.log(1111)
			},
			submitHandler() {
				// const temps = this.tempsArr,
				//       subArr = [];
				// const subObj = {
				//     user_id: this.userId,
				//     sup_id: this.infoId,
				//     template_id: 1,
				//     supplier_id: 2,
				//     pracs: subArr
				// }
				// // 检测是否都是空项
				// let pass = temps.some(item => {
				//     return item.renderArr.length !== 0;
				// });
				// let through = Object.keys(this.recordsObj).length > 0;
				// console.log(pass, through, 'ispass')
				// if (pass || through === 0) return;
				// // console.log(pass);
				// // 组装提交数据
				// for (let i = 0; i < temps.length; i++) {
				//     var renderArr = temps[i].renderArr;
				//     // 挑选出renderArr中的每项，将存在值selected的项推到subArr中
				//     for (let j = 0; j < renderArr.length; j++) {
				//         console.log(renderArr[j]);
				//         var render = renderArr[j];
				//         // 由于renerArr[j]每项是[{},{}]，所以需要再次遍历
				//         for (let l = 0; l < render.length; l++) {
				//             console.log(render[l])
				//             if (render[l].format === 'L') continue;
				//             subArr.push({
				//                 prac_id: render[l].prac_id,
				//                 practice_id: render[l].practice_id,
				//                 value: render[l].selected.value
				//             })
				//         }
				//     }
				// }
				// console.log(subArr);
				// request(url.health.datasets, 'POST', subObj, true).then(res => {
				//     console.log(res);
				//     uni.switchTab({
				//         url: '/pages/me'
				//     });
				// }).catch(err => {
				//     console.log(err);
				//     toast.failToast('请再试一次', 1500);
				// })
				uni.switchTab({
					url: '/pages/user/people'
				});
			},
			navigateToBasic() {
				uni.navigateTo({
					url: '/pages1/healthy/basic?userId=' + this.userId + '&infoId=' + this.infoId
				});
			},
			navigateToTestRecord() {
				uni.navigateTo({
					url: '/pages1/healthy/testrecord?userId=' + this.userId + '&infoId=' + this.infoId
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		min-height: 100%;
		display: flex;
		flex-direction: column;
	}

	.common-linebox {
		padding: 20rpx 33rpx 17rpx 56rpx;
		font-size: 32rpx;
		line-height: 45rpx;
	}

	.btn-icon {
		width: 40rpx;
		height: 40rpx;
		margin-right: 19rpx;
	}

	.grow-2 {
		flex-grow: 2;
	}

	.grow-1 {
		flex-grow: 1;
	}

	.opacity-0 {
		color: white;
	}

	.disease {
		flex-grow: 1;
		display: flex;
		flex-direction: column;

		.line-one {
			flex: 0 0 1;
		}

		.info {
			flex-grow: 1;

			.section {
				border-bottom: 10rpx solid #F6F6F6;

				.title-ct {
					display: flex;
					justify-content: space-between;
					color: #2C3237;

					.name-ct {
						display: flex;
						align-items: center;
						font-weight: bold;

					}

					.confirm-btn {
						color: #4D7ECD;
					}
				}

				.edit-ct {
					display: flex;
					justify-content: space-between;
					border-top: 1rpx solid #EEEFF1;

					.picker-date {
						border-left: 1rpx solid #E3E7ED;

						.date-intro {
							padding-left: 20rpx;
							white-space: nowrap;
						}
					}

					.input-ct {
						display: flex;
						justify-content: space-between;
						white-space: nowrap;
					}
				}

				.content-ct {
					/* 用于固定页面，溢出部分裁剪，禁止页面被拖动 */
					width: 750rpx;
					overflow: hidden;
					/* end */

					border-top: 1rpx solid #EEEFF1;
					color: #4A4A4A;

					/* 样式区别：1.新增的病史record下会有多个记录 2.回显记录中每一个record为一条记录 */
					.record {
						font-size: 32rpx;
						line-height: 45rpx;
						// overflow-x: auto;

						.record-none {
							margin: 18rpx auto 18rpx 56rpx;
						}

						.render-ct {
							display: flex;
							padding: 20rpx 30rpx 20rpx 40rpx;
							border-bottom: 1rpx solid #EEEFF1;

							.render-section {
								flex-grow: 1;
								display: flex;

								.render-item {
									display: flex;
									justify-content: space-between;
								}
							}

							// 回显记录样式
							.records-item {
								// display: flex;
								// align-items: center;

								// 控制文本溢出
								white-space: nowrap;
								max-width: 300rpx;
								text-overflow: ellipsis;
								overflow: hidden;
							}
						}

						.render-right {
							position: absolute;
							left: 750rpx;
							top: 0;
							padding: 20rpx 0;
							width: 120rpx;
							text-align: center;
							color: #fff;
							background: #FE785C;
						}

						// 回显记录样式
						.record-back {
							flex-grow: 1;
							justify-content: space-between;
							padding-left: 0;
						}
					}

					/* 由于上面样式有公共部分 过于难改 所以下面采用样式覆盖 */
					.record-article {
						position: relative;
					}

					.record-article::-webkit-scrollbar {
						display: none;
					}

					// 处理回显样式
					.echo {
						position: relative;
						display: flex;
						align-items: center;
						border-bottom: 1rpx solid #EEEFF1;
						padding-left: 40rpx;
					}
				}
			}
		}

		.submit {
			padding: 90rpx 38rpx 56rpx;

			.submit-btn {
				width: 100%;

			}
		}
	}

	/* step步骤样式 */
	.step {
		border-top: 10rpx solid #f6f6f6;
		border-bottom: 10rpx solid #f6f6f6;
		padding: 83rpx 76rpx 51rpx;
		background-color: #fff;

		.step-iconct {
			position: relative;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 34rpx;

			image.step-cicon {
				width: 50rpx;
				height: 50rpx;

			}

			image.step-licon {
				position: absolute;
				top: 24rpx;
				left: 70rpx;
				width: 460rpx;
				height: 2rpx;
			}
		}

		.step-introct {
			display: flex;
			justify-content: space-between;
			color: #9EBBE5;
			font-size: 30rpx;
			line-height: 42rpx;

			.step-introd {
				color: #4D7ECD;
			}
		}
	}

	/* 动画样式 */
	@keyframes rotate {
		50% {
			transform: translate(-50%, -73%) rotate(180deg);
		}

		100% {
			transform: translate(-50%, -70%) rotate(360deg);
		}
	}

	@keyframes slideInRight {
		from {
			-webkit-transform: translate3d(0, 0, 0);
			transform: translate3d(0, 0, 0);
			visibility: visible;
		}

		to {
			-webkit-transform: translate3d(-120rpx, 0, 0);
			transform: translate3d(-120rpx, 0, 0);
		}
	}

	@keyframes slideOutRight {
		from {
			-webkit-transform: translate3d(-120rpx, 0, 0);
			transform: translate3d(-120rpx, 0, 0);
			visibility: visible;
		}

		to {
			-webkit-transform: translate3d(0, 0, 0);
			transform: translate3d(0, 0, 0);
		}
	}

	.slideInRight {
		animation: slideInRight .3s forwards;
		// overflow-x: auto;
	}

	.slideOutRight {
		animation: slideOutRight .3s forwards;
	}
</style>
