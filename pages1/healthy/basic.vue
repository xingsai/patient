<template>
	<view>
			<!-- 基本信息 -->
		<cu-custom :bgColor="NavBarColor" :isBack="true">
			<block slot="content">健康档案</block>
		</cu-custom>
		<view class="basic">
			<view class="step">
				<view class="step-iconct" v-if="!navClick">
					<image class="step-cicon" src="/static/images/step/step-compiling.png" mode="widthFill"
						lazy-load="false"></image>
					<image class="step-licon" src="/static/images/step/step-line1.png" mode="widthFill"
						lazy-load="false"></image>
					<image class="step-cicon" src="/static/images/step/step-uncompile.png" mode="widthFill"
						lazy-load="false"></image>
					<image class="step-licon" src="/static/images/step/step-line1.png" mode="widthFill"
						lazy-load="false"></image>
					<image class="step-cicon" src="/static/images/step/step-uncompile.png" mode="widthFill"
						lazy-load="false"></image>
				</view>
				<view class="step-iconct" v-else>
					<image class="step-cicon" src="/static/images/step/step-compiling.png" mode="widthFill"
						lazy-load="false"></image>
					<image class="step-licon" src="/static/images/step/step-line1.png" mode="widthFill"
						lazy-load="false"></image>
					<image class="step-cicon mg-row-5" src="/static/images/step/step-compile.png" mode="widthFill"
						lazy-load="false" @tap="navigateToDisease"></image>
					<image class="step-licon" src="/static/images/step/step-line1.png" mode="widthFill"
						lazy-load="false"></image>
					<image class="step-cicon" src="/static/images/step/step-compile.png" mode="widthFill"
						lazy-load="false" @tap="navigateToTestRecord"></image>
				</view>
				<view class="step-introct">
					<text class="step-introd">基本信息</text>
					<text>病史信息</text>
					<text>检测记录</text>
				</view>
			</view>
			<view class="info">
				<view v-for="(item,index) in defaultArr" :key="index">
					<!-- 单选 -->
					<view class="section" v-if="item.meta_code_id !== null && item.prac_type < 5">
						<view class="intro">{{item.slot}}</view>
						<view class="value">
							<picker class="item-picker" mode="selector" @change="bindPickerChange(item,index,$event)"
								:range="item.meta.range" range-key="name">
								<view class="picker " :class="{ 'white':(item.selected.level == '' ? true :false)}">
									{{ item.selected.level ? item.selected.level : '请选择' }}
								</view>
							</picker>
							<image class="icon" src="/static/images/link-icon.png" mode="widthFix" lazy-load="false">
							</image>
						</view>
					</view>
					<!-- 多选 -->
					<view class="section checkbox" v-if="item.meta_code_id !== null && item.prac_type >= 5">
						<view class="intro">{{item.slot}}</view>
						<view class="value checkbox">
							<checkbox-group
								:class="{ 'block':( item.hideChoice? false :true),'none':( item.hideChoice? true :false)}"
								@change="bindCheckboxChange(item,index,$event)">
								<view v-for="(range,ridx) in item.meta.range" :key="ridx" index="ridx" item="range">
									<label class="weui-cell weui-check__label" style="display: flex;">
										<view class="weui-cell__hd">
											<checkbox style="transform:scale(0.7)" :value="range.value+''" :checked="range.checked" />
										</view>
										<view class="weui-cell__bd">{{range.name}}</view>
									</label>
								</view>
							</checkbox-group>
							<view @tap="toggleCheckbox(item,index,$event)" v-show="item.hideChoice"
								:class="{ 'level-text':( item.hideChoice ? true :false)}">{{item.selected.level}}</view>
							<image @tap="toggleCheckbox(item,index,$event)" class="icon" src="/static/images/link-icon.png"
								mode="widthFix" lazy-load="false"></image>
						</view>
					</view>
					<!-- 日期 -->
					<view class="section" v-if="item.format === 'D'">
						<view class="intro">{{item.slot}}</view>
						<view class="value">
							<picker mode="date" class="item-picker" data-idx="index" :value="item.selected.level "
								@change="bindDateChange(item,index,$event)">
								<view class="picker " :class="{ 'white':(item.selected.level == '' ? true :false)}">
									{{ item.selected.level ? item.selected.level : '请选择'}}
								</view>
							</picker>
							<image class="icon" src="/static/images/link-icon.png" mode="widthFix" lazy-load="false">
							</image>
						</view>
					</view>
					<!-- 地区选择 -->
					<view class="section" v-if="item.format === 'AR'">
						<view class="intro">{{item.slot}}</view>
						<view class="value">
							<picker mode="region" class="item-picker" data-idx="index" :value=" item.selected.region "
								@change="bindRegionPickerChange(item,index,$event)">
								<view class="picker" :class="{ 'white':(item.selected.level == '' ? true :false)}">
									{{ item.selected.region ? item.selected.region : '请选择'}}
								</view>
							</picker>
							<image class="icon" src="/static/images/link-icon.png" mode="widthFix" lazy-load="false">
							</image>
						</view>
					</view>
					<!-- 特殊处理335 常住地址户籍标志-现居地址 -->
					<!-- <block  v-if="{{item.format === 'AR' && item.prac_id == 335}}">
		                        <view class="section"  v-if="{{addSwitch !== ''}}">
		                            <view class="intro">{{item.slot}}</view>
		                            <view class="value">
		                                <picker mode="region"
		                                    class="item-picker"
		                                    data-idx="{{ index }}"
		                                    value="{{ item.selected.region }}"
		                                    @change="bindRegionPickerChange">
		                                    <view class="picker {{ item.selected.value == '' ? 'white' : '' }}">
		                                        {{ item.selected.region ? item.selected.region : '请选择'}}
		                                    </view>
		                                </picker>
		                                <image class="icon" src=" /static/image/link-icon.png'}}" mode="widthFix" lazy-load="false"></image>
		                            </view>
		                        </view>
		                    </block>
		                    <view class="section"  v-if="{{item.format === 'L'}}">
		                        <view class="intro">{{item.slot}}</view>
		                        <view class="value" class="switch item-picker">
		                            <switch @change="bindSwitchChange" checked="{{checkSwitch1}}" color="#4D7ECD" data-idx="{{index}}"/>
		                        </view>
		                    </view> -->
					<!-- 输入框 -->
					<view class="section" v-if="item.format[0] === 'S' && item.meta_code_id === null">
						<view class="intro">{{item.slot}}</view>
						<view class="value">
							<input class="grow-1" type="text" confirm-type="done" :value="item.level"
								data-idx="index" data-pracid="item.practice_id" @blur="bindBlur" />
							<image class="icon" src="/static/images/link-icon.png" mode="widthFix" lazy-load="false">
							</image>
						</view>
					</view>
				</view>
			</view>
			<view class="submit">
				<button @tap="submitTo" type="primary">确认</button>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		getTemplates,
		getSubmitTemplates,
		userInfoEdit,
		addDataset
	} from '@/api/health.js'
	import apiService from '@/api/api.js'

	import {
		deepCopy,debounce
	} from '@/common/util/tool.js'

	function modifycheckBoxModalArr(arr, obj, value, fn = null) {
		obj = deepCopy(obj)
		const idx = arr.findIndex(a => a.prac_id === obj.prac_id)
		if (idx > -1) {
			arr.splice(idx, 1, obj)
		} else {
			arr.push(obj)
		}
		const nidx = arr.findIndex(a => a.prac_id === obj.prac_id)
		const target = arr[nidx]
		target.selected.value = [...value]
		const levelArr = value.reduce((nv, ov) => {
			return nv + ov
		}, '')
		value.forEach(v => {
			obj.meta.range.forEach(o => {
				if (v == o.value) {
					console.log(o);
					target.selected.level = target.selected.level + o.name + ' '
				}
			})
		})
		if (fn !== null) {
			// console.log('function', fn);
			fn(arr)
		}
		console.log('modifycheckBoxModalArr-end', arr);
		return arr
	}
	export default {
		name: "people",
		data() {
			return {
				userId: '', // me页面中tableList的id
				_info: null, // info==null 表示新建
				_infoId: '', // 请求填过的数据集
				_datasetId: '', // 新增数据集时使用
				defaultArr: [],
				fillArr: [],
				timer: null,
				areaList: [], // 地址列表
				addSwitch: '', // 地址索引
				checkSwitch1: false,
				fillData: [], // 用于判断是否新建过基础信息
				navClick: false, // nav是否可以点击
				checkBoxModalArr: [],
				initialPracs: [],
			};
		},
		computed: {
			
		},
		watch: {

		},
		created() {
			//获取用户的所有信息
			this.getData();
		},
		methods: {
			decoratePracs(defArr) {
				let postObj = []
				for (let i = 0; i < defArr.length; i++) {
					let format = defArr[i].format
					/*
					if (defArr[i].hasOwnProperty('level') && defArr[i].level.length !== 0) {
					    // console.log(i)
					    postObj.push({
					        prac_id: defArr[i].prac_id,
					        practice_id: defArr[i].practice_id,
					        value: defArr[i].level
					    });
					} 
					else if (defArr[i].hasOwnProperty('selected')) {
					    // console.log(i)
					    postObj.push({
					        prac_id: defArr[i].prac_id,
					        practice_id: defArr[i].practice_id,
					        value: defArr[i].selected.value
					    })
					}
					*/
					if (defArr[i].format.startsWith('S') && defArr[i].meta_code_id === null) {
						postObj.push({
							prac_id: defArr[i].prac_id,
							practice_id: defArr[i].practice_id,
							level: defArr[i].level
						});
					} else if (defArr[i].meta_code_id !== null) {
						postObj.push({
							prac_id: defArr[i].prac_id,
							practice_id: defArr[i].practice_id,
							level: defArr[i].selected.level,
							value: defArr[i].selected.value
						});
					} else if (defArr[i].format.startsWith('D')) {
						postObj.push({
							prac_id: defArr[i].prac_id,
							practice_id: defArr[i].practice_id,
							level: defArr[i].selected.level
						})
					} else if (defArr[i].format.startsWith('N')) {
						postObj.push({
							prac_id: defArr[i].prac_id,
							practice_id: defArr[i].practice_id,
							value: defArr[i].value
						});
					} else if (defArr[i].format.startsWith('AR')) {
						postObj.push({
							prac_id: defArr[i].prac_id,
							practice_id: defArr[i].practice_id,
							value: defArr[i].selected.value
						})
					}
					/*
					else if (defArr[i].format.startsWith('L')) {
					    postObj.push({
					        prac_id: defArr[i].prac_id,
					        practice_id: defArr[i].practice_id,
					        value: Number(defArr[i].selected.value)
					    });
					}
					*/
				}
				return postObj
			},
			//更新单条数据
			updateSelf(self, idx, checkBoxModal = []) {
				console.log('updateSelf', self._info, self._infoId, idx, checkBoxModal);
				//当没有档案信息的时候不更新
				if (this.fillData.length ==0) {return}
				/**
				 * 重新匹配：
				 * this.defaultArr[idx]是当前列表的位置
				 * 要找到info中pid那项的位置，进行更改
				 * 再发送请求
				 */
				function fn() {
					let _fill = self.fillArr,
						_defArr = self.defaultArr;
					// console.log(_defArr[idx], '320')
					 console.log(self._infoId,33333)
					if (self._infoId !== '') {
						/**
						 * pracId 列表项的初始字段，判断是修改还是新增
						 */
						let pracId = _defArr[idx].prac_id;
						let findPracIdx = _fill.findIndex(i => i.id === pracId)
						console.log(findPracIdx ,"findPracIdx")

						if (findPracIdx > -1) {
							let findPrac = _fill[findPracIdx]
						//	let _edit = url.health.updata + findPrac.pid,
							let 	_data = {};
							const editTarget = self.defaultArr[idx]
							if (editTarget.format.startsWith('S') && editTarget.meta_code_id === null) {
								_data = {
									level: editTarget.level
								};
							} else if (editTarget.meta_code_id !== null && editTarget.prac_type < 5) {
								_data = {
									value: editTarget.selected.value,
									level: editTarget.selected.level
								}
							} else if (editTarget.meta_code_id !== null && editTarget.prac_type >= 5) {
								_data = {
									value: editTarget.selected.value
								}
							} else if (editTarget.format.startsWith('D')) {
								_data = {
									level: editTarget.selected.level
								};
							} else if (editTarget.format.startsWith('N')) {
								_data = {
									value: editTarget.value
								};
							} else if (editTarget.format.startsWith('AR')) {
								_data = {
									value: editTarget.selected.value
								}
							}
							/*
							else if (editTarget.format.startsWith('L')) {
							    _data = {value: Number(editTarget.selected.value)};
							}
							*/
							console.log(_data, '编辑')
							console.log(findPrac, '编辑')

							userInfoEdit( {data:_data,id:findPrac.pid}).then(res => {
								console.log(res);
							}, err => {
								console.log(err);
							})
						} else {
							console.log(11111111);
							console.log(self.defaultArr[idx]);
							//_insert = url.health.updata,
							let 	_static = {
									practice_id: self.defaultArr[idx].practice_id,
									prac_id: self.defaultArr[idx].prac_id,
									dataset_id: self.datasetId,
									name:self.defaultArr[idx].name,
								},
								_data = {}
							const storeTarget = self.defaultArr[idx]
							if (storeTarget.format.startsWith('S') && storeTarget.meta_code_id === null) {
								_data = {
									..._static,
									level: storeTarget.level
								};
							} else if (storeTarget.meta_code_id !== null && storeTarget.prac_type < 5) {
								_data = {
									..._static,
									value: storeTarget.selected.value,
									level: storeTarget.selected.level
								}
							} else if (storeTarget.meta_code_id !== null && storeTarget.prac_type >= 5) {
								console.log('storeTarget', storeTarget);
								console.log('checkBoxModal', checkBoxModal);
								_data = {
									..._static,
									value: storeTarget.selected.value
								}
							} else if (storeTarget.format.startsWith('D')) {
								_data = {
									..._static,
									level: storeTarget.selected.level
								};
							} else if (storeTarget.format.startsWith('N')) {
								_data = {
									..._static,
									value: storeTarget.value
								};
							} else if (storeTarget.format.startsWith('AR')) {
								_data = {
									..._static,
									value: storeTarget.selected.value
								}
							}
							/*
							else if (storeTarget.format.startsWith('L')) {
							    _data = {..._static, value: Number(storeTarget.selected.value)};
							}
							*/
							console.log(_data, '新增')

							userInfoEdit( {data:_data}).then(res => {
								console.log(res);
							}, err => {
								console.log(err);
							});
						}

					}
				}
				debounce(fn.bind(self))()
			},
			//获取数据信息
			getData() {
				/**
				 * @desc 1.取得数据集列表
				 * @desc 2.对数据集里列表进行初始赋值
				 * @desc 3.取得地址列表
				 * @desc 4.取得填写过的数据集
				 * @desc 5.找到匹配项回显数据集
				 */
				let self = this;
				// 取得数据集列表
				getTemplates().then(res => {
					let _data = res.data,
						_temp = _data.practices,
						_history = _data.templates;
					uni.setStorage({
						key: 'healthyData',
						data: _data
					});
					// 初始化列表数据
					let defArr = deepCopy(_temp),
						len = defArr.length;
					while (len--) {
						/**
						 * 由于用到了splice切数组 避免索引异常，次数使用while循环
						 */
						let item = defArr[len]
						// 先对数据进行集体化操作避免报错
						if (!item.level) item.level = ''
						item.selected = {
							value: '',
							level: ''
						}
						// 得到列表后 初始化地区数组
						if (item.format === 'AR') {
							item.selected = {
								value: '',
								code: [0, 0, 0],
								region: ['省', '市', '区']
							}
						}
				
						// 对input类型添加控制失焦事件开关
						else if (item.format[0] === 'S' && item.mata === null) {
							item.blurEvent = false;
						}
						// 多选类型
						else if (item.meta_code_id !== null && item.prac_type >= 5) {
							item.selected = {
								value: [],
								level: ''
							}
							item.hideChoice = true
							item.meta.range.forEach(r => r.checked = false)
						}
					}
					this.defaultArr = defArr;
					this.initialPracs = this.decoratePracs(defArr)
					console.log('this.defaultArr', this.defaultArr);
					console.log('this.initialPracs', this.initialPracs)

					// 取得地址列表
					apiService.getAreas().then(res => {
						 console.log(JSON.stringify(res.data));
						self.areaList = res.data;
						let _areaList = self.areaList;

						let UserInfo = this.$store.getters.currentUserInfo
						self.userId = UserInfo.id;
						// info 不为空，表示填写过健康档案   
						if (UserInfo.info !== null) {
							self._info = UserInfo.info;
							self._infoId = UserInfo.info.id;
							// 回显数据集
							getSubmitTemplates(self._infoId).then(res => {
								// console.log(res);
								self.fillArr = res.data.pracs;
								self.datasetId = res.data.id;
								let fillData = res.data.pracs,
									defArr = self.defaultArr;
								self.fillData = fillData;
								/**
								 * @todo 请求回来数据集的填写项，进行替换初始数据集
								 */
								for (let i = 0; i < fillData.length; i++) {
									let record = fillData[i]
									for (let j = 0; j < defArr.length; j++) {

										let render = defArr[j]
										if (record.id === render.prac_id) {

											if (render.meta_code_id != null) {
												// picker 类型 
												// console.log('render:', render, 'record:', record)
												const range = render.meta.range
												//多选
												if (render.prac_type >= 5) {
													const recordLevel = record.level
													const recordLevelArr =recordLevel.split(' ')
													render.selected.level =recordLevel
													recordLevelArr.forEach(rlevel => {
															range.forEach(ritem => {
																	if (rlevel ===ritem.name) {
																		ritem.checked =true
																		render.selected.value.push(ritem.value)
																	}
																})
														})
												} else {
													//单选
													const optionIndex = range.find(r => r.value ==record.value)
													console.log('optionIndex', optionIndex);
													if (optionIndex) {
														render.selected.value = optionIndex.value
														render.selected.level = optionIndex.name
													}

												}
											} else if (render.format
												.startsWith('S') && render
												.meta_code_id === null) {
												render.level = record.level ===
													'' ? record.value : record
													.level;
											} else if (render.format ===
												'D') { // 日期选择器
												render.selected.level = record
													.level
											} else if (render.format === 'N') {
												record.value = record.value
											} else if (render.format ===
												'AR'
											) { // 地址选择器：如果是地址选择器，回显数据特殊处理
												render.selected.value = record.value;
									
												let _region = [];
												for (let n = 0; n < _areaList.length; n++) {
													// console.log(_areaList[n]);
													// _region.push(_areaList[n].label);           //北京省  _areaList[n].label
													if (_areaList[n].children.length !== 0) {
														if (_areaList[n].children.length === 1
														) { // 如果children长度为1，比如北京 天津
															let single =_areaList[n].children[0]; //北京市   single.label 
															// console.log(single)
															for (let x = 0; x <single.children.length; x++) {
																// console.log(single[x])
																if (single.children[x].value ==record.value) {
																	// 东城区 single.children[x].label         
																	_region = [
																		_areaList[n].label,
																		single.label,
																		single.children[x].label
																	];
																	// console.log(_region)
																	// render.selected = {
																	//     region: _region
																	// }
																	render.selected.region =_region
																}
															}
														} else { // 如果children长度不为1，比如河北省
															let city =_areaList[n].children;
															for (let y = 0; y <city.length; y++) {
																// city[y].children 对应区列表     city[y].label 对应市名称
																let district =city[y].children;
																for (let z =0; z <district.length; z++) {
																	if (district[z].value ==record.value
																	) {
																		_region= [_areaList[n].label,city[y].label,district[z].label];
																		// console.log(_region)
																		// render.selected = {
																		//     region: _region
																		// }
																		render.selected.region =_region
																	}
																}
															}
														}
													}
												}
											}
											// else if (defArr[j].format === 'L') {        // switch选择器
											//     /**
											//      * @desc 目前仅有 常住地址户籍标志 的逻辑。以后要展示order > 100的类型，需要进一步处理
											//      */
											//     // console.log(fillData[i].value)
											//     let _lvalue = fillData[i].level == 1 ? true : false;
											//     self.checkSwitch1 = _lvalue;
											//     if (self.checkSwitch1) {                // 只有为ture时才赋值 展示现居地址代码
											//         // console.log(j, 'j')
											//         self.addSwitch = j;
											//     }
											//     defArr[j].selected.value = _lvalue;
											// }
										}
									}
								}


								// console.log('self.defaultArr', self.defaultArr)
							}).catch(err => {
								console.log(err);
							})
							self.navClick = UserInfo.info

						} else {


						}
		
					}).catch(err => {
						console.log('cannot get area')
					})

				});
			},
			bindBlur(item,index,e) {
				if (e.detail.value === '') return
				let self = this,
					idx = e.currentTarget.dataset.idx;
				this.defaultArr[idx].level = (e.detail.value).trim();
				if (this._info !== null) this.updateSelf(self, idx);
			},
			bindPickerChange(item,index,e) {
				
				let self = this,
					idx = index, // 循环中的index
					itemIdx = e.detail.value, // picker组件默认返回的索引值
					metaObj = this.defaultArr[idx].meta;
				this.defaultArr[idx].selected = {
					value: metaObj.range[itemIdx].value, // 取range数组中第索引位的value值
					level: metaObj.range[itemIdx].name
				};
				// console.log(this.defaultArr[idx], 'this.defaultArr[idx]')
				if (this._info !== null) this.updateSelf(self, idx);
			},
			toggleCheckbox(item,index,e) {
				let self = this,
					idx =index;
				this.defaultArr[idx].hideChoice = !this.defaultArr[idx].hideChoice
			},
			bindCheckboxChange(item,index,e) {
				// console.log(e, 'bindCheckboxChange');
				let self = this,
					idx =index,
					itemValue = e.detail.value;
				let defaultItem = this.defaultArr[idx]
				let defaultItemRange = defaultItem.meta.range

				defaultItem.selected.level = ''
				defaultItem.selected.value = itemValue
				defaultItemRange.forEach(d => {
					d.checked = false

					itemValue.forEach(i => {
						if (i == d.value) {
							d.checked = true

							defaultItem.selected.level = defaultItem.selected.level + d.name + ' '
						}
					})
				})
				defaultItem.selected.level = defaultItem.selected.level.trim()
				// console.log('defaultItem', defaultItem);

				if (this._info !== null) this.updateSelf(self, idx)

			},
			bindDateChange(item,index,e) {
				let self = this,
					idx = index;
				// this.defaultArr[idx].level = e.detail.value;
				this.defaultArr[idx].selected = {
					level: e.detail.value
				}
				// console.log(this.defaultArr[idx]);
				if (this._info !== null) this.updateSelf(self, idx);
			},
			bindRegionPickerChange(item,index,e) {
				let self = this,
					idx = index
				console.log(e.detail.value)
				console.log(e.detail.code)
				this.defaultArr[idx].selected = {
					value: (e.detail.code)[2],
					code: e.detail.code,
					region: e.detail.value
				}
				// console.log(this.defaultArr[idx])
				if (this._info !== null) this.updateSelf(self, idx);
			},
			bindSwitchChange(e) {
				let self = this,
					idx = e.currentTarget.dataset.idx;
				this.defaultArr[idx].selected = {
					value: e.detail.value
				}
				this.addSwitch = idx; // 常住地址户籍标志 户籍标志的索引
				if (!this.defaultArr[idx].selected.value) this.addSwitch = ''; //  如果是false 就隐藏 现居住址代码
				// console.log(this.defaultArr[idx], '244')
				if (this._info !== null) this.updateSelf(self, idx);
			},
			//确定提交
			submitTo() {
				/**
				 * @info中存在保存过的记录就直接跳转下一页
				 * @否则为新增表单请求finalObj再跳转
				 * 遍历this.defaultArr。
				 * 取出input项中 level
				 * 取出picker项中 selected
				 * 推入新数组
				 */
				// console.log(this.defaultArr, 'defaultArr');
				let defArr = this.defaultArr;
				let userId = '';
				let postObj = this.decoratePracs(defArr);
				let finalObj = {
					user_id: this.userId,
					template_id: 1,
					supplier_id: 2,
					pracs: []
				};
				// console.log('initialPracs', this.initialPracs);
				// 双循环过滤
				postObj.forEach(p => {
					const pStr = JSON.stringify(p)
					this.initialPracs.forEach(i => {
						const iStr = JSON.stringify(i)
						if (p.prac_id === i.prac_id) {
							if (pStr !== iStr) finalObj.pracs.push(p)
						}
					})
				})
				console.log('finalObj', finalObj);
				if (this.fillData.length > 0) {
					// 表示提交过，直接跳转病史
					uni.navigateTo({
						url: '/pages1/healthy/disease?userId=' + this.userId + '&infoId=' + this._infoId
					});
				} else {
					// 提交新建数据集
					addDataset( finalObj).then(res => {
						console.log(res);
						uni.navigateTo({
							url: '/pages1/healthy/disease?userId=' + this.userId + '&infoId=' +  + res.data.id
						});
					}).catch(err => {
						console.log(err);
						//toast.failToast('请输入正确的日期格式', 1500);
					});
				}
			},
			navigateToDisease() {
				console.log(12121)
				uni.navigateTo({
					url: '/pages1/healthy/disease?userId=' + this.userId + '&infoId=' + this._infoId
				});
			},
			navigateToTestRecord() {
				console.log(44444)
				uni.navigateTo({
					url: '/pages1/healthy/testrecord?userId=' + this.userId + '&infoId=' + this._infoId
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.basic {
		padding-bottom: 40rpx;
		background-color: #fff;

		.grow-1 {
			flex-grow: 1;
		}

		.block {
			display: block !important;
		}

		.none {
			display: none !important;
		}

		.info {
			min-height: 1025rpx;
			font-size: 32rpx;
			line-height: 45rpx;
			color: #9B9B9B;

			.section {
				padding: 20rpx 24rpx 20rpx 30rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1rpx solid #EFEFF0;

				&.checkbox {
					justify-content: unset;
				}

				.intro {
					// flex-grow: 1;
					width: 50%;
				}

				.value {
					// flex-grow: 2;
					display: flex;
					justify-content: space-between;
					align-items: center;
					text-align: right;

					&.checkbox {
						text-align: left;
						flex: 1;
						transition: all .5s;

						.level-text {
							flex: 1;
							text-align: right;
							word-wrap: break-word;
							word-break: break-all;
							overflow: hidden;
							min-height: 36rpx;
						}
					}

					.item-picker {
						height: 44rpx;
						flex-grow: 1;
					}

					.white {
						color: #fff;
					}

					.icon {
						margin-left: 11rpx;
						width: 12rpx !important;
						height: 20rpx !important;
						flex: 0 0 auto;
					}

					.empty {
						opacity: .3;
					}
				}
			}
		}

		.submit {
			margin: 40rpx auto 0 auto;
			padding: 0 38rpx;
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
</style>
