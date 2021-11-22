<template>
	<view class="fullwrap">
		<cu-custom :bgColor="NavBarColor" :isBack="true">
			<block slot="content">运动</block>
		</cu-custom>
		<view class="bluetooth">
			<!-- 搜索蓝牙 -->
			<view class="search-device" v-show="!connected">
				<view>
					<view class="title">蓝牙设备</view>
					<view class="tips">没有找到任何设备，请刷新！</view>
					<button class="search-btn" v-if=" !devices.length " @tap="openBluetoothAdapter">刷新</button>
				</view>
				<view v-for="(item,index) in deviceList" :key="index" index="index" item="item">
					<view class="device-list" @tap="createBLEConnection(index,item)">
						<!-- 	data-device-id="{{item.deviceId}}" data-name="{{item.name || item.localName}}" -->
						<view class="device-detail">
							<view class="device-name">{{ item.name }}</view>
							<view class="device-id">{{ item.deviceId }}</view>
						</view>
						<view v-if=" index === deviceIndex " class="choice-status choice">已连接</view>
						<view v-if=" index !== deviceIndex " class="choice-status">未连接</view>
					</view>
					<view class="space-line" v-if=" index !== deviceList.length-1 "></view>
				</view>
			</view>
			<!-- 蓝牙连接成功，开始运动 -->
			<view class="connect-device" v-if="connected">
				<video id="myVideo" :src="videoUrl" ontrols>
				</video>
				<view class="operation">
					<view class="op heart">
						<view class="op-value">
							{{ realTime&&realTime.value?realTime.value:'-' }} BMP
						</view>
						<view class="icon-wrap">
							<image class="op-icon" src="/static/images/bluetooth/heart-rate.png" mode="widthFill"
								lazy-load="false">
							</image>
							<text>心率</text>
						</view>
					</view>
					<view class="op timer">
						<view class="op-value">
							<text>{{ gap > 0 ? countdownStr : '00:00:00' }}</text>
						</view>
						<view class="icon-wrap">
							<image class="op-icon" src="/static/images/bluetooth/count-down.png" mode="widthFill"
								lazy-load="false">
							</image>
							<text>倒计时</text>
						</view>
					</view>
				</view>

				<view class="timer-step">
					<view class="timer-past" :style="{left:  playRate +'%'}"></view>
					<image v-if=" !timerPlay " @tap="play" class="timer-icon"
						src="/static/images/bluetooth/timer-play.png" mode="widthFill" lazy-load="false">
					</image>
					<image v-if=" timerPlay " @tap="pause" class="timer-icon"
						src="/static/images/bluetooth/timer-stop.png" mode="widthFill" lazy-load="false">
					</image>
				</view>
			</view>
		</view>
		<view v-show="showCover" class="timer-finish">
			<image @tap="finish" class="finish-icon" src="/static/images/bluetooth/timer-finish.png" mode="widthFill"
				lazy-load="false">
			</image>
		</view>
	</view>
</template>

