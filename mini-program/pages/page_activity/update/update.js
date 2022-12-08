const app = getApp()
const baseUrl = app.globalData.baseUrl
import * as util from "../../../utils/util"

Page({
  data: {
    aId: "",
    aType: "",
    aName: "",
    aDesc: "",
    aEndDate: "",
    aEndDateShow: "",
    aIsPublic: "0",
    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
    show: false,
  },
  onIsPublicClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      aIsPublic: name
    });
    console.log(this.data.aIsPublic)
  },
  showDatePickerPopup() {
    this.setData({ show: true });
  },
  onDatePickerClose() {
    this.setData({ show: false });
  },
  onDatePickerInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },
  onDatePickerConfirm() {
    this.setData({ 
      show: false,
      aEndDate: this.data.currentDate,
      aEndDateShow: util.getFormatTimeByMillis(this.data.currentDate)
    });
  },
  checkForm() {
    if (this.data.aName.trim() == '' || this.data.aEndDate.trim() == '') {
      return false
    }
    return true
  },
  onLoad(params) {
    let aId = params.aId
    let aType = params.aType
    let activity = JSON.parse(params.activity)
    this.setData({
      aId: aId,
      aType: aType,
      aName: activity.aName,
      aDesc: activity.aDesc,
      aEndDate: activity.aEndDate,
      aEndDateShow: util.getFormatTimeByMillis(activity.aEndDate),
      aIsPublic: `${activity.aIsPublic}`,
    })
  },
  updateActivity() {
    let that = this
    let aId = this.data.aId
    let aType = this.data.aType
    wx.showModal({
      title: '更新活动',
      content: '确认更新？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: `${baseUrl}/api/activity/update`,
            header: util.getAuthHeader(),
            method: 'POST',
            data: that.data,
            success(res) {
              if (util.checkSuccess(res)) {
                util.route(`/pages/page_activity/detail/detail?aId=${aId}&aType=${aType}`, 1, 1)
                wx.showToast({
                  title: '操作成功',
                })
              }
            },
            fail() {
              util.fail()
            }
          })
        }
      }
    })
  },
})
