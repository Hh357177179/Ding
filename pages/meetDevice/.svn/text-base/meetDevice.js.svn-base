// require('../../socket')
const fromStomp = require('../../socket')
import { getRequest } from '../../httpRequest'
const app = getApp()

Page({
  data: {
		meetInfo: {},
		meetRoomid: '',
		meetDeviceArr: [],
		areaName: '',
		scenceArr: [],
		openDoorTime: ''
	},
  onLoad(options) {
		// console.log(options)
		let that = this
		let optStr = JSON.parse(options.strmeet)
		console.log(optStr)
		that.setData({
			meetInfo: optStr,
			meetRoomid: optStr.meetRoomId,
			openDoorTime: optStr.start
		})
		that.getMeetDevice()
		that.getMeetScence()
		if (app.globalData.DingSocket == 1) {
			that.sendDatas()
		}
		// dd.onSocketMessage(function(e) {
		// 	console.log('监听接收: ' + JSON.stringify(e));
		// });
	},

	// 发送数据
	sendDatas () {
		dd.sendSocketMessage({
			data: '1',
			success(e) {
				console.log('发送成功' + JSON.stringify(e));
			},
			fail(e) {
				console.log('发送失败' + JSON.stringify(e));
			}
		})
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
			console.log(res)
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
			console.log(123,res)
			that.setData({
				scenceArr: res.result
			})
		})
	}
});
