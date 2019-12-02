<template>
  <div class="page-wxguide">
    <img class="main-pic" src="../assets/img/wxguide-bg.png" alt="">
    <p class="text">微信搜索“乐业权益”关注公众号<br>查看我的权益</p>
    <button @click="goWx">一键复制公众号名字</button>
    <input id="copyObj" :value="copyWord" />
  </div>
</template>

<script>
import { setTimeout } from 'timers';
export default {
  name: "wx-guide",
  data() {
    return {
      copyWord: '乐业权益'
    };
  },
  created() {

  },
  mounted() {},
  watch: {

  },
  methods: {
    goWx () {
      this.copyTxt(this.copyWord, true)
      setTimeout(() => {
        window.location.href = 'weixin://'
      }, 50)
    }
  }
};
</script>

<style lang="scss">
.page-wxguide {
  .main-pic {
    padding-top: 2.22rem;
    margin: 0 auto;
    width: 3.2rem;
    height: 3.2rem;
    box-sizing: content-box;
    display: block;
  }
  .text {
    text-align: center;
    font-size: 0.36rem;
    margin-top: 1.2rem;
    color: #222222;
    line-height: 0.5rem;
    font-weight: bold;
  }
  button {
    width: 5.42rem;
    height: 0.9rem;
    line-height: 0.9rem;
    background-color: #222222;
    border-radius: 0.1rem;
    color: #D4B07B;
    font-size: 0.32rem;
    font-weight: bold;
    margin: 0.32rem auto 0;
    display: block;
  }
  #copyObj {
    opacity: 0;
  }
}
</style>
