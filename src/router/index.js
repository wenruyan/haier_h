import Vue from 'vue'
import Router from 'vue-router'
// import wx from '../utils/wx'
// import http from '../utils/http'
// import store from '../store/'
// import Commodity from './commodity'

Vue.use(Router)

let routeList = [{
  path: '/',
  name: '/',
  // component: () => import('../views/.vue'),
  redirect: {
    name: 'index'
  },
  meta: {
    title: '首页',
    keepAlive: false // 此组件需要被缓存
  }
}, {
  path: '/index.html',
  name: 'index.html',
  // component: () => import('../views/.vue'),
  redirect: {
    name: 'index'
  },
  meta: {
    title: '首页',
    keepAlive: false // 此组件需要被缓存
  }
}, {
  path: '/besikCake',
  name: 'besikCake',
  component: () => import('../views/login/besikCake.vue'),
  meta: {
    title: '赞积分-贝思客蛋糕',
    keepAlive: false // 此组件需要被缓存
  }
}, {
  path: '/JDvip',
  name: 'JDvip',
  component: () => import('../views/login/JDvip.vue'),
  meta: {
    title: '赞积分-京东PLUS会员',
    keepAlive: false // 此组件需要被缓存
  }
}, {
  path: '/luckycharm',
  name: 'luckycharm',
  component: () => import('../views/Haier/luckycharm.vue'),
  meta: {
    title: '翻锦鲤抽大奖',
    keepAlive: false // 此组件需要被缓存
  }
}, {
  path: '/haier-login',
  name: 'haier-login',
  component: () => import('../views/Haier/haier-login.vue'),
  meta: {
    title: '登录',
    keepAlive: false // 此组件需要被缓存
  }
}, {
  path: '/haier-mine',
  name: 'haier-mine',
  component: () => import('../views/Haier/haier-mine.vue'),
  meta: {
    title: '我的',
    keepAlive: false // 此组件需要被缓存
  }
}, {
  path: '/haier-activationCodeCheck',
  name: 'haier-activationCodeCheck',
  component: () => import('../views/Haier/haier-activationCodeCheck.vue'),
  meta: {
    title: '详情',
    keepAlive: false // 此组件需要被缓存
  }
}, {
  path: '/haier-equityMiddle',
  name: 'haier-equityMiddle',
  component: () => import('../views/Haier/haier-equityMiddle.vue'),
  meta: {
    title: '详情',
    keepAlive: false // 此组件需要被缓存
  }
}, {
  path: '/wxguide',
  name: 'wxguide',
  component: () => import('../views/wxguide.vue'),
  meta: {
    title: '打开公众号',
    keepAlive: false // 此组件需要被缓存
  }
}]

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routeList
})

// 钩子
router.beforeEach((to, from, next) => {
  let haierPage = ['/haier-mine', '/haier-equityMiddle', '/haier-activationCodeCheck'];

  // 海尔页面判断登录
  if (haierPage.indexOf(to.path) != -1) {
    if (!localStorage.getItem('haierUserInfo') || localStorage.getItem('haierUserInfo') == "{}") {
      // 没有登录或者本人的公司编号和链接进入的公司编号不一致
      next({
        path: "/haier-login",
        replace: true
      });
      return false
    }
  }
  if (from.path != '/goods-detail') {
    sessionStorage.setItem("goes", "2");
  }
  next();
});

router.afterEach((to, from) => {
  console.log('Route afterEach')
});

export default router
