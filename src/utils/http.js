import Fly from 'flyio/dist/npm/fly';
import vue from '../main'
import store from '../store';
import _ from 'lodash';
import { Indicator } from 'mint-ui';
// import router from '../router';
const http = new Fly();

// 实例级配置

// if (process.env && process.env.NODE_ENV == 'production') {
//   http.config.baseURL = 'https://dietcoke.focus-base.com/api';
//   // http.config.baseURL = 'http://210.22.122.126:13000';
// } else {
//   http.config.baseURL = '/api';
// }
http.config.baseURL = '/api';
http.config.timeout = 1000000;
http.config.parseJson = false;
http.config.withCredentials = true;
// 添加请求拦截器
http.interceptors.request.use((request) => {
  if (request.body && !request.body.hideloading) {
    Indicator.open();
  }
  if (request.method == 'POST') {
    // if (request.headers['Content-Type'].indexOf('multipart/form-data') < 0 && request.method == 'POST') {
    // 给所有请求添加自定义header
    request.headers['Content-Type'] = 'application/json;charset=UTF-8';
    let params = { // 定义部分公共参数，可以在请求时传入相同参数进行覆盖
      "companyNo": vue.$store.state.companyNo || undefined,
      "staffId": store.state.staffId || undefined,
      "openid": store.state.focusOpenId || '',
      "userId": store.state.userId || '',
      "token": store.state.token || '',
      ...request.body
    };
    request.body = params;
  }
  // 可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
  if (request.url.indexOf('bpeClean') < 0) request.url += '/0vN4' // 判断是node接口是增加/xxxx后缀
  console.log(request.url + '-> 请求报文:', request);
  return request;
});

http.interceptors.response.use(
  (response, promise) => {
    Indicator.close();
    if (_.isString(response.data)) {
      try {
        response.data = JSON.parse(response.data);
      } catch (e) {

      }
    }
    let data = response.data;
    console.log(response.request.url + '-> 返回报文:', data);
    // let specialCode = [1001, 1005]
    // if (data.code && data.code != 200 && specialCode.indexOf(Number(data.code)) == -1) {
    //   vue.$dialog.toast({
    //     mes: '请求出错：' + data.msg,
    //     timeout: 1500,
    //     callback: () => {}
    //   });
    //   return promise.reject(data);
    // } else
    // if (Number(data.code) == 1005) {
    //   vue.$dialog.toast({
    //     mes: '登录失效，请重新登录',
    //     timeout: 1500,
    //     callback: () => {}
    //   });
    //   store.commit("updateUserId", '');
    //   store.commit("updateToken", '');
    //   router.push({ name: 'login-account' });
    //   return promise.reject(data);
    // }
    if (Number(data.code) == 10086) { // 冻结，code码需要与后台确定
      vue.$dialog.toast({
        mes: '您的账号被冻结，请联系管理员',
        timeout: 2000,
        callback: () => {}
      });
      // store.commit("updateUserId", '');
      // store.commit("updateToken", '');
      setTimeout(() => {
        vue.loginOut()
      }, 2000)
      return promise.reject(data);
    }
    return promise.resolve(data);
  }, (err, promise) => {
    Indicator.close();
    console.log('interceptors err', err);
    if (err.status == 200) {
      return promise.resolve(err);
    }
    if (err.request && err.request.body && err.request.body.hideError) { // 请求参数带hideErr时，隐藏报错
      // vue.$dialog.toast({
      //   mes: '服务器出错：' + err.message,
      //   timeout: 1500,
      //   callback: () => {}
      // });
    } else {
      vue.$dialog.toast({
        mes: '服务器出错：' + err.message,
        timeout: 1500,
        callback: () => {}
      });
    }
    return promise.reject(err);
  }
);

export default http;
