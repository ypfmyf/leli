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
    topHeight:'',
    name:'',
    photo:'',
    msg_top01:'',
    msg_top02:'',
    bookinfo:[],
    loaded: false,
  },
  onLoad: function (options) {
    this.setData({
      name: options.name,
      photo: options.photo,
      msg_top01: options.msg1,
      msg_top02: options.msg2,
    })
   
    this.hourMessage();
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  // 获取头部固定高度
  _headerHeight: function () {
    let key = `#top`;
    wx.createSelectorQuery()
      .select(key)
      .boundingClientRect((rect) => {
        this.setData({
          topHeight: rect.height,
        })

      }).exec()
  },
  hourMessage: function () {
    let that = this;
    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    wx.request({
      url: `${app.globalData.domain}/Api/User/coursequery`,
      method: 'post',
      data: {
        userid: app.globalData.userId,
        bossid: app.globalData.bossid,
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
            msg1: resData.msg.msg1,
            msg2: resData.msg.msg2,
            msg3: resData.msg.msg3,
            msg4: resData.msg.msg4,
            msg5: resData.msg.msg5,
            msg6: resData.msg.msg6,
            bookinfo: resData.bookinfo,
          },()=>{
            that._headerHeight();
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