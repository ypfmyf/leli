var app = getApp()
var sysInfo = wx.getSystemInfoSync();
Page({
  data: {
  
    height: sysInfo.windowHeight,
    width: sysInfo.windowWidth,
    
  },
  onLoad: function (options) {

  },
  onUnload: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  openSetting:function(){
     wx.openSetting({
         success: (res2) => {
                // if (res2.authSetting[scope.code]) {
                        
                // }
           if (res2.authSetting){
                    wx.getSetting({
                      success:(res)=>{
                        if (res.authSetting){
                          wx.navigateBack({
                            deta: 1
                          })
                        }
                      }
                    })
                }
            
            }
        })
  }

})