// index.js
// 获取应用实例
import DeviceType from "../../utils/DeviceType";

const app = getApp()
const language = require('../../utils/language.js');
import bleWifiConfigHelper from "../../utils/BleWifiConfigHelper.js";
import util from "../../utils/util.js";

Page({
  data: {
    lang: null,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    serverIp: "120.24.68.136",
    serverPort: 29012,
    ssid: "",
    password: "",
    device: null,
    version: app.globalData.appVersion
  },

  // 事件处理函数
  // bindViewTap() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },

  selectDevice(){
    console.log("index selectDevice----------");
    wx.navigateTo({
      url: 'searchDevice',
    })
  },

  inputServerIp(e){
    this.setData({
      serverIp: e.detail.value
    });
  },

  inputServerPort(e){
    this.setData({
      serverPort: e.detail.value
    });
  },

  inputSsid(e){
    this.setData({
      ssid: e.detail.value
    });
  },

  inputPassword(e){
    this.setData({
      password: e.detail.value
    });
  },

  configWifi(){
    //console.log("index configWifi----------", bleWifiConfigHelper, util);
    if(this.data.device){
      // let isValidIP = util.isValidIP(this.data.serverIp);
      if(!this.data.serverIp){
        wx.showModal({
          title: '提示',
          content: '服务器IP或域名不能为空',
          confirmText: '确定',
          showCancel: false
        })
        return;
      }

      if(!this.data.serverPort || this.data.serverPort > 65535){
        wx.showModal({
          title: '提示',
          content: '服务器端口错误',
          confirmText: '确定',
          showCancel: false
        })
        return;
      }

      if(!this.data.ssid && !DeviceType.isM901L(this.data.device.deviceType)){
        wx.showModal({
          title: '提示',
          content: 'WiFi名称错误',
          confirmText: '确定',
          showCancel: false
        })
        return;
      }

      if(!this.data.password && !DeviceType.isM901L(this.data.device.deviceType)){
        wx.showModal({
          title: '提示',
          content: 'WiFi密码不能为空',
          confirmText: '确定',
          showCancel: false
        })
        return;
      }

      wx.showLoading({
        title: '配网中...',
      })

      let ssidRaw = null;
      if(this.data.ssid){
        ssidRaw = this.toUTF8(this.data.ssid);
      }

      console.log("bleWiFiConfig---------", this.data, typeof this.data.device.deviceType)
      bleWifiConfigHelper.bleWiFiConfig(this.data.device.deviceType, this.data.device.deviceId, this.data.serverIp, this.data.serverPort,
        this.data.ssid, ssidRaw, this.data.password, (res, obj)=>{
          console.log("bleWiFiConfig res:" + res+",deviceInfo:" + JSON.stringify(obj))
          wx.hideLoading();
          if(res){
            wx.showModal({
              title: '提示',
              content: '配网成功',
              confirmText: '确定',
              showCancel: false
            })
          }else{
            wx.showModal({
              title: '提示',
              content: '配网失败',
              confirmText: '确定',
              showCancel: false
            })
          }
        }
      );
    }else{
      wx.showModal({
        title: '提示',
        content: '请先选择要配网的设备',
        confirmText: '确定',
        showCancel: false
      })
    }
  },

  onLoad() {
    console.log("index onLoad----------", this.device);
    this.setData({
      lang: language.langData(),
    });

    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },

  onUnload(){
    console.log("index onUnload----------");
  },


  onReady(){
    console.log("index onReady----------");
    wx.setNavigationBarTitle({
      title: language.$t('app_name')
    })

  },

  onShow(){
    console.log("index onShow----------", this.data.device);
    wx.startWifi({
      success: (res)=>{
        console.log("startWifi suc:" + res.errMsg)
        wx.getConnectedWifi({
          success: (res)=>{
            let wifiName = res.wifi.SSID;
            console.log("getConnectedWifi--------" + wifiName)
            this.setData({ssid: wifiName})
          },
          fail: (res)=>{
            console.log("getConnectedWifi fail:" + res.errMsg)
          }
        })
      },
      fail: (res)=>{
        console.log("startWifi fail:" + res.errMsg)
      }
    })
  },

  toUTF8(str) {
    var result = new Array();
    var k = 0;
    for (var i = 0; i < str.length; i++) {
      var j = encodeURI(str[i]);
      if (j.length == 1) { //未转换的字符
        result[k++] = j.charCodeAt(0);
      } else { // 转换成%XX情势的字符
        var bytes = j.split("%");
        for (var l = 1; l < bytes.length; l++) {
          result[k++] = parseInt("0x" + bytes[l]);
        }
      }
    }
    return result;
  },

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },




})
