import http from './http'
// import vue from '../main'
import store from '../store';
// import _ from 'lodash';
// import router from '../router';
const wx = {}
wx.config = (companyNo, url, conf) => {
  if (!store.state.userId) return false
  http.post('/focus.wxConfig', {
    companyNo: companyNo,
    url: url.split('#').toString()
  })
    .then(res => {
      console.log(res)
      if (window.wx && res.code == 200) {
        window.wx.config({
          debug: false,
          appId: res.appId, // 必填，公众号的唯一标识
          timestamp: res.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.nonceStr, // 必填，生成签名的随机串
          signature: res.signature, // 必填，签名
          jsApiList: [],
          ...conf
        })
      } else {
        console.log('获取wx.config信息出错了')
      }
    })
    .catch(err => {
      console.log(err)
    })
}
wx.getWxInfo = (companyNo, cb) => {
  http.post('/focus.findAppId', {
    companyNo: companyNo
  })
    .then(res => {
      console.log(res)
      store.commit('updateWxInfo', res.data)
      cb && cb(res.data)
    })
    .catch(err => {
      console.log(err)
    })
}
export default wx;
