const util = require('../../util')
import { getRequest } from '../../httpRequest'
var app = getApp()
Page({
	data: {
		size: 5,
		page: 1,
		meetingArr: [],
		counts: '',
		callipersArr: ''
	},

	// 跳转预约页面
	apponint (e) {
		let encoding = e.currentTarget.dataset.encoding
		let register = app.globalData.regStatus
		// console.log(register)
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
			dd.navigateTo({
				url: '/pages/appointment/appointment?encoding=' + encoding
			})
		}
	},

	// 获取会议室列表
	getMeeting () {
		let that = this
		let params = {
			pageNumber: that.data.page,
			pageSize: that.data.size
		}
		getRequest(`/meeting/getMeetRoom`, params, true).then(res => {
			// console.log('会议室列表', res)
			// for (let i = 0, len = res.result.length; i < len; i ++) {
				// console.info('配套设施', res.result[i].lstdate)
			// }
			// console.log(res.result.list[0].lstdate[18])
			// console.log(res.result.list[0].lstdate[38])
			for (let i = 0,len = res.result.list.length; i < len;i++) {
				// console.log(res.result.list[i].lstdate.slice(18,38))
				res.result.list[i].lstdate = res.result.list[i].lstdate.slice(18, 38)
			}
			that.setData({
				meetingArr: that.data.meetingArr.concat(res.result.list),
				counts: res.result.total,
				// callipersArr: res.result.list.lstdate
			})
		})
	},

  onLoad(query) {
		let that = this
		let corpid = query.corpId
		app.globalData.corpid = corpid
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
		let that = this
		that.setData({
			meetingArr: [],
			page: 1
		})
		that.getMeeting()
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
		let that = this
		// console.info('到底下拉刷新')
		if (that.data.page * that.data.size < that.data.counts) {
			that.setData({
				page: that.data.page += 1
			})
			that.getMeeting()
		} else {
			// util.showMsg('fail', '没有更多记录啦~')
		}

  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
});
