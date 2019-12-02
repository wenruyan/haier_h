<template>
  <div class="JD-page">
    <!-- 先注释 -->
    <!-- <img class="bg" src="@/assets/img/JD-bg-1.png" alt /> -->
    <yd-cell-group v-if="showModal">
      <img src="@/assets/img/crown.png" />
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
      <img src="@/assets/img/crown.png" />
      <div class="content">
        <h2>恭喜获得</h2>
        <h2>京东PLUS会员30天</h2>
        <p>{{data}}</p>
        <input id="copyObj" :value="data" />
      </div>
      <a @click="copyTxt(data)">复制兑换码</a>
    </yd-cell-group>
    <div class="description">
      <h1>奖品说明</h1>
      <ul>
        <li>1.领取后将获得京东PLUS会员30天试用资格，于两个工作日内生效；</li>
        <li>2.兑换的试用效期不可与原有的试用效期、正式效期叠加，曾开通过PLUS正式会员的用户将无法兑换试用；</li>
        <li>3.兑换码不做退换、不兑现金，可转赠亲友使用；</li>
        <li>4.京东PLUS会员30天试用权益包含1张运费券、PUIS专享价商品、24小时专属客服、10倍购物返利；</li>
        <li>
          5.用户领取完兑换码后请点击以下链接兑换：
          <span
            @click="go"
          >https://plus.m.jd.com/open/trialExternalRedeem?channelType=FOCUS</span>
        </li>
        <li>6.本活动最终解释权归赞积分所有</li>
      </ul>
    </div>
    <!-- <div class="modal flex flex-main-center" v-show="showModal">
      <div class="content">
        <h2>京东PLUS会员30天</h2>
        <p>{{data}}</p>
        <input id="copyObj" :value="data" />
        <h6 @click="copyTxt(data)">复制兑换码</h6>
        <img @click="closeModal" src="@/assets/img/close2.png" />
      </div>
    </div>-->
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
      copyTimer: "",
      delay: false,
      startTime: "",
      endTime: ""
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
          // switch (res.code) {
          //   case 110:
          //     this.msg = "请稍后重试";
          //     break;
          //   case 120:
          //     this.msg = "今天短信次数已达上限，请明天再试";
          //     break;
          //   case 100:
          //     this.msg = "手机号不能为空";
          //     break;
          //   case 119:
          //     this.msg = "获取失败，请重试";
          //     break;
          // }
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
    go() {
      location.href =
        "https://plus.m.jd.com/open/trialExternalRedeem?channelType=FOCUS";
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
        .post("/focus.getCode", {
          phone: this.phone,
          vCode: this.vCode,
          type: "JD"
        })
        .then(res => {
          console.log(res, "领取成功");
          if (res.code == 200) {
            this.data = res.data;
            this.showModal = false;
            this.$store.commit("updateHjdCode", res.data);
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
    if (localStorage.getItem("hJdCode")) {
      this.data = localStorage.getItem("hJdCode");
      this.showModal = false;
    }
  }
};
</script>

<style lang="scss">
.JD-page {
  background-color: #fc6860;
  overflow: hidden;
  font-family: PingFang-SC-Medium;
  background-image: url("../../assets/img/JD-bg-1.png");
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
        input {
          background-color: transparent !important;
        }
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
      width: 2.21rem;
      height: 1.43rem;
      top: -1.8rem;
      left: 1.2rem;
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
        span {
          text-decoration: underline;
        }
      }
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
      }
      p {
        font-size: 0.36rem;
        height: 0.8rem;
        line-height: 0.8rem;
        border: 1px solid rgba(255, 105, 106, 1);
        border-radius: 0.1rem;
        margin: 0.38rem 0 0.44rem 0;
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
