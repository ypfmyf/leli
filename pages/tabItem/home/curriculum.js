var app = getApp();
Page({
  onLoad: function (options) {
    this.eventsMessage();
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  eventsMessage: function () {
    let that = this;
    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    wx.request({
      url: `${app.globalData.domain}/Api/Index/events`,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data     
        wx.hideLoading();
        let resData = res.data;
        if (resData.eventsinfo){
          that.setData({
            eventsinfo: resData.eventsinfo,
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '暂无课程介绍！',
            showCancel: false,
            confirmText: '我知道了',
            success(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })

              }
            }
          })
        }
        
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '网络异常！请稍后再试',
          duration: 2000
        });
      },
    });
  },
})