const DEVICE_TYPE_PHONE = -1;
const DEVICE_TYPE_NONE = 0;
const DEVICE_TYPE_NOX1 = 2;
const DEVICE_TYPE_SN913 = 40;
const DEVICE_TYPE_SN913A = 41;
const DEVICE_TYPE_SN913E = 44;
const DEVICE_TYPE_SN923A = 45;
const DEVICE_TYPE_Z1 = 1;
const DEVICE_TYPE_Z2 = 9;
const DEVICE_TYPE_Z400T2 = 47;
const DEVICE_TYPE_Z400TWP2 = 37;
const DEVICE_TYPE_Z400TWP3 = 20489;
const DEVICE_TYPE_PILLOW = 3;    //枕头
const DEVICE_TYPE_MILKY = 10;
const DEVICE_TYPE_NOX2_B = 11; //SN902B
const DEVICE_TYPE_MILKY2 = 0x10; //B502 16
const DEVICE_TYPE_MILKY2T = 0x11; //B502T 17
const DEVICE_TYPE_NOX_SAW = 0x17; // SA1001 23
const DEVICE_TYPE_NOX_SAB = 0x18; //24
const DEVICE_TYPE_NOX_SAB_4 = 0x19; //25
const DEVICE_TYPE_P300 = 0x0022;
const DEVICE_TYPE_M800 = 0x0026;
const DEVICE_TYPE_P200A = 0x002E; //46
const DEVICE_TYPE_M8701W = 0x0034; //M8701W
const DEVICE_TYPE_EW201B = 0x1D;  // EW201B
const DEVICE_TYPE_EW202W = 0x35;  // EW202W
const DEVICE_TYPE_BM8701_2 = 0x31;  // BM8701-2 49

function isSleepaceDevice(deviceName){
  if (!deviceName) {
    return false;
  }
  let rule = /^[0-9a-zA-Z]{13}$/;
  if (rule.test(deviceName)) {
    return true;
  }
  return false;
}

function getDeviceType(deviceName) {
  var types = [
    {rule: /^NOX[0-9a-zA-Z]{9,10}/, type: DEVICE_TYPE_NOX1},
    {rule: /^SN21[0-9a-zA-Z]{9}/, type: DEVICE_TYPE_NOX2_B},
    {rule: /^SN-21[0-9a-zA-Z]{8}/, type: DEVICE_TYPE_NOX2_B},
    {rule: /^SA11[0-9a-zA-Z]{9}/, type: DEVICE_TYPE_NOX_SAW},
    {rule: /^SA12[0-9a-zA-Z]{9}/, type: DEVICE_TYPE_NOX_SAB},
    {rule: /^P200A[0-9a-zA-Z]{8}/, type: DEVICE_TYPE_P200A},
    {rule: /^HP10[0-9a-zA-Z]{9}/, type: DEVICE_TYPE_P200A},
    {rule: /^P[1-9][-0-9a-zA-Z]{10,11}/, type: DEVICE_TYPE_PILLOW},
    {rule: /^B502T[0-9a-zA-Z]{8}/, type: DEVICE_TYPE_MILKY2T},
    {rule: /^B502[0-9a-zA-Z]{9}/, type: DEVICE_TYPE_MILKY2},
    {rule: /^B[1-9][-0-9a-zA-Z]{10,11}/, type: DEVICE_TYPE_MILKY},
    {rule: /^BM872[0-9a-zA-Z]{8}/, type: DEVICE_TYPE_BM8701_2},
    {rule: /^M871W[0-9a-zA-Z]{8}/, type: DEVICE_TYPE_M8701W},
    {rule: /^M8[-0-9a-zA-Z]{11}/, type: DEVICE_TYPE_M800},
    {rule: /^SN91A[0-9a-zA-Z]{8}/, type: DEVICE_TYPE_SN913A},
    {rule: /^SN91E[0-9a-zA-Z]{8}/, type: DEVICE_TYPE_SN913E},
    {rule: /^SN913[0-9a-zA-Z]{8}/, type: DEVICE_TYPE_SN913},
    {rule: /^Z40T2[0-9a-zA-Z]{8}/, type: DEVICE_TYPE_Z400T2},
    {rule: /^Z40TWP[0-9a-zA-Z]{8}/, type: DEVICE_TYPE_Z400TWP2},
    {rule: /^ZTW3[0-9a-zA-Z]{9}/, type: DEVICE_TYPE_Z400TWP3},
    {rule: /^EW3B[0-9a-zA-Z]{8}/, type: DEVICE_TYPE_EW201B},
    {rule: /^EW22W[0-9a-zA-Z]{8}/, type: DEVICE_TYPE_EW202W},
    {rule: /^SA14[0-9a-zA-Z]{9}/, type: DEVICE_TYPE_NOX_SAB_4},
  ];

  if (!deviceName) {
    return DEVICE_TYPE_NONE;
  }

  for (let i = 0; i < types.length; i++) {
    const item = types[i];
    let ruleType = Object.prototype.toString.call(item.rule);
    if (ruleType === "[object RegExp]") {
      if (item.rule.test(deviceName)) {
        return item.type
      }
    } else if (ruleType === "[object Function]") {
      if (item.rule(deviceName)) {
        return item.type
      }
    }
  }
  return DEVICE_TYPE_NONE;
}

