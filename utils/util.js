const formatNumber = (n) => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function isToday(day) {
  var year1 = day.getFullYear()
  var month1 = day.getMonth() + 1
  var day1 = day.getDate()

  var day2 = new Date();
  var year2 = day2.getFullYear()
  var month2 = day2.getMonth() + 1
  var day2 = day2.getDate()

  return (year1 + '' + month1 + '' + day1) == (year2 + '' + month2 + '' + day2);
}

function convertDateFromTimeZone(timeZone, formatStr) {
  if (!timeZone) {
    return "";
  } else {
    let data = new Date(timeZone);
    return convertDateWithFormartStr(data, formatStr);
  }
}

function convertDateWithFormartStr(data, formatStr) {
  let str = formatStr;
  let Week = ['日', '一', '二', '三', '四', '五', '六'];

  str = str.replace(/yyyy|YYYY/, data.getFullYear());
  str = str.replace(/yy|YY/, formatNumber(data.getYear() % 100));

  str = str.replace(/MM/, formatNumber(data.getMonth() + 1));
  str = str.replace(/M/g, (data.getMonth() + 1));

  str = str.replace(/w|W/g, Week[data.getDay()]);

  str = str.replace(/dd|DD/, formatNumber(data.getDate()));
  str = str.replace(/d|D/g, data.getDate());

  str = str.replace(/hh|HH/, formatNumber(data.getHours()));
  str = str.replace(/h|H/g, data.getHours());
  str = str.replace(/mm/, formatNumber(data.getMinutes()));
  str = str.replace(/m/g, data.getMinutes());

  str = str.replace(/ss|SS/, formatNumber(data.getSeconds()));
  str = str.replace(/s|S/g, data.getSeconds());

  return str;
}

function convertR(url, options) {
  var tmpHeader = {};
  var tokenInfo = wx.getStorageSync('tokenInfo') || {};
  if (options.method) {
    tmpHeader = {
      'Accept': 'application/json',
      'content-type': 'application/json'
    }
  }
  tmpHeader['X-Gegee-Token'] = `${tokenInfo.token}`
  if (options.queryParams) {
    url += '?';
    for (let dataKey in options.queryParams) {
      url += `${dataKey}=${options.queryParams[dataKey]}&`;
    }
    delete options.queryParams;
  }

  if (options.pathParams) {
    for (let paramKey in options.pathParams) {
      url = url.replace(`{${paramKey}}`, options.pathParams[paramKey]);
    }
    delete options.pathParams;
  }
  return {
    url: encodeURI(url),
    header: tmpHeader,
    data: options.data,
    method: options.method ? options.method : 'GET',
  }
}

function gjRequest(url, options) {
  wx.getNetworkType({
    success: function(res) {
      if (res.networkType == 'none') {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '网络请求失败，请稍后重试',
          showCancel: false
        })
        return;
      }
      getApp().doUploadOfflineData(() => {
        let tmpOptions = convertR(url, options);
        options.hiddenLoading = options.hiddenLoading == undefined ? true : options.hiddenLoading
        options.showModal = options.showModal == undefined ? true : options.showModal
        wx.request({
          ...tmpOptions,
          success: function(res) {
            convertNullToEmpty(res.data)
            if (res.statusCode == 401 && res.data.errorCode == 4011) {
              wx.showModal({
                title: '提示',
                content: '登陆信息失效，请重新登陆。',
                showCancel: false
              })
              // var tokenInfo = wx.getStorageSync('tokenInfo');
              // wx.request({
              //   // url: `https://apigw.jiaj.com.cn/application/token/${tokenInfo.token}`,
              //   url: `http://dev.rnd.gegee.cc:80/application/token/${tokenInfo.token}`,
              //   method: 'POST',
              //   header: {
              //     'Accept': 'application/json',
              //     'Content-Type': 'application/json',

              //   },
              //   data: {
              //     refreshToken: tokenInfo.refreshToken
              //   },
              //   success: function(res2) {
              //     wx.setStorageSync('tokenInfo', res2.data);
              //     gjRequest(url, options);
              //   }
              // })
            } else if (res.statusCode >= 400 && res.statusCode < 500) {
              if (options.hiddenLoading) {
                wx.hideLoading()
              }
              options.fail && options.fail(res)
            } else {
              if (options.hiddenLoading) {
                wx.hideLoading()
              }
              if (res.statusCode == 500 && options.showModal) {
                wx.showModal({
                  title: '提示',
                  content: options.message || '服务器错误，请稍后重试',
                  showCancel: false,
                  success: (_res) => {
                    options.fail && options.fail(res)
                  }
                })
              } else {
                options.success && options.success(res)
              }
            }
          },
          fail: function(res) {
            if (options.hiddenLoading) {
              wx.hideLoading()
            }
            if (options.offlineMode) {
              getApp().setUnUploadData(tmpOptions);
              wx.showModal({
                title: '提示',
                content: '网络环境不佳，稍后打开，数据将自动上传',
                showCancel: false,
                success: (modalSuccess) => {
                  wx.hideLoading();
                  options.fail && options.fail(res)
                }
              })
              return;
            } else {
              wx.showModal({
                title: '提示',
                content: '网络请求失败，请稍后重试',
                showCancel: false,
                success: (modalSuccess) => {
                  wx.hideLoading();
                  options.fail && options.fail(res)
                }
              })
            }
          },
          complete: function(res) {

            options.complete && options.complete(res);
          }
        })
      })
    }
  })
}

