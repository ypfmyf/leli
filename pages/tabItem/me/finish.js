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
    height: sysInfo.windowHeight,
    topHeight: '',
    name:'',
    photo:'',
    form_id:'',
    msg_top01:'',
    msg_top02:'',
  },
  onLoad: function (options) {
  
    this.setData({
      name: options.name,
      photo: options.photo,
      form_id: options.formid,
      msg_top01: options.msg1,
      msg_top02: options.msg2,
    },()=>{
      this.passqueryMessage();
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
  //跳转到课程明细页面
  _courseDetails:function(e){
    let courseid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './courseDetails?name=' + this.data.name + '&photo=' + this.data.photo + '&courseid=' + courseid + '&msg_top01=' + this.data.msg_top01 + '&msg_top02=' + this.data.msg_top02
    })
  },
  //主数据
  passqueryMessage: function () {
    let that = this;
    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    wx.request({
      url: `${app.globalData.domain}/Api/User/passquery`,
      method: 'post',
      data: {
        userid: app.globalData.userId,
        bossid: app.globalData.bossid,
        form_id: that.data.form_id,
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
          if (resData.courseinfo.length > 0) {
            that.setData({
              msg1: resData.msg.msg1,
              msg2: resData.msg.msg2,
              msg3: resData.msg.msg3,
              courseinfo: resData.courseinfo,
              loaded: true,
            })
            that._headerHeight();
          } else {
            wx.showModal({
              title: '提示',
              content: '暂无结课可查询！',
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