var app = getApp();
import {
  gjRequest,
  convertDateFromTimeZone,
  sysInfo
} from '../../../utils/util.js';
Page({
  data: {
    loaded: true,
    width: sysInfo.windowWidth,
    height: sysInfo.windowHeight,
    topHeight: '',
    name: '',
    photo: '',
    msg_top01: '',
    msg_top02: '',
    textareaValue:'',
    inputValue01:'',
    inputValue02:'',
  },
  onLoad: function (options) {
    this._headerHeight();
    this.setData({
      name: options.name,
      photo: options.photo,
      msg_top01: options.msg1,
      msg_top02: options.msg2,
    })
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  // 获取头部固定高度
  _headerHeight: function () {
    let key = `#topY`;
    wx.createSelectorQuery()
      .select(key)
      .boundingClientRect((rect) => {
        this.setData({
          topHeight: rect.height,
        })

      }).exec()
  },
  //主数据
  _click: function () {
    let that = this;
    let inputValue01 = that.data.inputValue01;
    let inputValue02 = that.data.inputValue02;
    let textareaValue = that.data.textareaValue;
    if (textareaValue == '') {
      wx.showModal({
        title: '提示',
        content: '好歹说点什么吧！',
        confirmText: '我知道了',
        showCancel: false
      })
      return;
    }
    wx.showModal({
      title: '提示',
      content: '提交Right Now？',
      success: (res2) => {
       if (res2.confirm) {
          wx.request({
            url: `${app.globalData.domain}/Api/User/contact`,
            method: 'post',
            data: {
              userid: app.globalData.userId,
              name: inputValue01,
              tel: inputValue02,
              info: textareaValue,
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              let resData = res.data;
              if (resData.status == 0) {
                wx.showModal({
                  title: '提示',
                  content: resData.err,
                  confirmText: '我知道了',
                  showCancel: false
                })
              }
              wx.showModal({
                    title: '提示',
                    content: '提交成功，我们会第一时间联系您！',
                    showCancel: false,
                    confirmText: '我知道了',
                    success(res22) {
                      if (res22.confirm) {
                        wx.navigateBack({
                          delta: 1
                        })

                      }
                    }

              })
                  
                
            },
            fail: function () {
              wx.showToast({
                title: '网络异常！请稍后再试',
                duration: 2000
              });
            },
          });
       }
      }
    })
   
  },
  inputChange01: function (e) {

    let inputValue01= e.detail.value;
    this.setData({
      inputValue01: inputValue01
    })

  },
  inputChange02: function (e) {
    let inputValue02 = e.detail.value;
    this.setData({
      inputValue02: inputValue02
    })


  },
  textareaChange: function (e) {
    let textareaValue = e.detail.value;
    this.setData({
      textareaValue: textareaValue
    })


  },
})