function getDeviceTypeByWiFiName(wifiName) {
  var types = [
    {rule: /^(Sleepace Nox )[0-9a-zA-Z]{4,6}/, type: DEVICE_TYPE_NOX1},
    {rule: /^(SN923A-)[0-9a-zA-Z]{4}/, type: DEVICE_TYPE_SN923A},
    {rule: /^(SN913A-)[0-9a-zA-Z]{4}/, type: DEVICE_TYPE_SN913A},
    {rule: /^(SN913E-)[0-9a-zA-Z]{4}/, type: DEVICE_TYPE_SN913E},
    {rule: /^(JDDengJu)[0-9a-zA-Z]{4}/, type: DEVICE_TYPE_SN913E},
    {rule: /^(SN913-)[0-9a-zA-Z]{4}/, type: DEVICE_TYPE_SN913},
    {rule: /^(RestOn Z400TWP )[0-9a-zA-Z]{3,6}/, type: DEVICE_TYPE_Z400TWP2},
    {rule: /^(Hi- Sleepace-RestOn-)[0-9a-zA-Z]{6,12}/, type: DEVICE_TYPE_Z400TWP2},
    {rule: /^(Hi- Wanan-Z400TWP-)[0-9a-zA-Z]{6,14}/, type: DEVICE_TYPE_Z400TWP2},
    {rule: /^(Hi- Medicatech-RestOn-)[0-9a-zA-Z]{6,10}/, type: DEVICE_TYPE_Z400TWP2}
  ];

  if (!wifiName) {
    return DEVICE_TYPE_NONE;
  }

  for (let i = 0; i < types.length; i++) {
    const item = types[i];
    let ruleType = Object.prototype.toString.call(item.rule);
    if (ruleType === "[object RegExp]") {
      if (item.rule.test(wifiName)) {
        return item.type
      }
    } else if (ruleType === "[object Function]") {
      if (item.rule(wifiName)) {
        return item.type
      }
    }
  }
  return DEVICE_TYPE_NONE;
}

function isPhone(deviceType) {
  switch (deviceType) {
    case DEVICE_TYPE_PHONE:
      return true;
  }
  return false;
}

function isReston(deviceType) {
  return isZ1(deviceType) || isZ2(deviceType) || isZ400T2(deviceType) || isZ400TWP2(deviceType);
}

function isZ1(deviceType) {
  switch (deviceType) {
    case DEVICE_TYPE_Z1:
      return true;
  }
  return false;
}

function isZ2(deviceType) {
  switch (deviceType) {
    case DEVICE_TYPE_Z2:
      return true;
  }
  return false;
}

function isZ400T2(deviceType) {
  switch (deviceType) {
    case DEVICE_TYPE_Z400T2:
      return true;
  }
  return false;
}

function isZ400TWP2(deviceType) {
  switch (deviceType) {
    case DEVICE_TYPE_Z400TWP2:
      return true;
  }
  return false;
}

function isZ400TWP3(deviceType) {
  switch (deviceType) {
    case DEVICE_TYPE_Z400TWP3:
      return true;
  }
  return false;
}

function isSleepDot(deviceType) {
  switch (deviceType) {
    case DEVICE_TYPE_MILKY:
    case DEVICE_TYPE_MILKY2:
    case DEVICE_TYPE_MILKY2T:
      return true;
  }
  return false;
}

function isB501(deviceType) {
  switch (deviceType) {
    case DEVICE_TYPE_MILKY:
      return true;
  }
  return false;
}

function isSleepDotB502T(deviceType) {
  switch (deviceType) {
    case DEVICE_TYPE_MILKY2T:
      return true;
  }
  return false;
}

function isPillow(deviceType) {
  switch (deviceType) {
    case DEVICE_TYPE_PILLOW:
      return true;
  }
  return false;
}

function isP200A(deviceType) {
  switch (deviceType) {
    case DEVICE_TYPE_P200A:
      return true;
  }
  return false;
}

function isNox1(deviceType) {
  switch (deviceType) {
    case DEVICE_TYPE_NOX1:
      return true;
  }
  return false;
}

function isNox2B(deviceType) {
  switch (deviceType) {
    case DEVICE_TYPE_NOX2_B:
      return true;
  }
  return false;
}

function isM800(deviceType) {
  switch (deviceType) {
    case DEVICE_TYPE_M800:
      return true;
  }
  return false;
}

function isM8701W(deviceType) {
  switch (deviceType) {
    case DEVICE_TYPE_M8701W:
      return true;
  }
  return false;
}

