export {
  getFormatTimeByMillis,
  getCurrentFormatTime,
  alertFail,
  fail,
  getAuthHeader,
  checkSuccess,
  route,
}

const app = getApp()
const baseUrl = app.globalData.baseUrl

let ftime = (t) => {
  if (t < 10) {
    return `0${t}`
  }
  return t
}
// 获取当前格式化时间
let getCurrentFormatTime = () => {
  return getFormatTimeByDate(new Date())
}
// 根据Date获取格式化时间
let getFormatTimeByMillis = (millis) => {
  if (typeof(millis) != "number") {
    millis = parseInt(millis)
  }
  return getFormatTimeByDate(new Date(millis))
}
let getFormatTimeByDate = (date) => {
  return `${date.getFullYear()}年${ftime(date.getMonth() + 1)}月${ftime(date.getDate())}日`
  // return `${date.getFullYear()}-${ftime(date.getMonth() + 1)}-${ftime(date.getDate())} ${ftime(date.getHours())}:${ftime(date.getMinutes())}:${ftime(date.getSeconds())}`
}

let checkSuccess = res => {
  console.log(res)
  if (res.data.code != 200) {
    alertFail("请求失败", res.data.msg)
    return false
  }
  return true
}

let fail = () => {
  let title = "失败"
  let content = "操作失败，请重试"
  alertFail(title, content) 
}

let alertFail = (title, content) => {
  wx.showModal({
    title: title,
    content: content,
    showCancel: false,
    confirmText: "确定",
    confirmColor: "#00BFFF",
  })
}

let getAuthHeader = () => {
  let token = wx.getStorageSync('auth') || ''
  let myHeader = token != "" ? { "auth": token } : {}
  return myHeader
}

let getToken = () => {
  return wx.getStorageSync('auth') || ''
}

let goToPage = (pageUrl, redirect) => {
  if (redirect == 0) {
    wx.navigateTo({
      url: pageUrl,
    })
  } else if (redirect == 1) {
    wx.redirectTo({
      url: pageUrl,
    })
  }
} 
let route = (pageUrl, needAuth = 1, redirect = 0) => {
  if (needAuth == 0) {
    goToPage(pageUrl, redirect)
  } else {
    if (!app.globalData.isLogin) {
      if (getToken() != '') {
        auth(pageUrl, 0, redirect)
      } else {
        wx.getUserProfile({
          desc: '请问是否进行登录？',
          success() {
            wx.showLoading({
              title: "登录中..."
            })
            auth(pageUrl, 1, redirect)
          },
        })
      }
    } else {
      goToPage(pageUrl, redirect)
    }
  }
}

let auth = (pageUrl, first = 0, redirect) => {
  wx.login({
    success(res1) {
      let url = `${baseUrl}/api/user/auth?code=${res1.code}`
      let nickName = wx.getStorageSync('nickName') || ''
      if (nickName != '') {
        url += `&nickName=${nickName}`
      }
      wx.request({
        url: url,
        header: getAuthHeader(),
        method: 'POST',
        success(res2) {
          if (res2.data.code == 200) {
            if (first == 1) {
              wx.hideLoading({
                success: () => {
                  wx.showToast({
                    title: '登录成功'
                  })
                }
              })
            }
            wx.setStorageSync('auth', res2.header.auth)
            app.globalData.isLogin = true
            goToPage(pageUrl, redirect)
            return true
          } else if (res2.data.code == 4011 || res2.data.code == 4012) {
            console.log("token过期，重新登录")
            wx.removeStorageSync('auth')
            auth(pageUrl, 1, redirect)
          }
          else {
            wx.hideLoading({
              success: () => { alertFail("登录失败", `${res2.data.msg}`) },
            })
          }
        },
        fail() {
          wx.hideLoading({
            success: () => { alertFail("登录失败", "请检查网络") },
          })
        }
      })
    },
    fail() {
      wx.hideLoading({
        success: () => { alertFail("登录失败", "请检查网络") },
      })
    }
  })
}