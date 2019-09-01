var app = getApp();
import {
  gjRequest,
  convertDateFromTimeZone,
  sysInfo
} from '../../../utils/util.js';
//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../../wxParse/wxParse.js');
Page({
  data:{
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    height: sysInfo.windowHeight,
    width: sysInfo.windowWidth,
    swiperHeight:'',
    dataList:[],
  },
  onLoad: function (options) {
    this._headerHeight();
    this.corpMessage();

  },
  // 获取轮播图高度
  _headerHeight: function () {
    let key = `#swiperH`;
    wx.createSelectorQuery()
      .select(key)
      .boundingClientRect((rect) => {
        this.setData({
          swiperHeight: rect.height,
        })

      }).exec()
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  corpMessage: function () {
    let that = this;
    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    wx.request({
      url: `${app.globalData.domain}/Api/Index/corp`,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data     
        wx.hideLoading();
        let resData = res.data;
        let dataList=[];
        for (let v in resData.pic){
          dataList.push(resData.pic[v].photo);
        }
        if (resData.corp) {
          that.setData({
            corp: resData.corp,
            dataList: dataList,
          })

          let content = resData.corp.info;
          WxParse.wxParse('content', 'html', content, that, 3);
        } else {
          wx.showModal({
            title: '提示',
            content: '暂无公司介绍！',
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
  //点击查看照片
  viewImage: function (e) {
    const { src, index } = e.target.dataset;
    wx.previewImage({
      current: src,  //当前显示的
      urls: this.data.dataList,
    });
  },
})