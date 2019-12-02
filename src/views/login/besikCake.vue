<template>
  <div class="besik-page">
    <!-- 现注释 -->
    <!-- <img class="bg" src="@/assets/img/besik-bg-1.png" alt /> -->
    <yd-cell-group v-if="showModal">
      <img src="@/assets/img/cake.png" />
      <yd-cell-item class="flex">
        <p slot="right" @click="getCode" v-show="showtime">获取验证码</p>
        <p slot="right" v-show="!showtime">{{time}}s</p>
        <yd-input
          slot="left"
          required
          v-model.trim="phone"
          :show-success-icon="false"
          :show-error-icon="false"
          :show-clear-icon="false"
          regex="mobile"
          placeholder="请填写手机号"
        ></yd-input>
      </yd-cell-item>
      <yd-cell-item class="flex">
        <yd-input
          slot="left"
          required
          v-model="vCode"
          autocomplete="off"
          max="6"
          :show-success-icon="false"
          :show-error-icon="false"
          :show-clear-icon="false"
          placeholder="短信验证码"
        ></yd-input>
      </yd-cell-item>
      <a @click="clickGet">点击领取</a>
    </yd-cell-group>
    <yd-cell-group v-if="!showModal">
      <img src="@/assets/img/cake.png" />
      <div class="content">
        <h2>恭喜获得</h2>
        <h2>109元贝思客蛋糕</h2>
        <p>{{data}}</p>
        <input id="copyObj" :value="data" />
      </div>
      <a @click="copyTxt(data)">复制兑换码</a>
    </yd-cell-group>
    <div class="description">
      <h1>奖品说明</h1>
      <ul>
        <li>1.此优惠劵价值109元，仅限贝思客旗下正价经典系列使用；</li>
        <li>
          2.订购方式：
          <div>(1）贝思客官网 www.bestcake.com</div>
          <div>(2）贝思客APP</div>
          <div>(3）贝思客公众号:beisike01</div>
        </li>
        <li>3.领取优惠劵后，官网下单经典系列1.2磅蛋糕以上(包含1.2磅)加入购物车，在结算页面中使用优惠劵输入优惠劵码即可使用；</li>
        <li>4.兑换后的产品由贝思客负责随单配送，可配送地区：上海、苏州、杭州、宁波、无锡、南京、绍兴、北京、天津、成都、重庆（详细配送区域已贝思客官网为准）；</li>
        <li>5.使用期限为2019年12月31日；</li>
        <li>6.此劵码不可与其他优惠方式同时使用，不可兑换现金；</li>
        <li>7.法律允许范围内，贝思客享有本活动所有解释权；</li>
        <li>8.本活动最终解释权归赞积分所有</li>
      </ul>
    </div>
    <!-- <div class="modal flex flex-main-center" v-show="showModal">
      <div class="content">
        <h2>109元贝思客蛋糕</h2>
        <p>{{data}}</p>
        <input id="copyObj" :value="data" />
        <h6 @click="copyTxt(data)">复制兑换码</h6>
        <img @click="closeModal" src="@/assets/img/close2.png" />
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      phone: "",
      vCode: "",
      data: "",
      showModal: true,
      msg: "",
      showtime: true,
      time: 60,
      timer: "",
      copyTimer: ""
    };
  },
  methods: {
    getCode() {
      if (!this.regMobile(this.phone)) {
        this.$dialog.toast({
          mes: "请输入正确的手机号",
          timeout: 1500
        });
        return false;
      }
      this.$http
        .post("/focus.getH5PhoneVcode", { phone: this.phone })
        .then(res => {
          console.log(res.code, "过去验证码");
          if (res.code == 200) {
            this.showtime = false;
            this.timer = setInterval(() => {
              this.time--;
              if (this.time == 0) {
                this.showtime = true;
                // console.log(this.timer, 'timer');
                window.clearInterval(this.timer);
                this.time = 60;
              }
            }, 1000);
          } else {
            this.$dialog.toast({
              mes: res.msg,
              timeout: 1500
            });
          }
        });
    },
    clickGet() {
      if (!this.regMobile(this.phone)) {
        this.$dialog.toast({
          mes: "请输入正确的手机号",
          timeout: 1500
        });
        return false;
      } else if (!this.vCode) {
        this.$dialog.toast({
          mes: "请输入验证码",
          timeout: 1500
        });
        return false;
      }
      this.$http
        .post("/focus.getCode", { phone: this.phone, vCode: this.vCode, type: 'BSK' })
        .then(res => {
          console.log(res, "领取成功");
          if (res.code == 200) {
            this.data = res.data;
            this.showModal = false;
            this.$store.commit("updateHbesCode", res.data);
          } else if (res.code == 119) {
            this.$dialog.toast({
              mes: '获取失败，请重试',
              timeout: 1500
            });
          } else {
            this.$dialog.toast({
              mes: res.msg,
              timeout: 1500
            });
          }
        });
    },
    closeModal() {
      this.showModal = false;
    }
  },
  mounted() {
    console.log(localStorage.getItem("hBesCode"));
    if (localStorage.getItem("hBesCode")) {
      this.data = localStorage.getItem("hBesCode");
      this.showModal = false;
    }
  }
};
</script>

