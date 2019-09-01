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
  },
  onLoad: function (options) {
    this.bookqueryMessage();
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
  bookqueryMessage: function () {
    let that = this;
    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    wx.request({
      url: `${app.globalData.domain}/Api/User/bookquery`,
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
          if (resData.booklist.length>0){
            that.setData({
              booklist: resData.booklist,
              loaded:true,
            })
            that._headerHeight();
          }else{
            wx.showModal({
              title: '提示',
              content: '暂无报名可查询！',
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
  // 点击报名
  _signClcik01: function (e) {
    //访客
    if (app.globalData.usertype == 0) {
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
    //学员与非学员的点击
    if (app.globalData.usertype == 1 || app.globalData.usertype == 3) {
      var form_id = e.detail.formId;
      let courseid = e.detail.target.dataset.id;
      let that = this;
      console.log(courseid);
      wx.showModal({
        title: '提示',
        content: '您确定要报名吗？',
        success(res) {
          if (res.confirm) {
            that.appointmentClick(courseid, form_id);
          }
        }
      })
    }
  },
  //报名函数
  appointmentClick: function (courseid, form_id) {
    console.log(form_id);
    let that = this;
    wx.request({
      url: `${app.globalData.domain}/Api/Book/book`,
      method: 'post',
      data: {
        userid: app.globalData.userId,
        bossid: app.globalData.bossid,
        usertype: app.globalData.usertype,
        courseid: courseid,
        form_id: form_id,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data     
        wx.hideLoading();
        let resData = res.data
        if (resData.status == 0) {
          wx.showModal({
            title: '提示',
            content: resData.err,
            confirmText: '我知道了',
            showCancel: false
          })
        }
        if (resData.status == 1) {
          wx.showModal({
            title: '提示',
            content: '报名成功',
            confirmText: '我知道了',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                that.bookqueryMessage();
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
  //报名函数
  _signClcik02: function (e) {
    //学员与非学员的点击
    if (app.globalData.usertype == 0) {
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
    if (app.globalData.usertype == 1 || app.globalData.usertype == 3) {
      let that = this;
      var form_id = e.detail.formId;
      let courseid = e.detail.target.dataset.id;
      wx.showModal({
        title: '提示',
        content: '您确定要取消报名吗？',
        success(res) {
          if (res.confirm) {
            //函数里的
            that.cancelClick(courseid, form_id);
          }
        }
      })
    }
  },
  // 取消报名函数
  cancelClick: function (courseid, form_id) {
    let that = this;
    wx.request({
      url: `${app.globalData.domain}/Api/Book/cancelbook`,
      method: 'post',
      data: {
        userid: app.globalData.userId,
        bossid: app.globalData.bossid,
        courseid: courseid,
        form_id: form_id,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data     
        wx.hideLoading();
        let resData = res.data
        if (resData.status == 0) {
          wx.showModal({
            title: '提示',
            content: resData.err,
            confirmText: '我知道了',
            showCancel: false
          })
        }
        if (resData.status == 1) {
          wx.showModal({
            title: '提示',
            content: '取消报名成功!',
            confirmText: '我知道了',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                that.bookqueryMessage();
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
  //跳转到课程明细页面
  _book02: function (e) {
    let form_id = e.detail.formId;
    let courseid = e.detail.target.dataset.id;
    wx.navigateTo({
      url: '../make/book?formid=' + form_id + '&courseid=' + courseid+'&usertype=' + app.globalData.usertype + '&userid=' + app.globalData.userId + '&bossid=' + app.globalData.bossid
    })
  },
})