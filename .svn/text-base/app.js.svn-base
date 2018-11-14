const util = require('./util')
import { getRequest } from './httpRequest'
let aPage = null;
App({
  onLaunch(options) {
		aPage = this
		// dd.connectSocket({
		// 	url: 'ws://172.17.130.225:8880',
    //   success(e) {
    //     console.log('创建成功');
		// 		dd.onSocketOpen(function(e) {
		// 			console.log('成功打开连接')
		// 			aPage.globalData.DingSocket = 1
		// 		})
		// 		dd.onSocketError(function(e) {
		// 			console.log('打开失败', e);
		// 		});
    //   },
    //   fail(e) {
    //     console.log('创建失败');
    //   }
    // });
    
		let corpId = options.query.corpId
		this.globalData.corpId = corpId
		dd.getAuthCode({
			success: resAuther => {
				dd.httpRequest({
					url: `${util.baseUrl}/index/authorization`,
					method: 'GET',	
					data: {
						corpId: corpId,
						requestAuthCode: resAuther.authCode
					},
					success: res => {
						// console.log('登录成功返回',res)
						if (res.data.resultCode == 200) {
							this.globalData.token = res.data.result.token
							let params = {
								token: res.data.result.token
							}
							getRequest('/user/getUserInfo', params, true).then(res => {
								// console.log(res)
								this.globalData.userId = res.result.dduid
								this.globalData.userName = res.result.userName
								this.globalData.userAvatar = res.result.avatar
							})
							this.globalData.regStatus = 1
						} else if (res.data.resultCode == 402) {
							this.globalData.regStatus = 0
						} else {
							console.log('网络错误~~服务器错误！',res)
						}
					},
					fail: res => {
						console.log('打印错误信息',res)
					}
				})
			}
		})
  },
  onShow(options) {
		
  },
	globalData: {
		authCode: null,
		corpId: null,
		regStatus: null,
		token: null,
		appId: null,
		userId: '',
		userName: '',
		userAvatar: '',
		DingSocket: 0
	}
});
