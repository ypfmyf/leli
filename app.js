//app.js
App({
  data:{
    userId: '',
    appId: "wx905e8cbe69d3f0da",
  },
  onLaunch: function () {
    console.log(wx.getStorageSync('noneQNKey') || [])

  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      if (this.globalData.logining) {
        setTimeout(() => this.getUserInfo(cb), 500);
        return;
      }
      this.globalData.logining = true;
      //调用登录接口
      wx.showLoading({
        title: '',
      })
      wx.login({
        success: function (loginInfo) {
          let code = loginInfo.code;
          // that.getUserSessionKey(code);
          console.log('获取状态' + code);
          wx.request({
            url: `${that.globalData.domain}/Api/Login/getsessionkeys`,
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
              that.globalData.sessionId = data.session_key;
              that.globalData.openid = data.openid;
              //that._clecklogin(data.openid);
              // that.onLoginUser();
              wx.request({
                url: `${that.globalData.domain}/Api/Login/checklogin`,
                method: 'post',
                data: {
                  openid: data.openid
                },
                header: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: function (res02) {
                  //--init data     
                  wx.hideLoading();   
                  that.globalData.logining = false;
                  var data02 = res02.data;
                  if (data02.status == 0) {
                    wx.showToast({
                      title: data.err,
                      duration: 2000
                    });
                    return false;
                  }
                  if (data02.status == 2) {
                    that.globalData.userId = data02.userid;
                    that.globalData.bossid = data02.bossid; //是否是会员
                    that.globalData.usertype = data02.usertype; //用户类型
                    typeof cb == "function" && cb(data02.userid);
                  } else {
                    that.globalData.userId = null;
                    // that.globalData.bossid = data02.bossid; //是否是会员
                    // that.globalData.usertype = data02.usertype; //用户类型
                    typeof cb == "function" && cb(null);
                  }
               
           
                },
                fail: function (e02) {
                  wx.showToast({
                    title: '网络异常！请稍后再试',
                    duration: 2000
                  });
                },
              });
            },
            fail: function (e01) {
              wx.showToast({
                title: '网络异常！请稍后再试',
                duration: 2000
              });
            },
          });


        },
        fail: function () {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '网络异常，稍后再试！',
            confirmText: '我知道了',
            showCancel: false,
            success: function (res) {
              console.log('失败网');
              that.globalData.logining = false;
            }
          })
        }
      })
    }
  },
  //新的
  getUserSessionKey: function (code) {
    //用户的订单状态
    var that = this;
  },
  //判断用户接口
  _clecklogin: function (openid){
    let that=this;
   
  },
 
  globalData: {
    statusBarHeight: '',
    requesting: false,
    anything: 'em-sa',
    tokenInfo: undefined,
    logining: false,
    userInfo:null,
    sessionId:null,
    openid:null,
    userId:null,  //用户id
    bossid:null, //是否是会员
    usertype:null,  //用户类型
    shareId: 0,
    domain: 'https://lovelisports.cn/index.php',
  }
})