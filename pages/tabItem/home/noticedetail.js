var app = getApp();
import {
  gjRequest,
  convertDateFromTimeZone,
  sysInfo
} from '../../../utils/util.js';
//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../../wxParse/wxParse.js');
Page({
  data: {
    width: sysInfo.windowWidth,
    height: sysInfo.windowHeight,
    noid:'',
    loaded:false,
  },
  onLoad: function (options) {
    this.setData({
      noid: options.noid,
    })
    this.noticedetailMessage();
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  noticedetailMessage: function () {
    let that = this;
    this.setData({
      usertype: app.globalData.usertype,
      bossid: app.globalData.bossid,
    })
    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    wx.request({
      url: `${app.globalData.domain}/Api/Index/noticedetail`,
      method: 'post',
      data: {
        id: this.data.noid,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data     
        wx.hideLoading();
        let resData = res.data;
        if (resData.status == 0) {
          wx.showModal({
            title: '提示',
            content: resData.err,
            confirmText: '我知道了',
            showCancel: false
          })
        }
        if (resData.status == 1) {
       
            that.setData({
              noticeinfo: resData.noticeinfo,
              loaded: true,
            })
          let content = resData.noticeinfo.info;
          WxParse.wxParse('content', 'html', content, that, 3);
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