var app = getApp();
import {
  gjRequest,
  convertDateFromTimeZone,
  sysInfo
} from '../../../utils/util.js';
Page({
  data: {
    loaded:false,
    width: sysInfo.windowWidth,
    usertype:'',
    bossid:'',
    photo:'',
    name:'',
    msg1:'',
    msg2:'',
  },
  onLoad: function (options) {},
  onShow: function () {
    this.meMessage();
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  //扣课记录
  _hour: function () {
    wx.navigateTo({
      url: './hour?name=' + this.data.name + '&photo=' + this.data.photo + '&msg1=' + this.data.msg1 + '&msg2=' + this.data.msg2
    })
  },
  //我的报名
  _appointment: function () {
    wx.navigateTo({
      url: './appointment?name=' + this.data.name + '&photo=' + this.data.photo + '&msg1=' + this.data.msg1 + '&msg2=' + this.data.msg2
    })
  },
   //结课查询
  _finish:function(e){
    let form_id = e.detail.formId;
    wx.navigateTo({
      url: './finish?name=' + this.data.name + '&photo=' + this.data.photo + '&formid=' + form_id + '&msg1=' + this.data.msg1 + '&msg2=' + this.data.msg2
    })
  },
  //排课查询
  _taking: function (e) {
    let form_id = e.detail.formId;
    wx.navigateTo({
      url: './taking?name=' + this.data.name + '&photo=' + this.data.photo + '&formid=' + form_id+'&msg1=' + this.data.msg1 + '&msg2=' + this.data.msg2
    })
  },
  //联系我们
  _contact: function () {
    wx.navigateTo({
      url: './contact?name=' + this.data.name + '&photo=' + this.data.photo + '&msg1=' + this.data.msg1 + '&msg2=' + this.data.msg2
    })
  },
  // 个人信息显示
  meMessage:function(){
    let that=this;
    this.setData({
      usertype: app.globalData.usertype,
      bossid: app.globalData.bossid,
    })
    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    wx.request({
      url: `${app.globalData.domain}/Api/User/userinfo`,
      method: 'post',
      data: {
        userid: app.globalData.userId,
        bossid: app.globalData.bossid,
        usertype: app.globalData.usertype,
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
            loaded:true,
            photo: resData.userinfo.photo,
            name: resData.userinfo.name,
            msg1: resData.userinfo.msg1,
            msg2: resData.userinfo.msg2,
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
  _register:function(){
    let that=this;
    if (that.data.usertype == 0) {
      wx.showModal({
        title: '提示',
        content: '报名时请先绑定手机号！',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/index'
            })
          }
        }
      })
    }
  },

})