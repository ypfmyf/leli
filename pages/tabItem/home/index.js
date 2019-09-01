var app = getApp();
//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../../wxParse/wxParse.js');
Page({
  data:{
    notices: [],
  },
  onLoad: function (options) {
   
    wx.showShareMenu({
      withShareTicket:true,
    })
  },
  onShow: function () {
    this.indexMessage();
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  onShareAppMessage:function(){
    return {
      title: '收到一个小程序，请在手机上查看',
      path: '/pages/index',
      imageUrl:'../../imgs/share.png',
    }
  },
  //跳转到课程介绍页面
  _curriculum: function () {
    wx.navigateTo({
      url: './curriculum'
    })
  },
  //跳转到教练介绍页面
  _coach:function(){
    wx.navigateTo({
      url: './coach'
    })
  },
  // 跳转到场地介绍页面
  _place:function(){
    wx.navigateTo({
      url: './place'
    })
  },
  //跳转到公司介绍页面
  _company:function(){
    wx.navigateTo({
      url: './company'
    })
  },
  //主数据
  indexMessage: function () {
    let that = this;
    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    wx.request({
      url: `${app.globalData.domain}/Api/Index/index`,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data     
        wx.hideLoading();
        let resData = res.data;
          that.setData({
            notices: resData.noticeinfo,
            indexpic1: resData.indexpic[0].photo,
            indexpic2: resData.indexpic[1].photo,
            indexpic3: resData.indexpic[2].photo,
            indexpic4: resData.indexpic[3].photo,
            indexpic5: resData.indexpic[4].photo,
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

})