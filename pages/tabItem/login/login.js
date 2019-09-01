var app = getApp();
import {
  sysInfo,
} from '../../../utils/util.js'
Page({
  data: {
    height: sysInfo.windowHeight,
  },
  onLoad: function (options) {},
  onShow: function () {

  },
  onHide: function () {
  },
  onUnload: function () {
  },
  bindGetUserInfo: function (e) {
    console.log('e.detail.userInfo' + e.detail.userInfo);
    var that = this;
    // 前往首页界面
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          that.onLoginUser(e.detail.userInfo);
        } else {

        }
      },

    })
  },
  onLoginUser: function (user) {
    var that = this;
    // console.log(user, encryptedData, iv);
    wx.request({
      url: `${app.globalData.domain}/Api/Login/authlogin`,
      method: 'post',
      data: {
        sessionId: app.globalData.sessionId,
        gender: user.gender,
        NickName: user.nickName,
        id: user.id,
        HeadUrl: user.avatarUrl,
        openid: app.globalData.openid,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var data = res.data.arr;
        var status = res.data.status;
        if (status != 1) {
          wx.showToast({
            title: res.data.err,
            duration: 3000
          });
          return false;
        }
        // app.globalData.userInfo['id'] = data.ID;
        // app.globalData.userInfo['NickName'] = data.NickName;
        // that.globalData.userInfo['HeadUrl'] = data.HeadUrl;
        var userId = data.ID;
        if (!userId) {
          wx.showToast({
            title: '登录失败！',
            duration: 3000
          });
          return false;
        }
        wx.reLaunch({
          url: '../../index',
        })



      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:authlogin',
          duration: 2000
        });
      },
    });
  },
})