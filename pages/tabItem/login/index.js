var app = getApp()
import {
  sysInfo,
  lifeCycle,
} from '../../../utils/util.js'
Page({
  data: {
    height: sysInfo.windowHeight,
    width: sysInfo.windowWidth,
    code: '',
    trueContact: false,  //电话的状态
    contactSelected: '',
    session_key:'',
  },
  onLoad: function () {
    let that=this;
    wx.login({
      success: function (loginInfo) {
        let code = loginInfo.code;
        // that.getUserSessionKey(code);
        console.log('获取状态' + code);
        wx.request({
          url: `${app.globalData.domain}/Api/Login/getsessionkeys`,
          method: 'post',
          data: {
            code: code
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res01) {
            //--init data        
            var data = res01.data;
            if (data.status == 0) {
              wx.showToast({
                title: data.err,
                duration: 2000
              });
              return false;
            }
            that.setData({
              session_key: data.session_key,
            })
          },
     
        });

      }
    })
  },
  onShow: function () {
  },
  onHide: function () {

  },
  onUnload: function () {
  },
  //授权手机号登录
  login: function (e) {
    let that = this;
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      wx.showLoading({
        title: '请稍后...',
        mask: true
      })
      wx.request({
        url: `${app.globalData.domain}/Api/Book/register`,
        method: 'post',
        data: {
          userid: app.globalData.userId,
          sessionId: that.data.session_key,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
          // bossid: app.globalData.bossid,
          // usertype: app.globalData.usertype,
          // date: selectedMonth,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          wx.hideLoading();
          app.globalData.bossid = res.data.bossid;//是否是会员
          app.globalData.usertype =res.data.usertype;  //用户类型
          let pages = getCurrentPages(); //当前页面栈
          console.log(pages);
          if (pages.length == 2) {
            wx.navigateBack({
              delta: 1
            })
          }
          if (pages.length == 3) {
            wx.navigateBack({
              delta: 2
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
    }

  },
})