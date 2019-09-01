var app = getApp();
import {
  convertDateFromTimeZone,
  checkScope,
  sysInfo
} from '../../../utils/util.js';
const TODAY = new Date();
const ONE_DAY = 24 * 60 * 60 * 1000;
const DEFAULT_DAY = new Date();
let scope={
  userLocation: {
    code: 'scope.userLocation',
      msg: '需要获取您的位置信息，请到小程序的设置中打开授权'
  }
}
Page({
  data:{
    width: sysInfo.windowWidth,
    month: TODAY.getTime(),
    selectedMonth: TODAY.getTime(),
    showrightMonth:true,
    showLeftMonth:true,
    start: convertDateFromTimeZone(TODAY.getTime(), 'yyyy-MM-dd'),  //开始
    selectMonthText: convertDateFromTimeZone(TODAY.getTime(), 'MM月dd日 周W'),
    courseinfo:[],//课程
    listTime:[],
    loaded: false,
  },
  onLoad: function (options) {
    //this.makemessage();
    let date = new Date();
    let start=convertDateFromTimeZone(TODAY.getTime(), 'yyyy-MM-dd');
    let showDate = convertDateFromTimeZone(TODAY.getTime(), 'MM月dd日 周W');
    let listTime = [{ 'showDate': showDate, 'start': start}];
    for (var i = 1; i <= 7; i++) {//后7天
      date.setDate(date.getDate() + 1);
      showDate = convertDateFromTimeZone(date, 'MM月dd日 周W');
     start = convertDateFromTimeZone(date, 'yyyy-MM-dd');
      listTime.push({
        showDate: showDate,
        start: start,
      });
    };
    this.setData({
      listTime:listTime,
    })
  },
  onShow: function () {
    this.makemessage();
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  //选择-
  previousMonth: function () {
    // let form_id = e.detail.formId;
    let monthText = this.data.selectMonthText;
    let start = this.data.start;
    let dateList = [];
    let startList = [];
    for (let v in this.data.listTime) {
      let show = this.data.listTime[v].showDate;
      let show02 = this.data.listTime[v].start;
      dateList.push(show);
      startList.push(show02);
    }
    let index = dateList.indexOf(monthText);
    let index02 = startList.indexOf(start);
    let dateListVliue = dateList[index - 1];
    let dateListVliue02 = startList[index02 - 1];
    if (dateListVliue) {
      this.setData({
        selectMonthText: dateListVliue,
        start: dateListVliue02,
      }, () => {
        this.makemessage();
      })
    }
  },
  // 选择中间
  monthChange: function (e) {
    let index = e.detail.value;
    let dateListVliue = this.data.listTime[index].showDate;
    let start = this.data.listTime[index].start;
    this.setData({
      selectMonthText: dateListVliue,
      start:start,
    }, () => {
      this.makemessage();
    })
  },
  //选择+
  nextMonth: function () {
    // let form_id = e.detail.formId;
    let monthText = this.data.selectMonthText;
    let start = this.data.start;
    let dateList = [];
    let startList=[];
    for (let v in this.data.listTime) {
      let show = this.data.listTime[v].showDate;
      let show02 = this.data.listTime[v].start;
      dateList.push(show);
      startList.push(show02);
    }
    let index = dateList.indexOf(monthText);
    let index02 = startList.indexOf(start);
    let dateListVliue = dateList[index + 1];
    let dateListVliue02 = startList[index02 + 1];
    if (dateListVliue) {
      this.setData({
        selectMonthText: dateListVliue,
        start: dateListVliue02,
      }, () => {
        this.makemessage();
      })
    }

 
  },
  // 主数据
  makemessage: function (){
    // let form_id = form_id;
    // console.log(form_id);
    let that=this;
    let tmpDate = new Date(that.data.start)
    let selectedMonth = Math.round(tmpDate.getTime() / 1000).toString();

    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    wx.request({
      url: `${app.globalData.domain}/Api/Book/index`,
      data: {
        userid: app.globalData.userId,
        bossid: app.globalData.bossid,
        usertype: app.globalData.usertype,
        date:selectedMonth,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data     
        wx.hideLoading();
        let resData=res.data
        let { courseinfo, dateinfo } = resData;
        that.setData({
          courseinfo: courseinfo,
          dateinfo: dateinfo,
          loaded:true,
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
  //签到
  _signClcik04:function(e){
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
     
      checkScope(scope.userLocation, (res) => {
        if (res) {
          wx.getLocation({
            type: 'wgs84',
            altitude: true,
            success: (res) => {
              let latitude= res.latitude; //纬度
              let longitude = res.longitude;  //进度
              let that=this;
              let courseid = e.detail.target.dataset.id;
              var form_id = e.detail.formId;
              wx.showModal({
                title: '提示',
                content: '您确定签到吗？',
                success(res02) {
                  if (res02.confirm) {
                    //函数里的
                    that.signClick(latitude,longitude,form_id,courseid);
                  }
                }
              })
            },
            fail: (fail) => {
              wx.showModal({
                title: '签到失败',
                content: '无法获取GPS',
                showCancel: false
              })
            },
          })
        } else {
          //TODO:跳转设置页
          wx.navigateTo({
            url: './setting/index',
          })
        }

      })
      
    }
  },
 
  // 签到函数
  signClick: function (latitude,longitude,form_id,courseid){
    let that = this;
    wx.request({
      url: `${app.globalData.domain}/Api/Book/sign`,
      method: 'post',
      data: {
        userid: app.globalData.userId,
        bossid: app.globalData.bossid,
        courseid: courseid,
        form_id: form_id,
        latitude: latitude,
        longitude: longitude,
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
            content: '签到成功！',
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
  //跳转到课程明细页面
  _book01: function (e) {
    let form_id = e.detail.formId;
    let courseid = e.detail.target.dataset.id;
    wx.navigateTo({
      url: './book?formid=' + form_id + '&courseid=' + courseid + '&usertype=' + app.globalData.usertype + '&userid=' + app.globalData.userId + '&bossid=' + app.globalData.bossid
    })
  },
  //跳转到课程明细页面
  _book02: function (e) {
    let form_id = e.detail.formId;
    let courseid = e.detail.target.dataset.id;
    wx.navigateTo({
    url: './book?form_id=' + form_id + '&courseid=' + courseid + '&usertype=' + app.globalData.usertype + '&userid=' + app.globalData.userId + '&bossid=' + app.globalData.bossid
    })
  },


})