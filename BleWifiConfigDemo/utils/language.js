var langData = null;

function getLanguage() {
  //返回缓存中的language属性 (en_us / zh_cn) 	
  return wx.getStorageSync('language') || 'zh_cn'
};

function setLanguage(language) {
  return wx.setStorageSync('language', language);
};

function initLanguage(language){
  console.log("initLanguage lang:" + language, langData)
  //返回翻译的对照信息
  if(language){
    langData = require('../i18n/'+ language + '.js').langData;
  }
}

function translate(key){
  //翻译
  if(langData){
    return langData[key] || '';
  }
  return '';
}

function getLangData(){
  return langData;
}

module.exports = {
  getLanguage: getLanguage,
  setLanguage: setLanguage,
  initLanguage: initLanguage,
  $t: translate,
  langData: getLangData,
}