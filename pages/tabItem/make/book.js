var app = getApp();
import {
  convertDateFromTimeZone,
  sysInfo
} from '../../../utils/util.js';
Page({
  data: {
    width: sysInfo.windowWidth,
    form_id:'',
    courseid:'',
    moreinfo:'',
    usertype:'',
    userId:'',
    bossid:'',
    loaded:false,
  },
  onLoad: function (options) {
    this.setData({
      form_id: options.form_id,
      courseid: options.courseid,
      usertype: options.usertype,
      userId: options.userid,
      bossid: options.bossid,
    },()=>{
      this.makemessage();
    })
  },
  onShow: function () {

  },
  onHide: function () {
  },
  onUnload: function () {
  },
 
  
  // 主数据
  makemessage: function () {
    let that = this;
    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    wx.request({
      url: `${app.globalData.domain}/Api/Book/coursemore`,
      method:'post',
      data: {
        userid: that.data.userId,
        bossid: that.data.bossid,
        usertype: that.data.usertype,
        courseid: that.data.courseid,
        form_id: that.data.form_id,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data     
        wx.hideLoading();
        let resData=res.data;
        if (resData.status == 0) {
          wx.showModal({
            title: '提示',
            content: resData.err,
            confirmText: '我知道了',
            showCancel: false
          })
        }
        if (resData.status == 1){
          
          let moreinfo = resData.moreinfo;
          that.setData({
            moreinfo: moreinfo,
            loaded: true,
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
  // 点击报名
  _signClcik01: function (e) {
    //访客
    if (this.data.usertype == 0) {
      wx.showModal({
        title: '提示',
        content: '请先绑定手机号！',
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
    if (this.data.usertype == 1 || this.data.usertype == 3) {
      var form_id = e.detail.formId;
      // let courseid = e.detail.target.dataset.id;
      let courseid = this.data.courseid;
      let that = this;
      console.log(courseid);
      wx.showModal({
        title: '提示',
        content: '现在就要报名吗？立刻马上！',
        success(res) {
          if (res.confirm) {
            that.appointmentClick(courseid, form_id);
          }
        }
      })
    }
  },
  //取消报名
  _signClcik02: function (e) {
    //学员与非学员的点击
    if (this.data.usertype == 0) {
      wx.showModal({
        title: '提示',
        content: '请先绑定手机号！',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/index'
            })
          }
        }
      })
    }
    if (this.data.usertype == 1 || this.data.usertype == 3) {
      let that = this;
      var form_id = e.detail.formId;
      // let courseid = e.detail.target.dataset.id;
      let courseid = this.data.courseid;
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
  //排队等通知
  _signClcik03: function (e) {
    //学员与非学员的点击
    if (this.data.usertype== 0) {
      wx.showModal({
        title: '提示',
        content: '请先绑定手机号！',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/index'
            })
          }
        }
      })
    }
    if (this.data.usertype == 1 || this.data.usertype == 3) {
      let that = this;
      var form_id = e.detail.formId;
      // let courseid = e.detail.target.dataset.id;
      let courseid = this.data.courseid;
      wx.showModal({
        title: '提示',
        content: '排队吗？有空位了会微信提示您！',
        success(res) {
          if (res.confirm) {
            //函数里的

            that.informClick(courseid, form_id);
          }
        }
      })
    }
  },
  //课程已开始
  _signClcik06: function (e) {
    //访客
    if (this.data.usertype == 0) {
      wx.showModal({
        title: '提示',
        content: '请先绑定手机号！',
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
    if (this.data.usertype == 1 || this.data.usertype == 3) {
      var form_id = e.detail.formId;
      // let courseid = e.detail.target.dataset.id;
      let courseid = this.data.courseid;
      let that = this;
      console.log(courseid);
      wx.showModal({
        title: '提示',
        content: '课程已开始 确定要报名吗？',
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
        userid: that.data.userId,
        bossid: that.data.bossid,
        usertype: that.data.usertype,
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
                that.makemessage();
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
  // 取消报名函数
  cancelClick: function (courseid, form_id) {
    let that = this;
    wx.request({
      url: `${app.globalData.domain}/Api/Book/cancelbook`,
      method: 'post',
      data: {
        userid: that.data.userId,
        bossid: that.data.bossid,
        usertype: that.data.usertype,
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
                that.makemessage();
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
  //排队通知函数
  informClick: function (courseid, form_id) {
    let that = this;
    wx.request({
      url: `${app.globalData.domain}/Api/Book/hold`,
      method: 'post',
      data: {
        userid: that.data.userId,
        bossid: that.data.bossid,
        usertype: that.data.usertype,
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
            content: '排队成功',
            confirmText: '我知道了',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                that.makemessage();
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

})