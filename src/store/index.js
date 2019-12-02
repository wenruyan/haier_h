import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userId: '',
    staffId: '',
    token: '',
    phone: '',
    systemInfo: {},
    inputPhone: '',
    transitionName: 'slide-left',
    focusOpenId: '',
    companyNo: '',
    hBesCode: "",
    hJdCode: "",
    // 海尔用户信息
    haierUserInfo: {},
    haierPhone: '',
    fpUserInfo: {}
  },
  mutations: {
    updateOpenId(state, change) {
      state.focusOpenId = change || '';
      localStorage.setItem('focusOpenId', state.focusOpenId)
    },
    updateCompanyNo(state, change) {
      state.companyNo = change || '';
      localStorage.setItem('companyNo', state.companyNo)
    },
    updateToken(state, change) {
      state.token = change || '';
      localStorage.setItem('token', state.token)
    },
    updateUserId(state, change) {
      state.userId = change || '';
      localStorage.setItem('userId', state.userId)
    },
    updateStaffId(state, change) {
      state.staffId = change || '';
      localStorage.setItem('staffId', state.staffId)
    },
    updateUserInfo(state, change) {
      state.userInfo = change || {};
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
    },
    updateHaierUserInfo(state, change) {
      state.haierUserInfo = change || {};
      localStorage.setItem('haierUserInfo', JSON.stringify(state.haierUserInfo))
    },
    updateHaierPhone(state, change) {
      state.haierPhone = change || '';
      localStorage.setItem('haierPhone', state.haierPhone)
    },
    updateFpUserInfo(state, change) {
      state.fpUserInfo = change || {};
      localStorage.setItem('fpUserInfo', JSON.stringify(state.fpUserInfo))
    },
    updateUserImgUrl(state, change) {
      state.userImgUrl = change || {};
      localStorage.setItem('userImgUrl', state.userImgUrl)
    },
    updateSystemInfo(state, change) {
      state.systemInfo = {
        ...state.systemInfo,
        ...change
      };
    },
    updateInputPhone(state, change) {
      state.inputPhone = change || '';
    },
    updatePhone(state, change) {
      state.phone = change || '';
    },
    updateTransitionName(state, change) {
      state.transitionName = change || 'slide-left';
    },
    updateHbesCode(state, change) {
      state.hBesCode = change || '';
      localStorage.setItem('hBesCode', state.hBesCode)
    },
    updateHjdCode(state, change) {
      state.hJdCode = change || '';
      localStorage.setItem('hJdCode', state.hJdCode)
    },
    updateWxInfo(state, change) {
      state.wxInfo = {
        ...change
      } || {};
      localStorage.setItem('wxInfo', JSON.stringify(state.wxInfo))
    },
    resetInfo(state, change) {
      state.token = '';
      state.userId = '';
      state.staffId = '';
      state.userInfo = {};
      localStorage.clear();
    }
  },
  actions: {

  }
})
