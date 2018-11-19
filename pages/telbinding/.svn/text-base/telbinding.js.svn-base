const util = require('../../util')
import { getRequest, postRequest } from '../../httpRequest'
const app = getApp()

Page({
  data: {
		telVal: '',
		codeVal: '',
		getDis: false,
		codeText: '发送验证码',
		btnNum: 0
	},

	// 监听输入手机号码
	advTel (e) {
		// console.log(e.detail.value)
		let tel = e.detail.value
		let that = this
		that.setData({
			telVal: tel
		})
		if (that.data.codeVal && that.data.telVal) {
			that.setData({
				btnNum: 1
			})
		} else {
			that.setData({
				btnNum: 0
			})
		}
	},

	// 监听输入验证码
	advCode (e) {
		// console.log(e)
		let that = this
		let code = e.detail.value
		that.setData({
			codeVal: code
		})
		if (that.data.codeVal && that.data.telVal) {
			that.setData({
				btnNum: 1
			})
		} else {
			that.setData({
				btnNum: 0
			})
		}
	},

	// 点击发送验证码
	sendCode () {
		let that = this
		if (!that.data.telVal.match(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/)) {
			util.showMsg('fail','请输入正确手机号码')
		} else {
			let params = {
				mobile: that.data.telVal
			}
			that.setData({
				getDis: true,
				codeText: '正在发送'
			})
			getRequest(`/index/sendCode`, params, true).then(res => {
				console.log(res)
				if (res.resultCode == 200) {
					let seconds = 60;
					const timer = setInterval(() => {
						that.setData({
							codeText: seconds + 's'
						})
						if (seconds == 0) {
							clearInterval(timer);
							that.setData({
								codeText: '发送验证码',
								getDis: false
							})
						}
						seconds -= 1
					}, 1000)
				}
			})
		}
	},

	// 提交
	submitTel () {
		console.log(890,app.globalData)
		let that = this
		if (!that.data.telVal.match(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/)) {
			util.showMsg('fail', '请输入正确手机号码')
		} else if (!that.data.codeVal) {
			util.showMsg('fail', '请输入验证码')
		} else {
			// console.log('发送请求')
			console.log(app.globalData.corpId)
			dd.getAuthCode({
				success: res => {
					let params = {
						mobile: that.data.telVal,
						code: that.data.codeVal,
						requestAuthCode: res.authCode,
						corpId: app.globalData.corpId
					}
					postRequest('/index/register', params, true).then(res => {
						if (res.resultCode == 200) {
							// util.showMsg('success' ,'绑定成功！')
							dd.getAuthCode({
								success: resCode => {
									console.log('获取公司code',resCode)
									let paramsA = {
										corpId: app.globalData.corpId,
										requestAuthCode: resCode.authCode
									}
									getRequest('/index/authorization', paramsA, true).then(res => {
										if (res.resultCode == 200) {
											console.log('获取token',res)
											app.globalData.token = res.result.token
											app.globalData.uid = res.result.uid
											let paramsS = {
												token: res.result.token
											}
											getRequest('/user/getUserInfo', paramsS, true).then(res => {
												console.log('用户信息',res)
												app.globalData.userId = res.result.dduid
												app.globalData.userName = res.result.userName
												app.globalData.userAvatar = res.result.avatar
												app.globalData.regStatus = 1
												dd.showToast({
													type: 'success',
													content: '绑定成功！',
													duration: 2000,
													success: res => {
														dd.navigateBack()
													}
												})
											})
										}
									})
								}
							})
						}
					})
				}
			})
		}
	},

  onLoad() {},
});
