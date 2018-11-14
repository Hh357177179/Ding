const util = require('../../util')
import { getRequest, postRequest } from '../../httpRequest'
const config = require('../../config')
var app = getApp()
Page({
	data: {
		sendOrder: true,
		textshow: true,
		// cDepment: [],   // 已经选择的部门
		personalNum: 1,
		cTimeArr: [],
		usreIdArr: [],    //用户id数组
		localPersonArr: [],   // 本地展示的数组
		confereeArr: [],   // 发给后台的数组
		userAvatar: '', // 钉钉员工头像
		userName: '',  // 钉钉员工姓名
		ddUserId: '',  // 钉钉员工id
		meetID: '',  // 会议室id
		startIndex: '',  //开始索引
		endIndex: '',  // 结束索引
		meetTitle: '',  //会议主题  
		outTime: '',
		timeInterval: '',
		timeframe: '',
		meetInfo: {},
		optionArr: [],
		encoding: '',
		propNum: '',
		nowDate: '',
		digestStatus: true,   // 摘要点击状态
		textStatus: false,  // textarea 状态
		textValue: '',   // textarea 输入内容
		num: 2,
		wHeight: '',  // 用户窗口高度
		maskStatus: false,
		remindText: '无提醒',  // 提醒参数
		noTime: true,   // 没选择时间段
		botText: false,
		currentTime: '',
		remindArr: [
			{
				id: 0,
				name: '无提醒'
			},
			{
				id: 1,
				name: '准时提醒'
			},
			{
				id: 2,
				name: '提前5分钟'
			},
			{
				id: 3,
				name: '提前15分钟'
			},
			{
				id: 4,
				name: '提前30分钟'
			}
		],
		arrIndex: 0,
		infoArr: [
			{
				id: 0,
				name: '拨打电话'
			},
			{
				id: 1,
				name: 'DING一下'
			},
			{
				id: 2,
				name: '钉钉消息'
			}
		],
		Infoindex: 2,
		orderTimeArr: [],


		// 当前员工列表
		userArr: [],
		// 钉钉通知方式
		alertNum: 2,
		// 会前提醒
		remindTime: -1,
		// 推送时间
		dingTime: '',
		// 推送正文（摘要）
		meetText: '',
		// 会议地点
		meetLocal: '',
		// 开始时间
		startT: '',
		// 结束时间
		endT: '',
		remindType: ''
	},

	// 选择提醒
	rRemind(e) {
		console.log('选择提醒', e.detail.value)
		let that = this
		that.setData({
			arrIndex: e.detail.value
		})
	},

	// 选择通知
	rInfo(e) {
		let that = this
		// console.log('选择通知',e.detail.value)
		that.setData({
			Infoindex: e.detail.value
		})
	},

	// 关闭弹出层
	hideMask() {
		const animation = dd.createAnimation({
			duration: 100,
			timingFunction: "linear"
		})
		this.animation = animation;
		animation.translateY(0).step();
		this.setData({
			animationInfo: animation.export(),
			maskStatus: false,
			orderTimeArr: [],
			optionArr: [],
			timeInterval: '',
			timeframe: '',
			outTime: '',
			cTimeArr: []
		})
	},

	tapTime(e) {
		let that = this
		console.log(e.currentTarget.dataset.ct)
		let ctNum = e.currentTarget.dataset.ct
		if (ctNum == 0) {
			that.setData({
				ct: 1
			})
		} else {
			that.setData({
				ct: 0
			})
		}
	},

	// 获取时间段
	getOrderTime() {
		let that = this
		// if (that.data.nowDate == '') {
		// 	that.setData({
		// 		nowDate: currentTime
		// 	})
		// }
		let params = {
			roomId: that.data.meetID,
			date: that.data.nowDate,
			token: app.globalData.token
		}
		getRequest(`/meeting/getMeetRoomTimeCase`, params, true).then(res => {
			let response = res.result
			for (let i = 0, len = response.length; i < len; i++) {
				if (response[i].index % 2 == 1) {
					let hourN = parseInt(response[i].index / 2)
					// console.log(hourN)
					if (hourN < 10) {
						hourN = '0' + hourN
					}
					let newObj = {
						clock: hourN + ':' + "00"
					}
					response[i] = Object.assign(response[i], newObj)
				} else {
					let shourN = response[i].index / 2
					// console.log(shourN)
					if (shourN - 1 < 10) {
						shourN = "0" + (shourN - 1)
					} else {
						shourN = shourN - 1
					}
					// console.log(shourN)
					let objNew = {
						clock: shourN + ':' + '30'
					}
					response[i] = Object.assign(response[i], objNew)
				}
			}
			that.setData({
				orderTimeArr: response
			})
			console.log(response)
		})
	},

	// 选择时间
	clickTimes(e) {
		let that = this
		let timeIndex = e.currentTarget.dataset.cardT
		let listIndex = e.currentTarget.dataset.cindex
		// console.log(listIndex)
		let changeArr = that.data.orderTimeArr
		if (changeArr[listIndex].use == 0) {
			if (that.data.optionArr.length == 0) {
				// console.log(222,changeArr[listIndex].index)
				changeArr[listIndex].use = 2
				that.setData({
					orderTimeArr: changeArr,
					optionArr: [...that.data.optionArr, changeArr[listIndex].index]
				})
			} else {
				let someChoose = that.data.optionArr.some(item => {
					// console.log(item)
					if (item + 1 == timeIndex || item - 1 == timeIndex) {
						changeArr[listIndex].use = 2
						that.setData({
							orderTimeArr: changeArr,
							optionArr: [...that.data.optionArr, changeArr[listIndex].index]
						})
						return true
					}
				})
				if (!someChoose) {
					util.showMsg('fail', '请选择连续时间段')
				}
			}
		}
		else {
			console.log(123, that.data.optionArr)
			let selectArr = that.data.orderTimeArr
			let choArr = selectArr.filter(item => item.use == 2)
			if (timeIndex == choArr[0].index || timeIndex == choArr[choArr.length - 1].index) {
				changeArr[listIndex].use = 0
				that.setData({
					orderTimeArr: changeArr
				})
				// console.log(2222,timeIndex)
				that.data.optionArr.forEach((item, index) => {
					// console.log(item)
					// console.log(index)
					let curArr = [...this.data.optionArr]
					if (timeIndex == item) {
						curArr.splice(index, 1)
						that.setData({
							optionArr: curArr
						})
					}
				})
			} else {
				util.showMsg('fail', '请选择连续时间段')
			}
		}
		let lastArr = that.data.orderTimeArr.filter(item => item.use == 2)
		console.log(lastArr)
		if (lastArr.length >= 1) {
			let addTimes = new Date(new Date(`${that.data.nowDate.replace(/\-/g, "/")} ${lastArr[lastArr.length - 1].clock}`).getTime() + 30 * 60 * 1000)
			let chour = addTimes.getHours()
			let cmin = addTimes.getMinutes()
			if (chour >= 0 && chour <= 9) {
				chour = '0' + chour
			}
			if (cmin < 30) {
				cmin = '0' + cmin
			}
			let endlastTime = `${chour}:${cmin}`
			if (endlastTime == "00:00") {
				endlastTime = '24:00'
			}
			that.setData({
				noTime: false,
				botText: true,
				timeInterval: `${lastArr[0].clock}~${endlastTime}`,
				timeframe: ((lastArr.length) * 0.5) + '小时',
				outTime: `${lastArr[0].clock}~${endlastTime}`,
				startT: `${lastArr[0].clock}`,
				endT: `${endlastTime}`,
			})
		} else {
			that.setData({
				noTime: true,
				botText: false,
				timeInterval: '',
				timeframe: '',
				outTime: '',
				startT: '',
				endT: ''
			})
		}
	},

	// 选择完成时间段
	submitOrder() {
		let that = this
		let subArr = that.data.orderTimeArr
		let chooseArr = []
		chooseArr = subArr.filter(item => item.use == 2)
		if (chooseArr.length < 1) {
			util.showMsg('fail', '请选择预约时间')
		} else {
			const animation = dd.createAnimation({
				duration: 100,
				timingFunction: "linear"
			})
			this.animation = animation;
			animation.translateY(0).step();
			this.setData({
				animationInfo: animation.export(),
				maskStatus: false,
				orderTimeArr: [],
				optionArr: [],
				timeInterval: '',
				startIndex: chooseArr[0].index,
				endIndex: chooseArr[chooseArr.length - 1].index,
				cTimeArr: chooseArr
			})
		}
	},

	nclickT() {
		util.showMsg('fail', '当前时间不可预约')
	},


	// 完成资料发起预约
	orderBtnTap() {
		let that = this
		if (that.data.cTimeArr.length == 0) {
			util.showMsg('fail', '请选择会议时间段')
		} else if (that.data.meetTitle == '') {
			util.showMsg('fail', '请填写会议主题')
		} else if (that.data.textValue == '') {
			util.showMsg('fail', '请填写会议摘要')
		} else if (that.data.confereeArr.length == 0) {
			util.showMsg('fail', '请选择参会人员')
		} else {
			let params = {
				meetingTheme: that.data.meetTitle,
				meetingDigest: that.data.textValue,
				conferee: JSON.stringify(that.data.confereeArr),
				isRemind: that.data.Infoindex, 
				meetRoomId: that.data.meetID,
				day: that.data.nowDate,
				startIndex: that.data.startIndex - 1,
				endIndex: that.data.endIndex,
				userId: '',
				remindTime: that.data.arrIndex
			}
			console.log('发请求',params)
			postRequest(`/meeting/subscribeMeeting?token=${app.globalData.token}`, params, true).then(res => {
				console.info('发起预约成功回调', res)
				if (res.resultCode == 200) {
				// util.showMsg('success', '预约成功')
				
				let dDate = new Date()
				let dyear = dDate.getFullYear()
				let dmonth = dDate.getMonth() + 1
				let dday = dDate.getDate()
				let dhours = dDate.getHours()
				let dmin = dDate.getMinutes()
			if (dmonth >= 1 && dmonth <= 9) {
				dmonth = "0" + dmonth
			}
			if (dday >= 1 && dday <= 9) {
				dday = "0" + dday;
			}
			if (dhours >= 0 && dhours <= 9) {
				dhours = "0" + dhours
			}
			if (dmin >= 0 && dmin <= 9) {
				dmin = "0" + dmin;
			}

			if (that.data.arrIndex == 0) {
				that.setData({
					remindTime: -1
				})
			} else if (that.data.arrIndex == 1) {
				that.setData({
					remindTime: 0
				})
			} else if (that.data.arrIndex == 2) {
				that.setData({
					remindTime: 5
				})
			} else if (that.data.arrIndex == 3) {
				that.setData({
					remindTime: 15
				})
			} else {
				that.setData({
					remindTime: 30
				})
			}

			that.setData({
				alertNum: that.data.Infoindex,
				userArr: that.data.usreIdArr,
				dingTime: `${dyear}-${dmonth}-${dday} ${dhours}:${dmin}`,
				meetText: `${that.data.userName}邀请您参加【${that.data.meetTitle}】,请在DING中【会议】确认是否参加！`,
				meetLocal: `${that.data.meetInfo.roomName}会议室`,
				startT: `${that.data.nowDate} ${that.data.startT}`,
				endT: `${that.data.nowDate} ${that.data.endT}`,
				remindType: that.data.Infoindex
			})
			console.log('员工列表', that.data.userArr)
			console.log('通知方式', that.data.alertNum)
			console.log('提醒', that.data.remindTime)
			console.log('推送时间', that.data.dingTime)
			console.log('推送摘要', that.data.meetText)
			console.log('推送会议室地址', that.data.meetLocal)
			console.log('推送开始时间', that.data.startT)
			console.log('会议结束时间', that.data.endT)
			config.dDing(that.data.userArr, that.data.alertNum, that.data.dingTime, that.data.meetText, that.data.meetLocal, that.data.startT, that.data.endT, that.data.remindTime, that.data.remindType)
				}
			})
		}
	},

	// 选择时段
	changeframe() {
		let that = this
		that.getOrderTime()
		const animation = dd.createAnimation({
			duration: 200,
			timingFunction: "linear"
		})
		that.animation = animation;
		animation.translateY(-this.data.wHeight * 0.75).step();
		that.setData({
			animationInfo: animation.export(),
			maskStatus: true
		})
	},

	// 选择日期
	changeDate() {
		let that = this
		dd.datePicker({
			format: 'yyyy-MM-dd',
			currentDate: that.data.nowDate,
			// startDate: that.data.nowDate,
			// endDate: that.data.endDate,
			success: (res) => {
				// console.log(123,res)
				if (res.date) {
					// console.log('res不等于空')
					that.setData({
						nowDate: res.date
					})
				}
			}
		});
	},

	// 输入会议主题
	advMtitle(e) {
		console.log(e.detail.value)
		let that = this
		that.setData({
			meetTitle: e.detail.value
		})
	},

	// 点击控制摘要输入
	tapDigest() {
		let that = this
		that.setData({
			digestStatus: false,
			textStatus: true,
			sendOrder: false
		})
	},

	// 监听textarea
	advArea(e) {
		// console.log(e.detail.value)
		let that = this
		let textVal = e.detail.value
		that.setData({
			textValue: textVal
		})
	},

	// 失去焦点触发
	loseFocus() {
		let that = this
		if (that.data.textValue == '') {
			that.setData({
				digestStatus: true,
				textStatus: false
			})
		}
		that.setData({
			sendOrder: true
		})
	},

	// 选择提醒方式
	giveNotice(e) {
		let that = this
		let dataNum = e.currentTarget.dataset.num
		that.setData({
			num: dataNum
		})
	},

	// 选择参会人员
	cPersonal() {
		let that = this
		dd.complexChoose({
			title: "选择参会人员",            //标题
			multiple: true,            //是否多选
			limitTips: "",          //超过限定人数返回提示
			maxUsers: 1000,            //最大可选人数
			pickedUsers: this.data.usreIdArr,            //已选用户
			pickedDepartments: [],          //已选部门
			disabledUsers: [],            //不可选用户
			disabledDepartments: [],        //不可选部门
			requiredUsers: [this.data.ddUserId],            //必选用户（不可取消选中状态）
			requiredDepartments: [],        //必选部门（不可取消选中状态）
			appId: '',              //微应用的Id
			permissionType: "GLOBAL",          //可添加权限校验，选人权限，目前只有GLOBAL这个参数
			responseUserOnly: true,        //返回人，或者返回人和部门
			startWithDepartmentId: 0,   // 0表示从企业最上层开始
			success: res => {
				console.log(res)
				
				that.setData({
					usreIdArr: [],
					confereeArr: res.users,
					personalNum: res.selectedCount + 1,
					textshow: false,
					// cDepment: []
				})
				
				// 二次进来
				let userArr = res.users
				for (let z = 0, lens = userArr.length; z < lens; z++) {
					that.setData({
						usreIdArr: that.data.usreIdArr.concat(userArr[z].userId)
					})
				}
				// let depId = res.departments
				// for (let c = 0, len = depId.length; c < len; c++) {
				// 	that.setData({
				// 		cDepment: that.data.cDepment.concat(depId[c].id)
				// 	})
				// }

				// 本地截取
				let jsonloaclArr = JSON.stringify(res.users)
				let localParr = JSON.parse(jsonloaclArr)
				if (localParr.length > 3) {
					localParr = localParr.slice(0, 3)
				}
				for (let i = 0, len = localParr.length; i < len; i++) {
					// localParr[i].name.findIndex(x => )
					if (localParr[i].name.indexOf('（') == -1) {
						console.log(123123)
						localParr[i].name = localParr[i].name.substr(-2)
					} else {
						localParr[i].name = localParr[i].name.substr(localParr[i].name.length - 3,2)
					}
					console.log(localParr[i].name.length)
				}
				that.setData({
					localPersonArr: localParr
				})
				if (that.data.localPersonArr.length == 0) {
					that.setData({
						textshow: true
					})
				}
				console.log(1, that.data.confereeArr)
				console.log(2, that.data.localPersonArr)
				console.log(3, that.data.usreIdArr)
				// console.log(4, that.data.cDepment)
			},
			fail: err => {
				console.log('选择参会人员err', err)
			}
		})
	},

	// 获取用户信息
	getUserInfo() {
		let params = {
			token: app.globalData.token
		}
		getRequest('/user/getUserInfo', params, true).then(res => {
			console.log(res)
			this.setData({
				ddUserId: res.result.dduid,
				userName: res.result.userName.slice(-2),
				userAvatar: res.result.avatar
			})
		})
	},

	// 获取会议室信息
	getMeetInfo() {
		let params = {
			encoding: this.data.encoding,
			token: app.globalData.token
		}
		console.log('获取token', app.globalData.token)
		getRequest(`/meeting/getMeetRoomInfo`, params, true).then(res => {
			console.log(res)
			// if (res.resultCode == 200) {
			this.setData({
				meetInfo: res.result,
				meetTitle: res.result.roomName + '会议',
				meetID: res.result.roomId
			})
			// }
		})
	},

	// 前一天
	prevBtn () {
		let that = this
		console.log('前一天')
		console.log(that.data.nowDate.replace(/\-/g, "/"))
		console.log(that.data.currentTime)
		let nDate = new Date(that.data.currentTime).getTime()
		let cDate = new Date(that.data.nowDate.replace(/\-/g, "/")).getTime()
		if (cDate > nDate) {
			let cTimes = cDate - 24 * 60 * 60 * 1000
			console.log(new Date(cTimes).getFullYear())
			let ccYear = new Date(cTimes).getFullYear()
			let ccMonth = new Date(cTimes).getMonth() + 1
			let ccDay = new Date(cTimes).getDate()
			if (ccMonth > 0 && ccMonth <= 9) {
				ccMonth = "0" + ccMonth
			}
			if (ccDay > 0 && ccDay <= 9) {
				ccDay = "0" + ccDay
			}
			that.setData({
				nowDate: `${ccYear}-${ccMonth}-${ccDay}`
			})
			that.getOrderTime()
		}
	},

// 后一天
	nextBtn () {
		let that = this
		let nDate = new Date(that.data.currentTime).getTime()
		let cDate = new Date(that.data.nowDate.replace(/\-/g, "/")).getTime()
		// console.log(cDate)
		let cTimes = cDate + 24 * 60 * 60 * 1000
		// console.log(new Date(cTimes).getFullYear())
		let ccYear = new Date(cTimes).getFullYear()
		let ccMonth = new Date(cTimes).getMonth() + 1
		let ccDay = new Date(cTimes).getDate()
		if (ccMonth > 0 && ccMonth <= 9) {
			ccMonth = "0" + ccMonth
		}
		if (ccDay > 0 && ccDay <= 9) {
			ccDay = "0" + ccDay
		}
		that.setData({
			nowDate: `${ccYear}-${ccMonth}-${ccDay}`
		})
		that.getOrderTime()
	},

	onLoad(options) {
		console.log('打印会议室id', options.encoding)
		console.log('人员信息', app.corpid)
		let that = this
		that.setData({
			encoding: options.encoding
		})
		that.getMeetInfo()
		that.getUserInfo()
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		if (month >= 1 && month <= 9) {
			month = "0" + month
		}
		if (day >= 1 && day <= 9) {
			day = "0" + day;
		}
		var dateEnd = new Date(date);
		dateEnd.setDate(date.getDate() + 30)
		let lastTime = `${dateEnd.getFullYear()}-${dateEnd.getMonth() + 1}-${dateEnd.getDate()}`
		// console.log(lastTime)
		let cTime = JSON.stringify(`${year}/${month}/${day}`)
		that.setData({
			nowDate: `${year}-${month}-${day}`,
			endDate: lastTime,
			currentTime: JSON.parse(cTime)
		})

		// 计算屏幕高度
		dd.getSystemInfo({
			success: (res) => {
				that.setData({
					wHeight: res.windowHeight,
					propNum: 'height:' + res.windowHeight * 0.75 * 0.61 + 'px'
				})
			}
		})
	},

	onShow(query) {
	}
});
