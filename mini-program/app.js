// app.js

App({
  globalData: {
    userInfo: null,
    islogin: false,
    serverUrl: "http://127.0.0.1:8080"
  },
  onLaunch() {
    // wx.clearStorageSync()
    let token = wx.getStorageSync('auth');
    console.log(token)
  }
})
