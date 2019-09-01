var app = getApp();
Page({
  data:{
    gyminfo:[]
  },
  onLoad: function (options) {
    this.gymMessage();
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  gymMessage: function () {
    let that = this;
    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    wx.request({
      url: `${app.globalData.domain}/Api/Index/gym`,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data     
        wx.hideLoading();
        let resData = res.data;
        if (resData.gyminfo) {

          for (let v in resData.gyminfo){
            if (resData.gyminfo[v].name.length>4){
              resData.gyminfo[v].name = resData.gyminfo[v].name.slice(0,4) + "..."
            }
          }
          that.setData({
            gyminfo: resData.gyminfo,
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '暂无场地介绍！',
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