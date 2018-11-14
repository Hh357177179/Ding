const dDing = function(userArr, alertNum, dingTime, meetText, meetLocal, startT, endT, remindTime, remindType) {
	console.log(123231232,userArr)
	dd.createDing({
		users: userArr,  // userArr 员工列表userID
		// type: ,    // 附件类型 1：image  2：link
		alertType: alertNum, // 发送方式 0:电话, 1:短信, 2:应用内
		alertDate: { "format": "yyyy-MM-dd HH:mm", "value": dingTime},  // 钉提醒时间
		// attachment: {
		// 	// image必填参数      
		// 	image: [''],
		// 	// link链接必填参数
		// 	title: '',
		// 	url: '',
		// 	image: '',
		// 	text: ''
		// }, // 附件信息
		text: meetText,  // 正文（摘要）
		bizType: 2, // 业务类型 0：通知DING；1：任务；2：会议；
		confInfo: {
			bizSubType: 0, // 子业务类型如会议：0：预约会议；1：预约电话会议；2：预约视频会议；（注：目前只有会议才有子业务类型）
			location: meetLocal, //会议地点；（非必填）
			startTime: { "format": "yyyy-MM-dd HH:mm", "value": startT },// 会议开始时间
			endTime: { "format": "yyyy-MM-dd HH:mm", "value": endT }, // 会议结束时间
			remindMinutes: remindTime, // 会前提醒。单位分钟-1：不提醒；0：事件发生时提醒；5：提前5分钟；15：提前15分钟；30：提前30分钟；60：提前1个小时；1440：提前一天；
			remindType: remindType // 会议提前提醒方式。0:电话, 1:短信, 2:应用内
		},
		success: res => {
			console.log('ding一下成功',res)
			dd.navigateTo({
				url: '/pages/successful/successful'
			})
		},
		fail: err => {
			console.log('ding失败', err)
		}
	})
}

module.exports = {
	dDing: dDing
}