<style lang="scss">
.besik-page {
  background-color: #fc6860;
  overflow: hidden;
  font-family: PingFang-SC-Medium;
  background-image: url('../../assets/img/besik-bg-1.png');
  background-size: cover;
  .bg {
    position: absolute;
    z-index: 0;
  }
  .yd-cell-box {
    width: 5.5rem;
    margin: 0 auto;
    margin-top: 5.5rem;
    height: 4rem;
    background: rgba(255, 255, 255, 1);
    border-radius: 15px;
    padding: 0.54rem 0.4rem 0;
    position: relative;
    margin-bottom: 0.7rem;
    .yd-cell-item {
      height: 0.8rem;
      border: 1px solid rgba(255, 105, 106, 1);
      border-radius: 10px;
      padding: 0.23rem 0.2rem;
      margin-bottom: 0.3rem;
      .yd-input {
        padding: 0;
        border: none;
      }
      .yd-cell-right {
        padding: 0;
        p {
          width: 1.4rem;
        }
      }
    }
    a {
      display: block;
      width: 3rem;
      height: 0.8rem;
      line-height: 0.8rem;
      text-align: center;
      background: rgba(255, 105, 106, 1);
      border-radius: 40px;
      color: #ffffff;
      margin: 0 auto;
      margin-top: 0.46rem;
      font-size: 0.32rem;
    }
    img {
      position: absolute;
      z-index: 10;
      width: 2.6rem;
      height: 1.93rem;
      top: -2rem;
      left: 0.9rem;
    }
  }
  .content {
    // background: url("../../assets/img/besikCode-bg.png");
    // background-size: cover;
    // width: 5.5rem;
    // height: 4.9rem;
    text-align: center;
    // padding: 1.6rem 0.39rem 0 0.39rem;
    h2 {
      font-size: 0.32rem;
      font-weight: bold;
      color: rgba(255, 105, 106, 1);
      // margin-bottom: 0.5rem;
    }
    p {
      font-size: 0.36rem;
      height: 0.8rem;
      line-height: 0.8rem;
      border: 1px solid rgba(255, 105, 106, 1);
      border-radius: 0.1rem;
      margin: 0.38rem 0 0.44rem 0;
      cursor: pointer;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      -khtml-user-select: none;
      user-select: none;
    }
    input {
      opacity: 0;
      position: fixed;
      z-index: -1;
    }
    h6 {
      font-size: 0.24rem;
      color: rgba(147, 147, 147, 1);
      margin-bottom: 0.96rem;
      font-size: 0.24rem;
      color: rgba(147, 147, 147, 1);
      margin: 0 auto;
      margin-bottom: 0.96rem;
      width: 2.08rem;
      height: 0.6rem;
      line-height: 0.6rem;
      border-radius: 0.3rem;
      background-color: #ff696a;
      text-align: center;
      color: #fff;
    }
    img {
      width: 0.56rem;
      height: 0.56rem;
    }
  }
  .description {
    color: #ffffff;
    width: 5.5rem;
    margin: 0 auto;
    position: relative;
    h1 {
      font-size: 0.32rem;
      margin-bottom: 0.2rem;
    }
    ul {
      font-size: 0.24rem;
      li {
        margin-bottom: 0.3rem;
        text-indent: 0.42rem;
        line-height: 0.35rem;
      }
    }
  }
  .modal {
    position: fixed;
    z-index: 20;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    align-items: center;
    top: 0;
    left: 0;
    .content {
      background: url("../../assets/img/besikCode-bg.png");
      background-size: cover;
      width: 5.5rem;
      height: 4.9rem;
      text-align: center;
      padding: 1.6rem 0.39rem 0 0.39rem;
      h2 {
        font-size: 0.32rem;
        font-weight: bold;
        color: rgba(255, 105, 106, 1);
        // margin-bottom: 0.5rem;
      }
      p {
        font-size: 0.36rem;
        height: 0.8rem;
        line-height: 0.8rem;
        border: 1px solid rgba(255, 105, 106, 1);
        border-radius: 0.1rem;
        margin: 0.38rem 0 0.44rem 0;
        cursor: pointer;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        -khtml-user-select: none;
        user-select: none;
      }
      input {
        opacity: 0;
        position: fixed;
        z-index: -1;
      }
      h6 {
        font-size: 0.24rem;
        color: rgba(147, 147, 147, 1);
        margin-bottom: 0.96rem;
        font-size: 0.24rem;
        color: rgba(147, 147, 147, 1);
        margin: 0 auto;
        margin-bottom: 0.96rem;
        width: 2.08rem;
        height: 0.6rem;
        line-height: 0.6rem;
        border-radius: 0.3rem;
        background-color: #ff696a;
        text-align: center;
        color: #fff;
      }
      img {
        width: 0.56rem;
        height: 0.56rem;
      }
    }
  }
}
</style>
