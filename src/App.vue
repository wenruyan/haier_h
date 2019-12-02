<template>
  <div id="app">
    <!-- <transition :name="$store.state.transitionName"> -->
    <!-- <transition :name="transitionName"> -->
    <router-view>
      <!-- 这里是会被缓存的视图组件，比如 page1,page2 -->
    </router-view>
    <!-- </transition> -->
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      transitionName: "slide-left"
    };
  },
  created() {
    document.addEventListener("load", function (event) {
      var ev = event || window.event;
      var elem = ev.target;
      if (elem.tagName.toLowerCase() == 'img') {
        //  图片加载成功
        // console.log(ev.target.style)
        // ev.target.style = "background-color:transparent;" + ev.target.style
        ev.target.style.backgroundColor = "transparent";
      }
    }, true);
  },
  mounted() {},
  watch: {
    $route(to, from) {
      let that = this
      // console.log(this.$router.isBack);
      // let isBack = this.$router.isBack; //  监听路由变化时的状态为前进还是后退
      // console.log(to, from);
      // if (
      //   (to.name == "index" && from.name == "mine") ||
      //   (to.name == "index" && from.name == "commodity") ||
      //   (to.name == "index" && from.name == "collection")
      // ) {
      //   isBack = true;
      // }
      // if (isBack) {
      //   this.transitionName = "slide-right";
      // } else {
      //   this.transitionName = "slide-left";
      // }
      // this.$router.isBack = false;
      // 监听,当路由发生变化的时候执行
      // if (to.path == "/index" && from.path != '/') {
      //   window.location.reload();
      // }
      console.log(document.querySelector('title'))
      document.querySelector('title').innerHTML = to.meta.title
      // if (to.path == '/besikCake' || to.path == '/JDvip' || to.path == '/luckycharm') {
      //   document.querySelector('title').innerHTML = to.meta.title
      // } else {
      //   document.querySelector('title').innerHTML = '乐业卡'
      // }
      this.$wx.config(this.$store.state.companyNo, location.href, {
        debug: false,
        jsApiList: [
          "checkJsApi",
          "onMenuShareTimeline",
          "onMenuShareAppMessage",
          "onMenuShareQQ",
          "onMenuShareWeibo",
          "onMenuShareQZone"
        ]
      });
      let href = location.href;
      let i = href.lastIndexOf("/");
      href = href.substring(0, i + 1);
      // 分享给朋友、QQ、微博
      // 分享配置
      window.wx.ready(function() {
        setTimeout(() => {
          var shareData = {
            imgUrl: that.$store.state.userInfo.url || '', // 分享的图片，最好是正方形，不是也没关系，但是一定是http模式，即绝对路径，而不是服务器路径
            title: "孚库科技-乐业卡",
            desc: "员工福利，一卡在手",
            link: href + "index?companyNo=" + that.$store.state.companyNo + '&t=' + new Date().getTime(), // 这里的地址可以写死，也可以动态获取，但是一定不能带有微信分享后的参数，不然分享也是失败的
            success: function(res) {
            // alert('shared success  gagagag');
            // some thing you should do
            },
            fail: function(res) {
              alert("分享失败");
            }
          };
          window.wx.onMenuShareTimeline(shareData);
          window.wx.onMenuShareAppMessage(shareData);
          window.wx.onMenuShareQQ(shareData);
          window.wx.onMenuShareWeibo(shareData);
          window.wx.onMenuShareQZone(shareData);
        }, 500)
      });
    }
  }
};
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  & > div {
    width: 100%;
  }
  &.hasTabbar {
    padding-bottom: 0.98rem;
    height: 100vh;
  }
  .yd-tabbar {
    box-shadow: 0px 1px 20px 0px rgba(94, 94, 94, 0.1);
  }
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 300ms;
  position: absolute;
}
.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
#__vconsole {
  position: relative!important;
  z-index: 99999999!important;
}
img {
  background-color: #E5E5E5;
}
</style>
