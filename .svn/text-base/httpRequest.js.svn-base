const util = require('./util')

const defaultRequest = function({ vurl, vmethod, params, visloading } = {}) {
	// visloading && util.showLoading();
	return new Promise((resolve, reject) => {
		if (vurl == null || vurl == '') {
			reject('请求地址未填写');
			// dd.hideLoading()
		} else {
			dd.httpRequest({
				url: util.baseUrl + vurl,
				method: vmethod,
				data: params,
				success: res => {
					if (res.data.resultCode == 200) {
						// dd.hideLoading()
						resolve(res.data)
					} else {
						console.log('打印错误', res)
						util.showMsg('exception',res.data.des)
					}
				},
				fail(res) {
					reject(res)
					util.showMsg('exception','网络错误，请重试')
					// util.showMsg('exception', `${res.data.message}+${res.data.status}`)
				}
			})
		}
	})
}

// get请求
const getRequest = function(vurl, params, visloading) {
	return defaultRequest({
		vurl,
		vmethod: 'GET',
		params,
		visloading
	})
}

// post请求
const postRequest = function(vurl, params, visloading) {
	return defaultRequest({
		vurl,
		vmethod: 'POST',
		params,
		visloading
	})
}

// 导出
module.exports = {
	getRequest: getRequest,
	postRequest: postRequest
}