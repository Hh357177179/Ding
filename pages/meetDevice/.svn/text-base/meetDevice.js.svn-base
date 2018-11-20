const util = require('../../util')
import { getRequest } from '../../httpRequest'
const app = getApp()
let deviceThis = null

Page({
  data: {
		panelAllshow: false,
		panelItem: {},
		nowdates: '',
		openTimes: '',
		airNodeId: '',
		panelShow: '',
		setVal: '',
		airItem: {},
		airPanelShow: false,
		meetInfo: {},
		meetRoomid: '',
		meetDeviceArr: [],
		areaName: '',
		scenceArr: [],
		openDoorTime: '',
		sendDataStr: '',
		propcode: 'Switch',
		nowDate: '',
		openText: false,
		doorId: '',
		sObj: {
			arg: {
				prop_code: '',
				prop_value_code: '',
				set_para_1: '',
				device_node_id: '',
				device_mac: '',
				host_code: '',
				plant_code: '',
				device_type_sts_code: ''
			},
			request_time: '',
			user_id: '',
			user_token: '123',
			request_cmd: '',
			reply_queue_name: 'StS.st',
			enterprise_id: '',
			enterprise_code: ''
		}
	},
  onLoad(options) {
		let that = this
		let Dates = new Date()
		let years = Dates.getFullYear()
		let months = Dates.getMonth() + 1
		let days = Dates.getDate()
		let hours = Dates.getHours()
		let mins = Dates.getMinutes()
		let secds = Dates.getSeconds()
		that.setData({
			nowDate: `${years}/${months}/${days} ${hours}:${mins}:${secds}`
		})
		let deviceThis = this
		let optStr = JSON.parse(options.strmeet)
		// console.log(optStr)
		that.setData({
			meetInfo: optStr,
			meetRoomid: optStr.meetRoomId,
			openDoorTime: optStr.start
		})
		that.getMeetDevice()
		that.getMeetScence()

		let meetTime = `${that.data.meetInfo.date.replace(/\-/g, "/")} ${that.data.meetInfo.start}`
		let openTimes = new Date(meetTime).getTime() - 15 * 60 * 1000
		// console.log(openTimes)
		let nowdates = new Date(that.data.nowDate).getTime()
		// console.log(nowdates)
		if (openTimes > nowdates) {
			that.setData({
				openText: true,
				openTimes: openTimes,
				nowdates: nowdates
			})
		}
		// if (app.globalData.DingSocket == 1) {
			// that.sendDatas(app.globalData.userId)
		// }

		dd.onSocketMessage(function(e) {
			// console.log(JSON.parse(e.data).requester)
			let devicePush = JSON.parse(e.data).device_info
			// 接收改变设备当前状态
			if (JSON.parse(e.data).requester == 'DeviceStatus') {
				if (devicePush.device_node_id == deviceThis.data.doorId) {
					if (devicePush.device_status.doorsensor_switch == "On") {
						util.showMsg('success', '开门成功')
					}
				}
				// console.log('接收推送到的参数',devicePush)
				// console.log(devicePush.device_type_sts_code)
				if (devicePush.device_type_sts_code == 'Sts_ZIGBEE_Light' || devicePush.device_type_sts_code == 'Sts_ZIGBEE_FancoilUnit' || devicePush.device_type_sts_code == 'Sts_ZIGBEE_CodedLock' || devicePush.device_type_sts_code == 'Sts_ZIGBEE_ProjectionCurtainMotor' || devicePush.device_type_sts_code == 'Sts_ZIGBEE_CurtainMotor' || devicePush.device_type_sts_code == 'Sts_ZIGBEE_WindowPusherMotor') {
					console.log('设备')
					console.log('接收推送到的参数', devicePush)
					let device_index = deviceThis.data.meetDeviceArr.findIndex(d => d.device_node_id == devicePush.device_node_id)
						console.log(device_index)
					if (device_index >= 0) {
						deviceThis.data.meetDeviceArr.splice(device_index, 1, devicePush)
						// console.log(1,deviceThis.data.meetDeviceArr.splice(device_index, 1, devicePush)),
						// console.log(2,deviceThis.data.meetDeviceArr)
						deviceThis.setData({
							meetDeviceArr: deviceThis.data.meetDeviceArr
						})
					}
					if (deviceThis.data.airNodeId == devicePush.device_node_id && deviceThis.data.panelShow == true) {
						deviceThis.setData({
							airItem: devicePush,
							setVal: parseFloat(devicePush.device_status.set_num_value).toFixed(1),
						})
					}
					if (deviceThis.data.airNodeId == devicePush.device_node_id && deviceThis.data.panelAllshow == true) {
						deviceThis.setData({
							panelItem: devicePush
						})
					}
				}
			}
		});
	},

	// 单点设备操作
	tapDevice (e) {
		if (this.data.openTimes > this.data.nowdates) {
			util.showMsg('fail', '会议开始前15分钟可操作设备')
		} else {
			// console.log(e)
			let eValue = e.currentTarget.dataset
			let valuCode = eValue.propVal
		if (eValue.deviceType != 'Sts_ZIGBEE_FancoilUnit' && eValue.deviceType != 'Sts_ZIGBEE_CurtainMotor' && eValue.deviceType != 'Sts_ZIGBEE_ProjectionCurtainMotor' && eValue.deviceType != 'Sts_ZIGBEE_WindowPusherMotor') {
				if (valuCode == 'On') {
					valuCode = "Off"
				} else {
					valuCode = "On"
				}
				let sendObj = {}
				sendObj.arg = {
					"prop_code": this.data.propcode,
					"prop_value_code": valuCode,
					"device_node_id": eValue.nodeId,
					"device_mac": eValue.mac,
					"host_code": eValue.hcode,
					"plant_code": eValue.plantCode,
					"device_type_sts_code": eValue.deviceType
				}
				sendObj.request_time = this.data.nowDate,
				sendObj.user_id = app.globalData.userId,
				sendObj.user_token = '123',
				sendObj.request_cmd = "Switch",
				sendObj.reply_queue_name = `StS.st.${app.globalData.userId}`,
				sendObj.enterprise_id = eValue.enterId,
				sendObj.enterprise_code = eValue.enterCode
				console.log(123123, sendObj)
				this.sendDatas(JSON.stringify(sendObj))
			} else if (eValue.deviceType == 'Sts_ZIGBEE_FancoilUnit') {
				// let airItem = eValue.item
				let airItem = this.data.meetDeviceArr.filter(x => x.device_node_id == eValue.nodeId)
				// console.log(airItem)
				this.setData({
					airPanelShow: true,
					panelShow: true,
					airItem: airItem[0],
					setVal: parseFloat(airItem[0].device_status.set_num_value).toFixed(1),
					airNodeId: eValue.nodeId
				})
			} else {
				let airItem = this.data.meetDeviceArr.filter(x => x.device_node_id == eValue.nodeId)
				console.log(airItem)
				this.setData({
					airPanelShow: true,
					panelItem: airItem[0],
					panelAllshow: true,
					airNodeId: eValue.nodeId
				})
			}
		}
	},

	// 开
	handleOpen () {
		let that = this
		let sendObj = {}
		sendObj.arg = {
			"prop_code": 'Switch',
			"prop_value_code": 'On',
			"device_node_id": that.data.panelItem.device_node_id,
			"device_mac": that.data.panelItem.device_mac,
			"host_code": that.data.panelItem.host_code,
			"plant_code": that.data.panelItem.plant_code,
			"device_type_sts_code": that.data.panelItem.device_type_sts_code
		}
		sendObj.request_time = that.data.nowDate,
		sendObj.user_id = app.globalData.userId,
		sendObj.user_token = '123',
		sendObj.request_cmd = "Switch",
		sendObj.reply_queue_name = `StS.st.${app.globalData.userId}`,
		sendObj.enterprise_id = that.data.panelItem.enterprise_id,
		sendObj.enterprise_code = that.data.panelItem.enterprise_code
		console.log(2222, sendObj)
		that.sendDatas(JSON.stringify(sendObj))
	},

	// 停
	handleStop () {
		let that = this
		let sendObj = {}
		sendObj.arg = {
			"prop_code": 'Switch',
			"prop_value_code": 'Stop',
			"device_node_id": that.data.panelItem.device_node_id,
			"device_mac": that.data.panelItem.device_mac,
			"host_code": that.data.panelItem.host_code,
			"plant_code": that.data.panelItem.plant_code,
			"device_type_sts_code": that.data.panelItem.device_type_sts_code
		}
		sendObj.request_time = that.data.nowDate,
		sendObj.user_id = app.globalData.userId,
		sendObj.user_token = '123',
		sendObj.request_cmd = "Switch",
		sendObj.reply_queue_name = `StS.st.${app.globalData.userId}`,
		sendObj.enterprise_id = that.data.panelItem.enterprise_id,
		sendObj.enterprise_code = that.data.panelItem.enterprise_code
		console.log(2222, sendObj)
		that.sendDatas(JSON.stringify(sendObj))
	},

	// 关
	handleClose () {
		let that = this
		let sendObj = {}
		sendObj.arg = {
			"prop_code": 'Switch',
			"prop_value_code": 'Off',
			"device_node_id": that.data.panelItem.device_node_id,
			"device_mac": that.data.panelItem.device_mac,
			"host_code": that.data.panelItem.host_code,
			"plant_code": that.data.panelItem.plant_code,
			"device_type_sts_code": that.data.panelItem.device_type_sts_code
		}
		sendObj.request_time = that.data.nowDate,
		sendObj.user_id = app.globalData.userId,
		sendObj.user_token = '123',
		sendObj.request_cmd = "Switch",
		sendObj.reply_queue_name = `StS.st.${app.globalData.userId}`,
		sendObj.enterprise_id = that.data.panelItem.enterprise_id,
		sendObj.enterprise_code = that.data.panelItem.enterprise_code
		console.log(2222, sendObj)
		that.sendDatas(JSON.stringify(sendObj))
	},

	// 减
	subtractIcon () {
		let that = this
		console.log('减', that.data.setVal)
		if (that.data.setVal > 10) {
			// that.setData({
			// 	setVal: (parseFloat(that.data.setVal) - 0.5).toFixed(1)
			// })
			let num = (parseFloat(that.data.setVal) - 0.5).toFixed(1)
			let sendObj = {}
			sendObj.arg = {
				"prop_code": 'Set_Temperature',
				"prop_value_code": '',
				"set_para_1": num,
				"device_node_id": that.data.airItem.device_node_id,
				"device_mac": that.data.airItem.device_mac,
				"host_code": that.data.airItem.host_code,
				"plant_code": that.data.airItem.plant_code,
				"device_type_sts_code": that.data.airItem.device_type_sts_code
			}
			sendObj.request_time = that.data.nowDate,
			sendObj.user_id = app.globalData.userId,
			sendObj.user_token = '123',
			sendObj.request_cmd = "Set_FanCoilin_Action",
			sendObj.reply_queue_name = `StS.st.${app.globalData.userId}`,
			sendObj.enterprise_id = that.data.airItem.enterprise_id,
			sendObj.enterprise_code = that.data.airItem.enterprise_code
			console.log(2222, sendObj)
			that.sendDatas(JSON.stringify(sendObj))
		}
	},

	// 加
	addIcon () {
		let that = this
		console.log('加', that.data.setVal)
		if (that.data.setVal < 40) {
			let num = (parseFloat(that.data.setVal) + 0.5).toFixed(1)
			// that.setData({
			// 	setVal: (parseFloat(that.data.setVal) + 0.5).toFixed(1)
			// })
			let sendObj = {}
			sendObj.arg = {
				"prop_code": 'Set_Temperature',
				"prop_value_code": '',
				"set_para_1": num,
				"device_node_id": that.data.airItem.device_node_id,
				"device_mac": that.data.airItem.device_mac,
				"host_code": that.data.airItem.host_code,
				"plant_code": that.data.airItem.plant_code,
				"device_type_sts_code": that.data.airItem.device_type_sts_code
			}
			sendObj.request_time = that.data.nowDate,
			sendObj.user_id = app.globalData.userId,
			sendObj.user_token = '123',
			sendObj.request_cmd = "Set_FanCoilin_Action",
			sendObj.reply_queue_name = `StS.st.${app.globalData.userId}`,
			sendObj.enterprise_id = that.data.airItem.enterprise_id,
			sendObj.enterprise_code = that.data.airItem.enterprise_code
			console.log(2222, sendObj)
			that.sendDatas(JSON.stringify(sendObj))
		}
	},

	// 关闭空调面板
	closeMask () {
		this.setData({
			airPanelShow: false,
			panelShow: false,
			panelAllshow: false
		})
	},

	// 滑动选择温度
	changeSlider (e) {
		// console.log('slider 改变后的值:', e.detail.value)
		let that = this
		// that.setData({
		// 	setVal: parseFloat(e.detail.value).toFixed(1)
		// })
			let num = parseFloat(e.detail.value).toFixed(1)
			let sendObj = {}
			sendObj.arg = {
				"prop_code": 'Set_Temperature',
				"prop_value_code": '',
				"set_para_1": num,
				"device_node_id": that.data.airItem.device_node_id,
				"device_mac": that.data.airItem.device_mac,
				"host_code": that.data.airItem.host_code,
				"plant_code": that.data.airItem.plant_code,
				"device_type_sts_code": that.data.airItem.device_type_sts_code
			}
			sendObj.request_time = that.data.nowDate,
			sendObj.user_id = app.globalData.userId,
			sendObj.user_token = '123',
			sendObj.request_cmd = "Set_FanCoilin_Action",
			sendObj.reply_queue_name = `StS.st.${app.globalData.userId}`,
			sendObj.enterprise_id = that.data.airItem.enterprise_id,
			sendObj.enterprise_code = that.data.airItem.enterprise_code
			console.log(2222, sendObj)
			that.sendDatas(JSON.stringify(sendObj))
	},

	// 开门
	tapOpenDoor () {
		console.log('开门')
		let doorObj = this.data.meetDeviceArr.filter(x => x.device_type_sts_code == 'Sts_ZIGBEE_CodedLock')
		console.log(doorObj)
		this.setData({
			// doorObj: doorObj,
			doorId: doorObj[0].device_node_id
		})
		let sendObj = {}
		sendObj.arg = {
			"prop_code": 'Switch',
			"prop_value_code": 'On',
			"set_para_1": '123456',
			"device_node_id": doorObj[0].device_node_id,
			"device_mac": doorObj[0].device_mac,
			"host_code": doorObj[0].host_code,
			"plant_code": doorObj[0].plant_code,
			"device_type_sts_code": doorObj[0].device_type_sts_code
		}
		sendObj.request_time = this.data.nowDate,
		sendObj.user_id = app.globalData.userId,
		sendObj.user_token = '123',
		sendObj.request_cmd = "Switch",
		sendObj.reply_queue_name = `StS.st.${app.globalData.userId}`,
		sendObj.enterprise_id = doorObj[0].enterprise_id,
		sendObj.enterprise_code = doorObj[0].enterprise_code
		console.log(sendObj)
		this.sendDatas(JSON.stringify(sendObj))
	},

	// 发送数据
	sendDatas (params) {
		// console.log(params)
		dd.sendSocketMessage({
			data: params,
			success(e) {
				console.log('发送成功' + JSON.stringify(e));
			},
			fail(e) {
				console.log('发送失败' + JSON.stringify(e));
			}
		})
	},

	// 开启关闭空调
	openAir (e) {
		let that = this
		let airsObj = that.data.meetDeviceArr.filter(x => x.device_node_id == that.data.airItem.device_node_id)
		console.log(123,airsObj)
		let openState = airsObj[0].device_status.switch
		let dType = e.currentTarget.dataset.dtype
		if (openState == 'On') {
			openState = "Off"
		} else {
			openState = "On"
		}
		let sendObj = {}
		sendObj.arg = {
			"prop_code": 'Switch',
			"prop_value_code": openState,
			"device_node_id": airsObj[0].device_node_id,
			"device_mac": airsObj[0].device_mac,
			"host_code": airsObj[0].host_code,
			"plant_code": airsObj[0].plant_code,
			"device_type_sts_code": airsObj[0].device_type_sts_code
		}
		sendObj.request_time = that.data.nowDate,
		sendObj.user_id = app.globalData.userId,
		sendObj.user_token = '123',
		sendObj.request_cmd = "Switch",
		sendObj.reply_queue_name = `StS.st.${app.globalData.userId}`,
		sendObj.enterprise_id = airsObj[0].enterprise_id,
		sendObj.enterprise_code = airsObj[0].enterprise_code
		console.log(sendObj)
		that.sendDatas(JSON.stringify(sendObj))
	},

	// 送风模式选择风速
	cWinds (e) {
		let blowing = e.currentTarget.dataset.winds
		// console.log('送风模式-风速', blowing)
		let that = this
		// let airsObj = that.data.meetDeviceArr.filter(x => x.device_node_id == that.data.airItem.device_node_id)
		// console.log(123, that.data.airItem)
		// let openState = that.data.airItem.device_status.speed
		if (blowing == 'LOW') {
			blowing = "MID"
		} else if (blowing == "MID") {
			blowing = "HIGH"
		} else if(blowing == "HIGH" ) {
			blowing = "LOW"
		}
		let sendObj = {}
		sendObj.arg = {
			"prop_code": 'Set_Speed',
			"prop_value_code": blowing,
			"device_node_id": that.data.airItem.device_node_id,
			"device_mac": that.data.airItem.device_mac,
			"host_code": that.data.airItem.host_code,
			"plant_code": that.data.airItem.plant_code,
			"device_type_sts_code": that.data.airItem.device_type_sts_code
		}
		sendObj.request_time = that.data.nowDate,
		sendObj.user_id = app.globalData.userId,
		sendObj.user_token = '123',
		sendObj.request_cmd = "Set_FanCoilin_Action",
		sendObj.reply_queue_name = `StS.st.${app.globalData.userId}`,
		sendObj.enterprise_id = that.data.airItem.enterprise_id,
		sendObj.enterprise_code = that.data.airItem.enterprise_code
		console.log(2222,sendObj)
		that.sendDatas(JSON.stringify(sendObj))
	},

	// 制冷制热选择送风
	makeWinds (e) {
		let that = this
		let makewind = e.currentTarget.dataset.winds
		console.log('冷热模式-风速', makewind)
		if (makewind == 'AUTO') {
			makewind = 'LOW'
		} else if (makewind == 'LOW') {
			makewind = 'MID'
		} else if (makewind == 'MID') {
			makewind = 'HIGH'
		} else if (makewind == 'HIGH') {
			makewind = 'AUTO'
		}
		let sendObj = {}
		sendObj.arg = {
			"prop_code": 'Set_Speed',
			"prop_value_code": makewind,
			"device_node_id": that.data.airItem.device_node_id,
			"device_mac": that.data.airItem.device_mac,
			"host_code": that.data.airItem.host_code,
			"plant_code": that.data.airItem.plant_code,
			"device_type_sts_code": that.data.airItem.device_type_sts_code
		}
		sendObj.request_time = that.data.nowDate,
		sendObj.user_id = app.globalData.userId,
		sendObj.user_token = '123',
		sendObj.request_cmd = "Set_FanCoilin_Action",
		sendObj.reply_queue_name = `StS.st.${app.globalData.userId}`,
		sendObj.enterprise_id = that.data.airItem.enterprise_id,
		sendObj.enterprise_code = that.data.airItem.enterprise_code
		console.log(2222, sendObj)
		that.sendDatas(JSON.stringify(sendObj))
	},

	// 选择制冷
	cCold () {
		let that = this
		console.log('制冷模式')
		let sendObj = {}
		sendObj.arg = {
			"prop_code": 'Set_Model_Work',
			"prop_value_code": "COLD",
			"device_node_id": that.data.airItem.device_node_id,
			"device_mac": that.data.airItem.device_mac,
			"host_code": that.data.airItem.host_code,
			"plant_code": that.data.airItem.plant_code,
			"device_type_sts_code": that.data.airItem.device_type_sts_code
		}
		sendObj.request_time = that.data.nowDate,
		sendObj.user_id = app.globalData.userId,
		sendObj.user_token = '123',
		sendObj.request_cmd = "Set_FanCoilin_Action",
		sendObj.reply_queue_name = `StS.st.${app.globalData.userId}`,
		sendObj.enterprise_id = that.data.airItem.enterprise_id,
		sendObj.enterprise_code = that.data.airItem.enterprise_code
		console.log(2222, sendObj)
		that.sendDatas(JSON.stringify(sendObj))
	},

	// 选择制热
	cHot () {
		console.log('制热模式')
		let that = this
		let sendObj = {}
		sendObj.arg = {
			"prop_code": 'Set_Model_Work',
			"prop_value_code": "HOT",
			"device_node_id": that.data.airItem.device_node_id,
			"device_mac": that.data.airItem.device_mac,
			"host_code": that.data.airItem.host_code,
			"plant_code": that.data.airItem.plant_code,
			"device_type_sts_code": that.data.airItem.device_type_sts_code
		}
		sendObj.request_time = that.data.nowDate,
		sendObj.user_id = app.globalData.userId,
		sendObj.user_token = '123',
		sendObj.request_cmd = "Set_FanCoilin_Action",
		sendObj.reply_queue_name = `StS.st.${app.globalData.userId}`,
		sendObj.enterprise_id = that.data.airItem.enterprise_id,
		sendObj.enterprise_code = that.data.airItem.enterprise_code
		console.log(2222, sendObj)
		that.sendDatas(JSON.stringify(sendObj))
	},

	// 送风
	cSend () {
		console.log('送风模式')
		let that = this
		let sendObj = {}
		sendObj.arg = {
			"prop_code": 'Set_Model_Work',
			"prop_value_code": "WIND",
			"device_node_id": that.data.airItem.device_node_id,
			"device_mac": that.data.airItem.device_mac,
			"host_code": that.data.airItem.host_code,
			"plant_code": that.data.airItem.plant_code,
			"device_type_sts_code": that.data.airItem.device_type_sts_code
		}
		sendObj.request_time = that.data.nowDate,
		sendObj.user_id = app.globalData.userId,
		sendObj.user_token = '123',
		sendObj.request_cmd = "Set_FanCoilin_Action",
		sendObj.reply_queue_name = `StS.st.${app.globalData.userId}`,
		sendObj.enterprise_id = that.data.airItem.enterprise_id,
		sendObj.enterprise_code = that.data.airItem.enterprise_code
		console.log(2222, sendObj)
		that.sendDatas(JSON.stringify(sendObj))
	},

	// 执行场景
	executeScene (e) {
		if (this.data.openTimes > this.data.nowdates) {
			util.showMsg('fail', '会议开始前15分钟可执行情景')
		} else {
			let scenceId = e.currentTarget.dataset.id
			console.log(scenceId)
			console.log(app.globalData.uid)
			dd.confirm({
				title: '确认提醒',
				content: '是否确认执行该场景',
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				success: (res) => {
					dd.httpRequest({
						url: 'http://shareoffice.deviceapi.vaiwan.com/Scene/ExeScene',
						method: 'POST',
						data: {
							UserId: app.globalData.uid,
							Token: "1",
							SceneId: scenceId,
							NoticeQueue: "1"
						},
						success: res => {
							console.log(res)
							// util.showMsg('none', res.data.data)
						},
						fail: err => {
							console.log(err)
						}
					})
				}
			})
		}
	},

	onUnload () {
		dd.offSocketMessage()
	},
	// 获取会议室设备
	getMeetDevice () {
		let that = this
		let params = {
			meetRoomId: that.data.meetRoomid,
			token: app.globalData.token
		}
		getRequest('/meetroom/getMeetRoomDevice', params, true).then(res => {
			that.setData({
				meetDeviceArr: res.result
			})
		})
	},

	// 获取会议室情景
	getMeetScence () {
		let that = this
		let params = {
			meetRoomId: that.data.meetRoomid,
			token: app.globalData.token
		}
		getRequest('/meetroom/getMeetRoomScene', params, true).then(res => {
			// console.log(123,res)
			that.setData({
				scenceArr: res.result
			})
		})
	},

	// 不允许开门
	noOpen () {
		util.showMsg('fail', '会议开始前15分钟可开门')
	}
});