<script>
	import {
		ACCESS_TOKEN
	} from '@/common/util/constants.js'
	import api from '@/api/api'
	import {
		actRecordSubmit,
		getUserInfoDetail
	} from '@/api/user.js'

	import {
		debounce,
		throttle
	} from "@/common/util/tool.js"


	function inArray(arr, key, val) {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i][key] === val) {
				return i;
			}
		}
		return -1;
	}
	// ArrayBuffer转16进制字符串
	function ab2hex(buffer) {
		var hexArr = Array.prototype.map.call(
			new Uint8Array(buffer),
			function(bit) {
				return ('00' + bit.toString(16)).slice(-2)
			}
		)
		return hexArr.join('');
	}

	function abc2hex(buffer) {
		var hexArr = Array.prototype.slice.call(new Int8Array(buffer));
		var heart = hexArr[1]
		return heart;
	}
	export default {
		data() {
			return {
				/**
				 * 上一级页面带入的变量
				 */
				sportId: '',
				/**
				 * 蓝牙连接部分变量
				 */
				devices: [], // 蓝牙设备数组
				deviceIndex: -1, // 选中的蓝牙设备
				connected: false,
				canWrite: false,
				chs: [],
				deviceId: '',
				name: '',
				_deviceId: '',
				_serviceId: '',
				_characteristicId: '',
				realTime: {},

				/**
				 * 视频流部分分变量
				 */
				videoContext: null,
				videoUrl: '',

				/**
				 * 计时器部分变量
				 */
				countdownStr: '',
				timer: null,
				target: 0, // 目标时间
				constgap: 0, // 上一级页面传入不变的分钟数
				gap: 0, // 断点分钟数
				timerPlay: false, // 计时器开关

				/**
				 * 发送请求
				 */
				showCover: false,
				heartSteam: [1], //心率信息列表
				finishLock: false,
			};
		},
		watch: {

		},
		computed: {
			//展示蓝牙列表
			deviceList() {
				return this.devices.map(item => {
					const idArray = item.deviceId.split('-');
					const deviceId = idArray.pop();
					const list = Object.assign({}, item, {
						deviceId: deviceId
					})

					return list
				})
			},
			//进度条长度
			playRate() {
				const total = this.constgap * 60 * 1000,
					gap = this.gap * 60 * 1000;

				const rate = (total - gap) / total
				return rate * 100
			},
		},
		//页面的生命周期函数
		onLoad(option) {
			this.sportId = option.id;

			this.gap = this.constgap = option.time || 0;
			// this.gap = this.constgap = 1;
			this.target = Date.now() + this.gap * 60 * 1000;
			//格式化展示时间
			this.countdown();
			// 唤醒屏幕
			uni.setKeepScreenOn({
				keepScreenOn: true
			})
			//this.submit();
			// 视频地址
			this.videoUrl = 'https://vod.schillerchina.com/sv/11575658-16a2a9a53cd/11575658-16a2a9a53cd.mp4';
		},
		methods: {


			// ------------------计时部分
			//格式化展示时间
			countdown() {
				let nowTime = Date.now(),
					timeStr = +new Date(this.target - nowTime) / 1000; // 秒数

				let lefthour = Math.floor((timeStr) / 3600),
					leftminute = Math.floor((timeStr - lefthour * 3600) / 60),
					leftsecond = Math.floor(timeStr - lefthour * 3600 - leftminute * 60);
				//倒计时展示
				this.countdownStr =
					`${lefthour > 9 ? lefthour : `0${lefthour}`}:${leftminute > 9 ? leftminute : `0${leftminute}`}:${leftsecond > 9 ? leftsecond : `0${leftsecond}`}`;
				this.gap = timeStr / 60;
			},
			// 继续倒计时，当运动结束的时候，提交数据
			offset() {
				this.target = Date.now() + this.gap * 60 * 1000; // 毫秒数

				this.timer = setInterval(() => {
					if (this.gap < 0) {
						// 控制开关
						this.timerPlay = false;

						// 清除计时器
						clearInterval(this.timer)

						this.submit();
					}
					this.countdown();

				}, 1000);
			},
			//提交运动数据
			submit() {
				const _data = {
					bpm: this.heartSteam,
					user_id: this.$store.getters.otherId
				}
				console.log("xinlushuju ---------")
				console.log(_data)
				console.log(this.sportId)
				actRecordSubmit({
					id: this.sportId,
					data: _data,
				}).then(res => {
					console.log("guanbilanya1")
					console.log(res);
					this.showCover = true;
					uni.closeBluetoothAdapter()
					uni.closeBLEConnection({
						deviceId: this._deviceId,
						success(res) {
							console.log("guanbilanya2")
							console.log(res)
						}
					})
				}).catch(err => {
					console.log(err);
					console.log("guanbilanya3")
					//this.showCover = true;
				});
			},
			// ------------------计时部分
			// ------------------蓝牙部分
			// 蓝牙未连接的时候 点击刷新按钮  初始化蓝牙模块
			openBluetoothAdapter() {
				uni.openBluetoothAdapter({
					success: (res) => {
						console.log('openBluetoothAdapter success', res)
						this.startBluetoothDevicesDiscovery()
					},
					fail: (res) => {
						console.log('没执行');
						if (res.errCode === 10001) {
							this.$tip.toast("蓝牙未打开！")
							// 监听蓝牙适配器状态变化事件
							uni.onBluetoothAdapterStateChange((res) => {
								console.log('onBluetoothAdapterStateChange', res)
								if (res.available) {
									this.startBluetoothDevicesDiscovery()
								}
							})
						}
					}
				})
			},
			// 开始搜寻附近的蓝牙外围设备。此操作比较耗费系统资源，搜索并连接到设备后调用 uni.stopBluetoothDevicesDiscovery 方法停止搜索。
			startBluetoothDevicesDiscovery() {
				console.log('执行');
				if (this._discoveryStarted) {
					return
				}
				this._discoveryStarted = true
				uni.startBluetoothDevicesDiscovery({
					allowDuplicatesKey: true,
					success: (res) => {
						console.log('startBluetoothDevicesDiscovery success', res)
						this.onBluetoothDeviceFound()
					},
				})
			},
			// 监听寻找到新设备的事件
			onBluetoothDeviceFound() {
				setTimeout(() => {
					this.stopBluetoothDevicesDiscovery();
				}, 5000)
				//监听寻找到新设备的事件
				uni.onBluetoothDeviceFound((res) => {
					console.log(res, '找设备');
					res.devices.forEach(device => {
						if (!device.name && !device.localName) {
							return
						}
						const foundDevices = this.devices
						const idx = inArray(foundDevices, 'deviceId', device.deviceId);
						if (idx === -1) {
							this.devices.push(device)
						}
					})

				})
			},
			//点击蓝牙列表，连接蓝牙
			createBLEConnection(index, item) {
				/**
				 * @todo 此处要拿到未切割的deviceId
				 */
				console.log(index);
				
				const _deviceId = item.deviceId
				const device = this.devices.find(item => {
					const idArr = item.deviceId.split('-');
					const lastId = idArr.pop();
					if (lastId === _deviceId) {
						return item
					}
				})
				const deviceId = device.deviceId
				const name = device.name
				console.log(deviceId, name);
				// 连接低功耗蓝牙设备。
				// 若APP在之前已有搜索过某个蓝牙设备，并成功建立连接，可直接传入之前搜索获取的 deviceId 直接尝试连接该设备，无需进行搜索操作
				uni.createBLEConnection({
					deviceId,
					success: (res) => {
						console.log(res, 'createBLEConnection');
						this.deviceIndex = index;
						this.connected = true,
							this.name = name,
							this.deviceId = deviceId,

							console.log(this.connected, this.name, this.deviceId, '000');
						this.getBLEDeviceServices(deviceId)
					},
					fail: (err) => {
						console.log(err);
						this.$tip.toast(err.errMsg||"连接失败")
					}
				})

				this.stopBluetoothDevicesDiscovery()
			},
			// ------------------蓝牙部分
			// ------------------蓝牙部分

			// 停止搜寻附近的蓝牙外围设备。若已经找到需要的蓝牙设备并不需要继续搜索时，建议调用该接口停止蓝牙搜索。
			stopBluetoothDevicesDiscovery() {
				uni.stopBluetoothDevicesDiscovery()
			},
			// 建立蓝牙连接通信
			getBLEDeviceServices(deviceId) {
				//获取蓝牙设备所有服务(service)。
				uni.getBLEDeviceServices({
					deviceId,
					success: (res) => {
						console.log(res, 'getBLEDeviceServices');
						for (let i = 0; i < res.services.length; i++) {
							if (res.services[i].isPrimary) {
								this.getBLEDeviceCharacteristics(deviceId, res.services[i].uuid)
								return
							}
						}
					}
				})
			},
			//获取蓝牙设备某个服务中所有特征值(characteristic)。。
			getBLEDeviceCharacteristics(deviceId, serviceId) {
				let that = this
				uni.getBLEDeviceCharacteristics({
					deviceId,
					serviceId,
					success: (res) => {
						console.log('getBLEDeviceCharacteristics success', res.characteristics)
					
						  let flag=1
						for (let i = 0; i < res.characteristics.length; i++) {
							let item = res.characteristics[i]
							if (item.properties.read) {
								//读取低功耗蓝牙设备的特征值的二进制数据值。注意：必须设备的特征值支持 read 才可以成功调用
								uni.readBLECharacteristicValue({
									deviceId,
									serviceId,
									characteristicId: item.uuid,
									success(res) {
										console.log('readBLECharacteristicValue:', res.errCode)
									}
								})
							}
							if (item.properties.write) {
								this.canWrite = true
								this._deviceId = deviceId
								this._serviceId = serviceId
								this._characteristicId = item.uuid

								// console.log(this._deviceId, this._serviceId, this._characteristicId, '123');
								this.writeBLECharacteristicValue()
							}
							//启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。注意：必须设备的特征值支持 notify 或者 indicate 才可以成功调用。 另外，必须先启用 notifyBLECharacteristicValueChange 才能监听到设备 characteristicValueChange 事件
							if (item.properties.notify || item.properties.indicate) {

                                
								wx.notifyBLECharacteristicValueChange({
									deviceId,
									serviceId,
									characteristicId: item.uuid,
									state: true,
									type:"notification",
									success(res) {
										console.log('notifyBLECharacteristicValueChange 111success',
											res
											.errMsg)
											if(flag==1){
												flag=2
												setTimeout(()=>{
													console.log("开始监听变化2")
													// wx.onBLECharacteristicValueChange((characteristic) => {
													// 	console.log("abc2hex(characteristic.value)")
													// 	console.log(abc2hex(characteristic.value))
													// 	const idx = inArray(that.chs, 'uuid',
													// 		characteristic.characteristicId)
													
													// 	const data = {}
													
													// 	data.uuid = characteristic.characteristicId;
													// 	data.value = abc2hex(characteristic.value)
													
													// 	that.realTime = Object.assign(that.realTime,
													// 		data);
													
													// 	if (that.timerPlay) {
													// 		that.heartSteam.push(data.value)
													// 	}
													
													// })
												},3000)
											}else{
												setTimeout(()=>{
													console.log("开始监听变化1")
										
												},9000)
											}

										// 操作之前先监听，保证第一时间获取数据
										//监听低功耗蓝牙设备的特征值变化事件。必须先启用 notifyBLECharacteristicValueChange 接口才能接收到设备推送的 notification。
							       


									}
								})


							}
						}
					},
					fail(res) {
						console.error('getBLEDeviceCharacteristics fail', res)
					}
				})
				wx.onBLECharacteristicValueChange((characteristic) => {
					console.log("abc2hex(characteristic.value)")
					console.log(abc2hex(characteristic.value))
					const idx = inArray(that.chs, 'uuid',
						characteristic.characteristicId)
				
					const data = {}
				
					data.uuid = characteristic.characteristicId;
					data.value = abc2hex(characteristic.value)
				
					that.realTime = Object.assign(that.realTime,
						data);
				
					if (that.timerPlay) {
						that.heartSteam.push(data.value)
					}
				
				})

		
			},
			// 写数据
			writeBLECharacteristicValue() {
				// 向蓝牙设备发送一个0x00的16进制数据
				let buffer = new ArrayBuffer(1)
				let dataView = new DataView(buffer)
				dataView.setUint8(0, Math.random() * 255 | 0)

				uni.writeBLECharacteristicValue({
					deviceId: this._deviceId,
					serviceId: this._serviceId,
					characteristicId: this._characteristicId,
					value: buffer,
				})
			},
			// ------------------蓝牙部分

			// ------------------计时部分
			// 其他方法：http://js.jirengu.com/xiruputivu/1/edit?html,console,output
			// 暂停
			pause() {
				this.timerPlay = false;
				clearTimeout(this.timer);
			},
			// 继续倒计时
			play() {
				if (!this.constgap) {
					return
				}
				this.timerPlay = true;
				this.offset();
			},
			// ------------------计时部分
			goOtherPage() {

				// // 跳转页面
				// uni.navigateTo({
				// 	url: '/pages1/recipe/motion'
				// });
				uni.navigateBack({
				    delta: 2
				});
			},
			// ------------------完成请求
			finish: throttle(function() {
				// 更新个人信息
				//获取用户的所有信息
				let _data;
				let id = this.$store.getters.otherId
				console.log(this.$store.getters.otherId)
				if (id) {
					//获取亲友信息
					getUserInfoDetail({
						params: {
							id
						}
					}).then((res) => {
						_data = res.data
						this.showCover = false
						this.$store.commit('SET_CURRENTUSERINFO', res.data)
						this.goOtherPage()
					})
				} else {
					//获取本人信息
					this.$store.dispatch("getCurrentUserInfo", {
						token: uni.getStorageSync(ACCESS_TOKEN),
						refresh: true
					}).then((res) => {
						this.showCover = false
						this.goOtherPage()

					})
				}




				// // 切掉多余的时间
				// if (_data.hasOwnProperty('birthday') && _data.birthday !== null) _data.birthday =
				// 	spliceTimeStr(_data.birthday);
				uni.setStorage({
					key: 'tableList',
					data: _data,
					success: res => {

					}
				});

			}, 2000)
			// ------------------完成请求
		}
	}
