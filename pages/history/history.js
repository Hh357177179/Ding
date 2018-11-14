const util = require('../../util')
import { getRequest, postRequest } from '../../httpRequest'
const app = getApp()
Page({
  data: {
		historyList: [],
		meetId: '',
		counts: '',
		page: 1,
		size: 10,
		nodata: false
	},

	// 获取历史记录列表
	getHistory () {
		let that = this
		let params = {
			type: 1,
			token: app.globalData.token,
			pageNumber: that.data.page,
			pageSize: that.data.size
		}
		getRequest('/meeting/getMeetingRecord', params, true).then(res => {
			console.log('历史记录列表',res)
			if (res.resultCode == 200) {
				if (res.result.list.length == 0) {
					that.setData({
						nodata: true
					})
				} else {
					that.setData({
						nodata: false
					})
				}
				for (let i = 0, len = res.result.list.length; i < len; i++) {
					let obj = {
						mmdd: res.result.list[i].date.slice(5)
					}
					let startT = new Date(res.result.list[i].date.replace(/\-/g, "/") + ' ' + res.result.list[i].start).getTime()
					// console.log(2222, res.result.list[i].date)
					let endT = new Date(res.result.list[i].date.replace(/\-/g, "/") + ' ' + res.result.list[i].end).getTime()
					let sorthour = (endT - startT) % (24 * 3600 * 1000)
					let hours = Math.floor(sorthour / (3600 * 1000))
					let sortmin = sorthour % (3600 * 1000)
					let min = Math.floor(sortmin / (60 * 1000))
					let Objstr = {
						sortStr: `共${hours}小时${min}分钟`
					}
					res.result.list[i] = Object.assign(res.result.list[i], obj, Objstr)
				}
				
				that.setData({
					historyList: that.data.historyList.concat(res.result.list),
					counts: res.result.total
				})
			} else {
				that.setData({
					nodata: true
				})
			}
		})
	},

	// 删除方法
	detailList () {
		let params = {
			meetId: this.data.meetId,
			type: 2
		}
		postRequest(`/meeting/meetingOpreate?token=${app.globalData.token}`, params, true).then(res => {
			console.log(res)
			if (res.resultCode == 200) {
				// dd.alert({
				// 	title: '删除成功'
				// })
				this.setData({
					historyList: []
				})
				this.getHistory()
			}
		})
	},


	// 删除历史记录
	deleteBtn (e) {
		let that = this
		// console.log(e)
		let meetIds = e.currentTarget.dataset.meetId
		that.setData({
			meetId: meetIds
		})
		dd.confirm({
			title: '提示',
			content: '是否确认删除?',
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			success: res => {
				if (res.confirm) {
					that.detailList()
				}
			}
		})
	},
  onLoad() {
		
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
				historyList: [],
				nodata: false
			})
			that.getHistory()
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
			 that.getHistory()
		} else {
			// util.showMsg('fail', '没有更多记录啦~')
		}
	},
});
