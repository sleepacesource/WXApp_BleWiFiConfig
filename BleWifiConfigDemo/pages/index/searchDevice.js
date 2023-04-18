// pages/main/main.js

const app = getApp();
var language = require('../../utils/language.js');
const { default: DeviceType } = require('../../utils/DeviceType.js');

let medicaBase = app.globalData.medicaBase;
let commonBleApi = medicaBase.pillowBleApi;
let bleApi = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lang: null,
    statusBarHeight: 0,
    scanning: false,
    devices:[],
  },

  goBack() {
    console.log("goBack-----------")
    wx.navigateBack({
    }); //返回上一页
  },

  scanDevice(){
    console.log("scanDevice-----------")
    if(!this.scanning){
      this.searchBleDevice();
    }
  },

  stopLoading:function(){

  },

  searchBleDevice () {
    // wx.showLoading({
    //   title: '正在寻找设备',
    // })

    commonBleApi.initBle(undefined, true, (res) => {
      console.log("searchBleDevice initBle res", res);
      if (res === 0) {
        this.setData({
          scanning: true,
          devices: [],
        });

        //bleApi.stopBluetoothDevicesDiscovery()
        let scanDuration = 6 * 1000;
        let list = [];
        commonBleApi.scanBleDevices(scanDuration, true, (device)=> { // 扫描设备
          let sn = medicaBase.bufUtil.ab2str(device.advertisData);
          //console.log("searchBleDevice sn:" + sn)
          if (DeviceType.isSleepaceDevice(sn)) { // 扫到Sleepace设备就添加到数组
            let exist = false
            for (let i = 0; i < list.length; i++){
              let item = list[i]
              if (item.sn === sn){
                exist = true
                break;
              }
            }

            if (!exist){
              let deviceType = DeviceType.getDeviceType(sn);
              list.push({ deviceId: device.deviceId, sn: sn, deviceType: deviceType})
            }

            // wx.hideLoading()
            this.setData({
              devices: list,
            })
          }
        })

        setTimeout(()=>{
          commonBleApi.stopBluetoothDevicesDiscovery()
          this.setData({
            scanning: false,
          })
        }, scanDuration)

      }else{
        wx.showModal({
          title:'提示',
          content: '请确保手机蓝牙打开',
          confirmText: '确定',
          showCancel: false
        })
      }
    });
  },

  selectDevice (e) {
    console.log("selectDevice----------", e.currentTarget, "scanning:" + this.data.scanning)
    if(this.scanning){
      commonBleApi.stopBluetoothDevicesDiscovery()
      this.setData({
        scanning: false,
      })
    }

    let deviceInfo = e.currentTarget.id.split(',');
    let deviceId = deviceInfo[0];
    let deviceName = deviceInfo[1];
    let deviceType = parseInt(deviceInfo[2]);
    console.log("selectDevice----------deviceType:" + deviceType)
    if(DeviceType.isM800(deviceType) || DeviceType.isZ400TWP3(deviceType) || DeviceType.isM8701W(deviceType) || DeviceType.isSN913E(deviceType) ||
      DeviceType.isNoxSAW(deviceType) || DeviceType.isEW202W(deviceType) || DeviceType.isBM8701_2(deviceType) || DeviceType.isM901L(deviceType)){
      // wx.showLoading({
      //   title: '正在连接',
      // })

      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      // console.log("selectDevice------11----", prevPage)
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        device: {deviceId, deviceName, deviceType}
      })
      wx.navigateBack({}); //返回上一页
    }else{
        wx.showModal({
          title: '提示',
          content: '配网SDK暂不支持该设备',
          confirmText: '确定',
          showCancel: false
        })
    }

    // bleManager.initBle(function (res){
    //   if (!res){
    //     wx.showModal({
    //       title: '提示',
    //       content: '请确保手机蓝牙打开',
    //       confirmText: '确定',
    //       showCancel: false
    //     })
    //     wx.hideLoading()
    //     return;
    //   }

    //   wx.showLoading({
    //     title: '正在连接',
    //   })
    //   let connectDeviceId = e.currentTarget.id.split(',')[0];
    //   let deviceName = e.currentTarget.id.split(',')[1];

    //   bleManager.connectDevice({
    //     deviceId: connectDeviceId,
    //     deviceName: deviceName,
    //     callback: function (ret) {
    //       if (consts.kOperationStatus.Succeed != ret) { // 失败则弹框提示
    //         wx.hideLoading()
    //         that.dialog.showDialog();
    //       } else {
    //         let deviceId = dataManager.deviceInfo.deviceId
    //         let deviceVersion = dataManager.deviceInfo.softVersion
    //         deviceService.bind({  // 连接成功则与调用接口与服务器绑定
    //           user: dataManager.userLoginInfo.users[0],
    //           userId: dataManager.userId,
    //           data: {
    //             deviceId: deviceId,
    //             deviceName: deviceName,
    //             deviceType: util.getDeviceType(deviceName),
    //             deviceVersion: deviceVersion
    //           },
    //           success: function (res) {  // 成功就弹框提示点击回到首页，失败则断开连接

    //             deviceService.checkFirwareUpdate({
    //               user: dataManager.userLoginInfo.users[0],
    //               data:{
    //                 deviceId: deviceId,
    //                 deviceType: DeviceType.DEVICE_TYPE_P200A
    //               },
    //               success: (res)=>{
    //                 console.log("checkFirwareUpdate res:", res)
    //                 if(res && res.deviceVersion){
    //                   let deviceInfo = dataManager.deviceInfo;
    //                   deviceInfo.deviceName = deviceName;
    //                   deviceInfo.deviceType = util.getDeviceType(deviceName);
    //                   deviceInfo.upgradeInfo = res.deviceVersion;
    //                   dataManager.setDeviceInfo(deviceInfo)
    //                 }
    //               },
    //               fail: ()=>{
    //                 console.log("checkFirwareUpdate fail----------")
    //               }
    //             })

    //             that.setData({
    //               connectedDeviceId: connectDeviceId
    //             });
    //             dataManager.setDeviceName(deviceName)
    //             dataManager.deviceId = connectDeviceId;
    //             dataManager.setDeviceCount(1);
    //             PUBSUB.emit(consts.kPubSubName.kDeviceHasBinded);
    //             let monitorTime = {
    //               startHour: 22,
    //               startMinute: 0,
    //               endHour: 7,
    //               endMinute: 0,
    //             }
    //             // deviceOpt.setMilkyMonitorTime({
    //             //   deviceId: connectDeviceId,
    //             //   deviceName: deviceName,
    //             //   deviceType: util.getDeviceType(deviceName),
    //             //   startHour: monitorTime.startHour,
    //             //   startMinute: monitorTime.startMinute,
    //             //   endHour: monitorTime.endHour,
    //             //   endMinute: monitorTime.endMinute,
    //             //   weekday: 127,
    //             //   flag: 1,
    //             // })
    //             // console.log('设置了纽扣的监测时间')
    //             // dataManager.setMonitorTime(monitorTime)

    //             // let beginDate = new Date();
    //             // let timestamp = util.timestamp();
    //             // let timezone = util.timezone();
    //             // let data = {
    //             //   timestamp: timestamp,
    //             //   timezoneOffset: timezone,
    //             //   season: 0,
    //             //   seasonOffset: 0
    //             // }
    //             // deviceOpt.checkTime(data)

    //             wx.hideLoading()
    //             wx.showToast({
    //               title: '添加成功',
    //               icon: 'none',
    //               duration: 2000
    //             })


    //             setTimeout(function(){
    //               wx.reLaunch({
    //                 url: '../main/main',
    //               })
    //             },2000)

    //           },

    //           fail: function (res) {
    //             wx.hideLoading()
    //             wx.showToast({
    //               title: '网络不畅通，检查后再试试吧',
    //               icon: 'none',
    //               duration: 2000
    //             })
    //             ble.p200aBleApi.closeConnection()
    //           }
    //         });
    //       }
    //     }
    //   })
    // })
  },

  //取消事件
  _cancelEvent() {
    // this.dialog.hideDialog();

    // wx.navigateTo({
    //   url: "../webPage/webPage?type=" + 'p200a_connect_fail',
    // });
  },

  //确认事件
  _confirmEvent() {
    // this.dialog.hideDialog();
  },

  bluetoothAdapterStateChanged (status) {
    // console.log('蓝牙状态---kBluetoothAdapterStateChange---', status);
    // if (!status) {
    //   wx.hideLoading()
    // }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      lang: language.langData(),
      statusBarHeight: app.globalData.statusBarHeight,
    });

    // let devices = JSON.parse(options.devices)
    // let bottom = 40
    // if (app.globalData.safeArea && app.globalData.screenHeight) {
    //   bottom = bottom + (app.globalData.screenHeight - app.globalData.safeArea.bottom) * 2
    // }
    // this.setData({
    //   navH: app.globalData.navHeight,
    //   devices: devices,
    //   bottom: bottom,
    // })

    // //接收蓝牙状态消息
    // PUBSUB.on(consts.kPubSubName.kBluetoothAdapterStateChange, this.bluetoothAdapterStateChanged);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获得dialog组件
    //this.dialog = this.selectComponent("#dialog");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.scanDevice();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})
