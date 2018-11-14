const util = require('../../util')
import { getRequest, postRequest } from '../../httpRequest'
const app = getApp()
Page({
  data: {
		meetId: '',
		detailObj: {},
		allArrs: {},
		userName: '',
		userAvatar: '',
		joinArr: []
	},

	// 获取预约详情
	getDetail () {
		let that = this
		let params = {
			meetId: that.data.meetId,
			token: app.globalData.token
		}
		getRequest('/meeting/getMeetingInfo', params, true).then(res => {
			console.log(res)
			if (res.resultCode == 200) {
				res.result.conferee = JSON.parse(res.result.conferee)
				let allArr = res.result.conferee
				for (let i = 0, len = allArr.length;i < len; i++) {
					allArr[i].name = allArr[i].name.slice(-2)
				}
				if (allArr.length > 3) {
					allArr = allArr.slice(0, 3)
				}
				that.setData({
					detailObj: res.result,
					allArrs: allArr
				})
			}
		})
	},

	// 取消预约
	cancelBtn () {
		let that = this
		let params = {
			meetId: that.data.meetId,
			type: 0
		}
		dd.confirm({
			title: '提示',
			content: '是否确定取消会议预约?',
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			success: res => {
				if (res.confirm == true) {
					postRequest(`/meeting/meetingOpreate?token=${app.globalData.token}`, params, true).then(res => {
						console.log(res)
						if (res.resultCode == 200) {
							dd.navigateBack()
						}
					})
				}
			}
		})
	},

  onLoad(options) {
		console.log(options)
		let that = this
		let metId = options.id
		that.setData({
			meetId: metId,
			userName: app.globalData.userName.slice(-2),
			userAvatar: app.globalData.userAvatar
		})
		that.getDetail()
	},

	// 点击查看参会人员
	searchPerson () {
		dd.navigateTo({
			url: '/pages/personalDetail/personalDetail?per=' + JSON.stringify(this.data.detailObj)
		})
	}
});
