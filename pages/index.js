var app = getApp();
Page({
  onLoad: function (options) {
    app.getUserInfo((res) => {
      if (res==null) {
        wx.redirectTo({
          url: './tabItem/login/login',
        })
      } else {
        wx.switchTab({
          url: './tabItem/home/index',
        })
      }
    })
  },
  onShow: function () {

  },
  onHide: function () {
  },
  onUnload: function () {
  },
})