// const gjRequestAsync = async(url, options) => {
//   let tmpOptions = convertR(url, options);
//   options.hiddenLoading = options.hiddenLoading == undefined ? true : options.hiddenLoading
//   options.showModal = options.showModal == undefined ? true : options.showModal
//   let ret = await new Promise((resolve, reject) => {
//     wx.request({
//       ...tmpOptions,
//       success: function(res) {
//         convertNullToEmpty(res.data)
//         if (res && res.statusCode == 200) {
//           resolve(res.data)
//         } else {
//           reject(res)
//         }
//       },
//       fail: function(res) {
//         reject(res)
//       },
//       complete: function(res) {

//       }
//     })
//   })
//   return ret;
// }

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function lifeCycle(event) { 
  let pages = getCurrentPages();
  let route = pages[pages.length - 1].route;

  getApp().getUserInfo(function(userInfo) {
    wx.request({
      // url: "http://localhost:55555/wxapp/page",
      url: "https://ga.geji.tech/wxapp/page",
      method: 'POST',
      header: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: {
        "appId": getApp().globalData.anything,
        "accessToken": userInfo.code,
        "url": route,
        "event": event
      },
      success: (requestRes) => {}
    })
  })
}

function hide() {
  lifeCycle("Hide");
}

function show() {
  lifeCycle("Show");
}

function load() {
  lifeCycle("Load");
}

function unLoad() {
  lifeCycle("Unload");
}

function convertNullToEmpty(obj) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      convertNullToEmpty(obj[i])
    }
  } else {
    if (typeof obj == 'object') {
      for (let key in obj) {
        if (Array.isArray(obj[key])) {
          convertNullToEmpty(obj[key])
        } else if (typeof obj[key] == 'object' && obj[key] != null) {
          convertNullToEmpty(obj[key])
        } else {
          obj[key] = obj[key] === 0 ? 0 : (obj[key] === false ? false : obj[key] || '')
        }
      }
    }
  }
}

function intToByteArray(num) {
  //正常情况int长度为4字节
  var byteArray = new Uint8Array(4);
  byteArray[0] = num & 0xff; //取得最后一位字节内容
  byteArray[1] = (num >> 8) & 0xff; //取倒数第二位字节内容
  byteArray[2] = (num >> 16) & 0xff; //取第二位字节内容
  byteArray[3] = (num >> 24) & 0xff; //取第一位字节内容
  return byteArray;
}

function checkScope(scope, cb) {

  wx.getSetting({
    success: (res) => {
      let tmpScope = res.authSetting[scope.code];
      let ret = tmpScope === undefined?true:tmpScope;
    
      typeof cb == "function" && cb(ret)

      // if (tmpScope === undefined) {
      // } else {
      //   if (tmpScope) {
      //     typeof cb == "function" && cb()
      //   } else {
      //     typeof cb == "function" && cb()

          //
          // wx.showModal({
          //   title: '提示',
          //   content: scope.msg,
          //   success: (res) => {
          //     if (res.confirm) {
          //       wx.openSetting({
          //         success: (res2) => {
          //           if (res2.authSetting[scope.code]) {
          //             typeof cb == "function" && cb()
          //           }
          //         }
          //       })
          //     }
          //   }
          // })
        // }
      // }
    }
  })
}


module.exports = {
  intToByteArray: intToByteArray,
  sysInfo: wx.getSystemInfoSync(),
  lifeCycle: {
    hide: hide,
    show: show,
    load: load,
    unLoad: unLoad
  },
  isToday: isToday,
  gjRequest: gjRequest,
  guid: guid,
  convertDateFromTimeZone: convertDateFromTimeZone,
  convertDateWithFormartStr: convertDateWithFormartStr,
  convertR: convertR,
  // gjRequestAsync: gjRequestAsync,
  checkScope: checkScope
}