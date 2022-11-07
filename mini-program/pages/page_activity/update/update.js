const app = getApp()
const base_url = app.globalData.base_url
import * as util from "../../../utils/util"

Page({
  data: {
    a_id: "",
    a_name: "",
    a_desc: "",
    a_end_date: "",
    a_is_public: 0,
    current_date: util.currentTime_1()
  },
  onLoad(params) {
    let that = this
    wx.request({
      url: `${base_url}/api/activity/get/id?a_id=${params.a_id}`,
      header: util.get_auth_header(),
      success(res) {
        console.log(res)
        if (util.check_success(res)) {
          let obj = res.data.obj
          console.log(obj)
          that.setData({
            a_id: obj.a_id,
            a_name: obj.a_name,
            a_desc: obj.a_desc,
            a_end_date: obj.a_end_date,
            a_is_public: obj.a_is_public
          })
        }
      },
      fail() {
        util.fail()
      }
    })
  },
  bindDateChange(e) {
    this.setData({
      a_end_date: e.detail.value + ' ' + util.currentTime_2()
    })
  },
  publicChange(e) {
    if (e.detail.value[0] === undefined) {
      this.setData({
        a_is_public: 0
      })
    } else {
      this.setData({
        a_is_public: 1
      })
    }
  },
  update_activity() {
    let that = this
    wx.request({
      url: `${base_url}/api/activity/update`,
      header: util.get_auth_header(),
      method: 'POST',
      data: that.data,
      success(res) {
        if (util.check_success(res)) {
          wx.showToast({
            title: '操作成功',
          })
          util.route("/pages/page_activity/activity/personal/personal")
        }
      },
      fail(res) {
        util.fail()
      }
    })

  },
})