const app = getApp();
const { default: DeviceType } = require('./DeviceType.js');
let medicaBase = app.globalData.medicaBase;
let m800Api = medicaBase.m800BleApi;
let z400twp3BleApi = medicaBase.z400twp3BleApi;
let m871wApi = medicaBase.m871wBleApi;
let sn913eApi = medicaBase.sn913eBleApi;
let sa1001BleApi = medicaBase.sa1001BleApi;
let ew202wApi = medicaBase.ew202wApi;
let bm8701_2BleApi = medicaBase.bm8701_2BleApi;
let m901lBleApi = medicaBase.m901lBleApi;
let bleApi = null;

function BleWifiConfigHelper(){

  this.bleWiFiConfig = (deviceType, address, serverIp, serverPort, ssid, ssidRaw, pwd, callback) => {
    bleApi = this.selectBleApi(deviceType);
    console.log("bleWiFiConfig bleApi", deviceType, address, serverIp, serverPort, ssid, ssidRaw, pwd, bleApi);
    if(!bleApi){
      callback && callback(false);
      return;
    }

    if (bleApi.getConnectionState() == medicaBase.BLE_RET.connection.connected) {
      console.log("bleWiFiConfig connected---------");
      this.bleWiFiConfigAfterConnected(deviceType, serverIp, serverPort, ssid, ssidRaw, pwd, callback)
    }else{
      bleApi.connectDevice(address, undefined, (result) => {
        let code = 0;
        if (typeof result === 'boolean') {
          if (result === false) {
            code = -1;
          }
        } else {
          if (result !== medicaBase.BLE_RET.status.suc) {
            code = -1;
          }
        }
        console.log("bleWiFiConfig connect---------code:" + code);
        if (code == 0) {//设备连接成功
          this.bleWiFiConfigAfterConnected(deviceType, serverIp, serverPort, ssid, ssidRaw, pwd, callback)
        }else{//设备连接失败
          callback && callback(false);
        }
      });
    }
  }

  this.bleWiFiConfigAfterConnected = (deviceType, serverIp, serverPort, ssid, ssidRaw, password, callback)=>{
    this.getDeviceInfo(deviceType, (res, obj)=>{
      if(res){
        this.setServerAddress(deviceType, serverIp, serverPort, (res)=>{
          if(res){
            this.wifiConfig(deviceType, ssid, ssidRaw, password, (res)=>{
              if(res){
                callback && callback(true, obj);
              }else{
                callback && callback(false);
              }
            })
          }else{
            callback && callback(false);
          }
        })
      }else{
        callback && callback(false);
      }
    })
  }

  this.selectBleApi = (deviceType)=> {
    if (DeviceType.isM800(deviceType)) {
      bleApi = m800Api;
    } else if (DeviceType.isZ400TWP3(deviceType)) {
      bleApi = z400twp3BleApi;
    } else if (DeviceType.isM8701W(deviceType)) {
      bleApi = m871wApi;
    }else if (DeviceType.isSN913E(deviceType)) {
      bleApi = sn913eApi;
    }else if (DeviceType.isNoxSAW(deviceType)) {
      bleApi = sa1001BleApi;
    }else if (DeviceType.isEW202W(deviceType)) {
      bleApi = ew202wApi;
    }else if (DeviceType.isBM8701_2(deviceType)) {
      bleApi = bm8701_2BleApi;
    }else if (DeviceType.isM901L(deviceType)) {
      bleApi = m901lBleApi;
    }
    return bleApi;
  }

  this.getDeviceInfo = (deviceType, callback)=>{
    if(this.isCommApi3(deviceType)){
      bleApi.getDeviceInfo({deviceType, handler: (code, obj)=>{
        console.log("getDeviceInfo code:" + code, obj);
        if(code == 0){
          let deviceInfo = {deviceId: obj.deviceId, deviceName: obj.deviceName, deviceType, curVersion: obj.currVersion};
          callback && callback(true, deviceInfo)
        }else{
          callback && callback(false)
        }
      }});
    }else if(this.isCommApi(deviceType)){
      bleApi.getSystemInfo({handler: (code , obj, status)=>{
        console.log("getDeviceInfo code:" + code, obj, status);
        if(code == 0){
          let deviceInfo = {deviceId: obj.deviceId, deviceName: obj.deviceName, deviceType, curVersion: obj.currVersion};
          callback && callback(true, deviceInfo)
        }else{
          callback && callback(false)
        }
      }});
    }
  }

  this.setServerAddress = (deviceType, serverIp, serverPort, callback)=>{
    if(this.isCommApi3(deviceType)){
      bleApi.serverConfig({deviceType, ip: serverIp, port: serverPort, timeout:10000, handler: (code)=>{
        console.log("serverConfig code:" + code);
        callback && callback(code == 0 ? true : false);
      }});
    }else if(this.isCommApi(deviceType)){
      bleApi.netSet({controlType:0, socketIp:serverIp, port:serverPort, httpIp:"", timeout:10000, handler: (code, obj, status)=>{
        console.log("serverConfig code:" + code, obj, status);
        callback && callback(code == 0 ? true : false)
      }});
    }
  }

  this.wifiConfig = (deviceType, ssid, ssidRaw, password, callback)=>{
    if(this.isCommApi3(deviceType)){
      bleApi.wifiConfig({deviceType, ssid, ssidRaw, password, timeout:10000, handler: (code)=>{
        console.log("wifiConfig code:" + code);
        callback && callback(code == 0 ? true : false)
      }})
    }else if(this.isCommApi(deviceType)){
      bleApi.wifiConfig({SSID:ssid, ssidRaw, pswMode:1, psw:password, ipMode:0, timeout:10000, handler: (code, obj, status)=>{
        console.log("wifiConfig code:" + code, obj, status);
        callback && callback(code == 0 ? true : false)
      }});
    }
  }

  this.isCommApi = (deviceType)=>{
    switch(deviceType){
      case DeviceType.DEVICE_TYPE_NOX_SAW:
        return true;
    }
    return false;
  }

  this.isCommApi2 = (deviceType)=>{
    return false;
  }

  this.isCommApi3 = (deviceType)=>{
    switch(deviceType){
      case DeviceType.DEVICE_TYPE_M800:
      case DeviceType.DEVICE_TYPE_Z400TWP3:
      case DeviceType.DEVICE_TYPE_M8701W:
      case DeviceType.DEVICE_TYPE_SN913E:
      case DeviceType.DEVICE_TYPE_EW202W:
      case DeviceType.DEVICE_TYPE_BM8701_2:
      case DeviceType.DEVICE_TYPE_M901L:
        return true;
    }
    return false;
  }
};

let bleWifiConfigHelper = new BleWifiConfigHelper();
export default bleWifiConfigHelper