</script>

<style lang="scss" scoped>
	.fullwrap {
		height: 100%;
		width: 100%;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}

	.bluetooth {
		flex-grow: 1;
		position: relative;
		height: 100%;

		.search-device {
			box-sizing: border-box;
			padding: 30rpx 40rpx;
			font-size: 30rpx;
			line-height: 42rpx;

			.title {
				margin: 10px 0;
			}

			.tips {
				font-size: 28rpx;
				font-weight: 400;
				line-height: 40rpx;
				color: rgba(77, 126, 205, 1);
			}

			.search-btn {
				margin: 97rpx 0 0;
				font-size: 32rpx;
			}

			.device-list {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 10rpx 20rpx 10rpx 40rpx;
				font-size: 30rpx;
				font-weight: 400;
				line-height: 42rpx;

				.device-detail {

					.device-name {
						font-size: 32rpx;
						font-weight: 500;
						color: rgba(74, 74, 74, 1);
						line-height: 45rpx;
					}

					.device-id {
						color: rgba(144, 145, 147, 1);

					}
				}

				.choice-status {
					color: rgba(144, 145, 147, 1);
				}

				.choice {
					color: rgba(77, 126, 205, 1);
				}
			}

			.space-line {
				height: 1px;
				background: #dddddd;
			}
		}

		.connect-device {
			display: flex;
			flex-direction: column;
			box-sizing: border-box;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;

			#myVideo {
				flex-grow: 7;
				width: 100%;
			}

			.operation {
				display: flex;
				justify-content: space-between;
				background: rgba(235, 232, 235, 1);


				.op {
					width: 50%;
					padding: 20rpx 78rpx 36rpx 78rpx;

					.op-value {
						margin: 0 0 10rpx 50rpx;
					}

					.icon-wrap {
						display: flex;
						align-items: center;

						.op-icon {
							margin-right: 28rpx;
						}
					}
				}

				.heart .op-icon {
					width: 57rpx;
					height: 49rpx;
				}

				.timer .op-icon {
					width: 46rpx;
					height: 50rpx;
				}
			}

			.timer-step {
				flex-grow: 2;
				position: relative;
				background: rgba(77, 126, 205, 0.5);
				height: 160rpx;

				.timer-past {
					background: rgba(242, 242, 243, 1);
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					z-index: 1;
				}

				.timer-icon {
					position: absolute;
					z-index: 2;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					width: 29rpx;
					height: 52rpx;
					margin: 0 auto;
				}
			}


		}
	}

	.timer-finish {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		z-index: 10000;
		background: rgba(0, 0, 0, 0.4);

		.finish-icon {
			width: 600rpx;
			height: 600rpx;
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			margin: auto;
		}
	}

	.show {
		position: absolute;
		z-index: 2;
		width: 750rpx;
	}

	.hide {
		position: absolute;
		z-index: 1;
		width: 750rpx;
		opacity: 0;
	}
</style>
