
const util = require('../../util')
import { getRequest, postRequest } from '../../httpRequest'
const app = getApp()
Page({
  data: {
		hideMask: true,
		meorderList: [],
		meorderStatus: 0,
		size: 10,
		page: 1,
		counts: '',
		meetId: '',
		nowDate: '',
		noData: false,
		propArr: '',
		noDateBot: false
	},

	// 查看详情
	searchDetail (e) {
		// console.log(e)
		let metId = e.currentTarget.dataset.mId
		dd.navigateTo({
			url: '/pages/meetdetail/meetdetail?id=' + metId
		})
	},

	// 获取我的预约列表
	getMeOrder () {
		let that = this
		let params = {
			type: 0,
			token: app.globalData.token,
			pageNumber: that.data.page,
			pageSize: that.data.size
		}
		getRequest('/meeting/getMeetingRecord', params, true).then(res => {
			if (res.resultCode == 200) {
				if (res.result.list.length == 0) {
					that.setData({
						noData: true
					})
				} else {
					that.setData({
						noData: false
					})
				}
				for (let i = 0, len = res.result.list.length; i < len; i++) {
					if (new Date(res.result.list[i].date.replace(/\-/g, "/")).getTime() == new Date(that.data.nowDate).getTime()) {
						let nowText = {
							nowtext: '今天'
						}
						res.result.list[i] = Object.assign(res.result.list[i], nowText)
					} else {
						let nowText = {
							nowtext: res.result.list[i].date.slice(5)
						}
						res.result.list[i] = Object.assign(res.result.list[i], nowText)
					}
					let progress = {
						pross: parseInt((res.result.list[i].sySecond / res.result.list[i].totalSecond) * 100)
					}
					res.result.list[i] = Object.assign(res.result.list[i], progress)
				}
				console.log('我的预约', res)
				that.setData({
					meorderList: that.data.meorderList.concat(res.result.list),
					counts: res.result.total,
					meorderStatus: 1
				})
			} else {
				that.setData({
					noData: true
				})
			}
		})
	},

	// 取消预约调用api
	canOrder () {
		let that = this
		let params = {
			meetId: that.data.meetId,
			type: 0
		}
		postRequest(`/meeting/meetingOpreate?token=${app.globalData.token}`, params, true).then(res => {
			console.log(res)
			if (res.resultCode == 200) {
				that.setData({
					meorderList: []
				})
				that.getMeOrder()
			}
		})

	},

	// 取消预约
	cancelOrder (e) {
		console.log(e)
		let meetids = e.currentTarget.dataset.meetids
		let that = this
		that.setData({
			meetId: meetids
		})
		dd.confirm({
			title: '提示',
			content: '是否确定取消会议预约?',
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			success: res => {
				if (res.confirm == true) {
					that.canOrder()
				}
			}
		})
	},
  onLoad() {
		var nowDate = new Date()
		let that = this
		that.setData({
			nowDate: `${nowDate.getFullYear()}/${nowDate.getMonth() + 1}/${nowDate.getDate()}`
		})
	},
	onPullDownRefresh() {
		// 页面被下拉
		console.log('下拉')
	},
	onShow () {
		let that = this
		console.log('获取到token', app.globalData.token)
		let register = app.globalData.regStatus
		console.log('获取到register', app.globalData.regStatus)
		if (register == 0) {
			dd.confirm({
				title: '提示',
				content: '请绑定手机号码，才可预约会议室',
				confirmButtonText: '绑定手机',
				cancelButtonText: '暂不需要',
				success: res => {
					if (res.confirm) {
						dd.navigateTo({
							url: '/pages/telbinding/telbinding'
						})
					}
				}
			})
		} else {
			that.setData({
				page: 1,
				meorderList: [],
				noDateBot: false,
				noData: false
			})
			that.getMeOrder()
		}
	},
	onReachBottom() {
		let that = this
		// 页面被拉到底部
		// console.info('到底下拉刷新')
		if (that.data.page * that.data.size < that.data.counts) {
			that.setData({
				page: that.data.page += 1
			})
			that.getMeOrder()
		} else {
			// util.showMsg('fail', '没有更多记录啦~')
			that.setData({
				noDateBot: true
			})
		}
	},

	propOpen (e) {
		let that = this
		// console.log(e.currentTarget.dataset.index)
		let indexs = e.currentTarget.dataset.index
		that.setData({
			propArr: JSON.stringify(that.data.meorderList[indexs])
		})
		dd.navigateTo({
			url: '/pages/meetDevice/meetDevice?strmeet=' + JSON.stringify(that.data.meorderList[indexs])
		})
		// console.log(that.data.propArr)
	}
});
