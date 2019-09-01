var app = getApp();
import {
  gjRequest,
  convertDateFromTimeZone,
  sysInfo
} from '../../../utils/util.js';
Page({
  data: {
    width: sysInfo.windowWidth,
    height: sysInfo.windowHeight,
    loaded:false,
  },
  onLoad: function (options) {
    this.moreMessage();
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  moreMessage: function () {
    let that = this;
    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    wx.request({
      url: `${app.globalData.domain}/Api/Index/notice`,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data     
        wx.hideLoading();
        let resData = res.data;
        for (let v in resData.noticeinfo) {
          if (resData.noticeinfo[v].brief.length >18) {
            resData.noticeinfo[v].brief = resData.noticeinfo[v].brief.slice(0,18) + "..."
          }
        }
        that.setData({
          blackpic: resData.blackpic,
          noticeinfo: resData.noticeinfo,
          loaded:true,
        })
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
  //点击跳转到公共内容页面
  _noticedetail:function(e){
    let noid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './noticedetail?noid=' +noid
    })
  }
})