const app = getApp()
Page({
  data: {
		perDetails: [],
		perObj: {},
		dindex: ''
	},

	// 单独Ding某个人
	dingOnly (e) {
		// console.log(this.data.perObj)
		// console.log(e.currentTarget.dataset.uid)
		let dingOne = e.currentTarget.dataset.uid
		console.log(dingOne)
		dd.showActionSheet({
			items: ['拨打电话', 'DING一下', '发钉钉消息'],
			cancelButtonText: '取消',
			success: (res) => {
				console.log(res.index)
				this.setData({
					dindex: res.index
				})
				if (res.index != -1) {
					dd.createDing({
						users: [dingOne],// 用户列表，工号
						// type: 1, // 附件类型 1：image  2：link
						alertType: this.data.dindex, // 钉发送方式 0:电话, 1:短信, 2:应用内
						// alertDate: { "format": "yyyy-MM-dd HH:mm", "value": "2015-05-09 08:00" },
						// attachment: {
						// 	// image必填参数      
						// 	image: ['../../image/airC.png'],
						// 	// link链接必填参数
						// 	title: '测试会议',
						// 	url: 'http:www.baidu.com',
						// 	// image: '',
						// 	// text: ''
						// }, // 附件信息
						text: `${app.globalData.userName}邀请您参加会议【${this.data.perObj.meetingTheme}】，会议时间${this.data.perObj.date} ${this.data.perObj.start}~${this.data.perObj.end}，会议地点：${this.data.perObj.roomName}会议室。`,  // 正文
						bizType: 0, // 业务类型 0：通知DING；1：任务；2：会议；
						success: function(res) {
							console.log(res)
						},
						fail: function(err) {
							console.log('推送错误', err)
						}
					});
				}
			}
		})
	},

  onLoad(options) {
		let that = this
		let perDetails = JSON.parse(options.per).conferee
		console.log(perDetails)
		that.setData({
			perDetails: perDetails,
			perObj: JSON.parse(options.per)
		})
	},
});