function isSN91(deviceType) {
  if (isSN913(deviceType) || isSN913A(deviceType) || isSN913E(deviceType) || isSN923A(deviceType)) {
    return true;
  }
  return false;
}

function isSN913(deviceType) {
  switch (deviceType) {
    case DEVICE_TYPE_SN913:
      return true;
  }
  return false;
}

function isSN913A(deviceType) {
  switch (deviceType) {
    case DEVICE_TYPE_SN913A:
      return true;
  }
  return false;
}

function isSN913E(deviceType) {
  switch (deviceType) {
    case DEVICE_TYPE_SN913E:
      return true;
  }
  return false;
}

function isSN923A(deviceType) {
  switch (deviceType) {
    case DEVICE_TYPE_SN923A:
      return true;
  }
  return false;
}

function isNoxSA(deviceType) {
  return isNoxSAB(deviceType) || isNoxSAW(deviceType) || isNoxSAB4(deviceType) ;
}

function isNoxSAW(deviceType) {
  switch (deviceType) {
    case DEVICE_TYPE_NOX_SAW:
      return true;
  }
  return false;
}

function isNoxSAB(deviceType) {
  switch (deviceType) {
    case DEVICE_TYPE_NOX_SAB:
      return true;
  }
  return false;
}

function isNoxSAB4(deviceType) {
  switch (deviceType) {
    case DEVICE_TYPE_NOX_SAB_4:
      return true;
  }
  return false;
}

function isEW201B(deviceType) {
  switch (deviceType) {
    case DEVICE_TYPE_EW201B:
      return true;
  }
  return false
}

function isEW202W(deviceType) {
  switch (deviceType) {
    case DEVICE_TYPE_EW202W:
      return true;
  }
  return false
}

function isBM8701_2(deviceType) {
  switch (deviceType) {
    case DEVICE_TYPE_BM8701_2:
      return true;
  }
  return false
}

/**
 * 通过ble方式绑定的设备
 * @param deviceType
 * @returns {boolean}
 */
function isBleBind(deviceType) {
  return isM800(deviceType) || isP200A(deviceType) || isNox2B(deviceType) || isNoxSAB(deviceType) || isSleepDot(deviceType) || isReston(deviceType) || isM871W(deviceType) || isSN913E(deviceType) ||   isEW201B(deviceType) || isEW202W(deviceType)  || isNoxSAB4(deviceType)
}

function isAidDevice(deviceType) {
  if (isNox1(deviceType) || isNoxSA(deviceType) || isNox2B(deviceType) || isSN91(deviceType) || isEw201b(deviceType) || isEw202w(deviceType) || isNoxSAB4(deviceType)) {
    return true;
  }
  return false;
}

function isMonitorDevice(deviceType) {
  if (isReston(deviceType) || isPillow(deviceType) || isP200A(deviceType) || isSleepDot(deviceType) || isM800(deviceType) || isM871W(deviceType)) {
    return true;
  }
  return false;
}

export default {
  DEVICE_TYPE_PHONE,
  DEVICE_TYPE_NONE,
  DEVICE_TYPE_NOX1,
  DEVICE_TYPE_Z1,
  DEVICE_TYPE_Z2,
  DEVICE_TYPE_Z400T2,
  DEVICE_TYPE_Z400TWP2,
  DEVICE_TYPE_Z400TWP3,
  DEVICE_TYPE_PILLOW,
  DEVICE_TYPE_P200A,
  DEVICE_TYPE_MILKY,
  DEVICE_TYPE_MILKY2,
  DEVICE_TYPE_MILKY2T,
  DEVICE_TYPE_P300,
  DEVICE_TYPE_M800,
  DEVICE_TYPE_M8701W,
  DEVICE_TYPE_SN913,
  DEVICE_TYPE_SN913A,
  DEVICE_TYPE_SN913E,
  DEVICE_TYPE_SN923A,
  DEVICE_TYPE_NOX2_B,
  DEVICE_TYPE_NOX_SAB,
  DEVICE_TYPE_NOX_SAW,
  DEVICE_TYPE_EW201B,
  DEVICE_TYPE_EW202W,
  DEVICE_TYPE_NOX_SAB_4,
  DEVICE_TYPE_BM8701_2,
  isSleepaceDevice,
  getDeviceType,
  getDeviceTypeByWiFiName,
  isPhone,
  isReston,
  isZ1,
  isZ2,
  isZ400T2,
  isZ400TWP2,
  isZ400TWP3,
  isSleepDot,
  isB501,
  isSleepDotB502T,
  isPillow,
  isP200A,
  isNox1,
  isNox2B,
  isNoxSA,
  isNoxSAW,
  isNoxSAB,
  isNoxSAB4,
  isAidDevice,
  isMonitorDevice,
  isBleBind,
  isM800,
  isM8701W,
  isSN91,
  isSN913,
  isSN913A,
  isSN913E,
  isSN923A,
  isEW201B,
  isEW202W,
  isBM8701_2
}
