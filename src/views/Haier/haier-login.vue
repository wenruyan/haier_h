<template>
  <div class="page haier-login-page">
    <header>
      <h4>欢迎登录</h4>
      <p>登录查看您的卡包</p>
    </header>
    <div class="login-content">
      <div class="content">
        <yd-cell-group>
          <yd-cell-item class="phone">
            <span slot="left">+86</span>
            <yd-input
              :on-focus="focus"
              :on-blur="blur"
              slot="right"
              v-model.trim="phone"
              required
              :show-success-icon="false"
              :show-error-icon="false"
              placeholder="请输入手机号"
              regex="mobile"
            ></yd-input>
          </yd-cell-item>
          <yd-cell-item class="code">
            <span slot="left" class="get-code" @click="getCode" v-show="showtime">获取验证码</span>
            <span slot="left" class="get-code" v-show="!showtime">{{time}}s</span>
            <yd-input
              :on-focus="focus"
              :on-blur="blur"
              slot="right"
              v-model.trim="code"
              required
              :show-success-icon="false"
              :show-error-icon="false"
              :show-clear-icon="false"
              placeholder="请输入验证码"
            ></yd-input>
          </yd-cell-item>
        </yd-cell-group>
        <yd-button size="large" bgcolor="#000" color="#D4B07B" @click.native="login">立即登录</yd-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "login-account",
  data() {
    return {
      phone: "",
      code: "",
      timeStart: "",
      timeEnd: "",
      max: 11,
      showtime: true,
      time: 60,
      timer: ""
    };
  },
  created() {},
  mounted() {
    console.log(12312321);
    console.log(this.$route.query);
  },
  methods: {
    getCode() {
      if (this.judgePhone()) {
        this.$http
          .post("/focus.getHaierPhoneVcode", { phone: this.phone })
          .then(res => {
            console.log(res.code, "过去验证码");
            // switch (res.code) {
            //   case '110':
            //     this.msg = "请稍后重试";
            //     break;
            //   case '120':
            //     this.msg = "今天短信次数已达上限，请明天再试";
            //     break;
            //   case '100':
            //     this.msg = "手机号不能为空";
            //     break;
            //   case '119':
            //     this.msg = "获取失败，请重试";
            //     break;
            // }
            if (res.code != "200") {
              this.$dialog.toast({
                mes: res.msg,
                timeout: 1500
              });
            } else {
              this.showtime = false;
              this.timer = setInterval(() => {
                this.time--;
                if (this.time == 0) {
                  this.showtime = true;
                  window.clearInterval(this.timer);
                  this.time = 60;
                }
              }, 1000);
            }
          });
      }
    },
    focus() {
      this.timeStart = new Date().getTime();
    },
    blur() {
      this.timeEnd = new Date().getTime();
      // 记录
      // setTimeout(() => {
      //   this.record({
      //     pageNo: "10", // 用户操作页面-10:登录页,20:注册页,30:产品页
      //     operationType: "20", // 用户操作行为-10:按钮,20:输入
      //     operationObject: "20", // 用户操作对象10-点击金刚区(限时特惠,每日免单,员工内买),20-登录信息,30-确认登录,40-注册信息,50-确认注册,60-点击快报,70-点击权益,80-点击个人中心
      //     expendTime: this.timeEnd - this.timeStart // 操作耗时(S)/毫秒 聚焦-失焦
      //   });
      // }, 0);
    },
    login() {
      document.body.scrollTop = 0;
      // this.record(
      //   {
      //     pageNo: "10", // 用户操作页面-10:登录页,20:注册页,30:产品页
      //     operationType: "10", // 用户操作行为-10:按钮,20:输入
      //     operationObject: "30", // 用户操作对象10-点击金刚区(限时特惠,每日免单,员工内买),20-登录信息,30-确认登录,40-注册信息,50-确认注册,60-点击快报,70-点击权益,80-点击个人中心
      //     remark: JSON.stringify({
      //       phone: this.phone,
      //       barcode: this.code,
      //       companyNo: this.$store.state.companyNo
      //     }) // 传入请求的参数内容
      //   },
      //   "",
      //   () => {
      this.submit();
      //   }
      // );
    },
    submit() {
      if (!this.judgePhone()) {
        return false;
      } else if (this.code == "") {
        console.log("haha");
        this.$dialog.toast({
          mes: "验证码不能为空",
          timeout: 1500
        });
      } else {
        let param = {
          phone: this.phone,
          vCode: this.code,
          login2: 'yes'
        };
        this.$http.post("/focus.HaierLogin", param).then(res => {
          if (res.code == '120') {
            this.$dialog.toast({
              mes: "验证码不正确",
              timeout: 1500
            });
          } else if (res.code == '119') {
            this.$dialog.toast({
              mes: "此员工不存在",
              timeout: 1500
            });
          } else {
            this.$dialog.toast({
              mes: "登录成功",
              timeout: 1500,
              callback: () => {
                this.$store.commit("updateHaierUserInfo", res.data);
                this.$store.commit("updateHaierPhone", this.phone);
                this.REPLACE({
                  path: "/haier-mine"
                });
                // alert("跳转失败")
              }
            });
          }
        });
        // this.PUSH({ path: "/index" });
      }
    },
    judgePhone() {
      if (this.phone == "") {
        this.$dialog.toast({
          mes: "手机号不能为空",
          timeout: 1500
        });
        return false;
      } else if (!this.regMobile(this.phone)) {
        this.$dialog.toast({
          mes: "请输入正确的手机号",
          timeout: 1500
        });
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>

<style lang="scss">
.hidden {
  overflow: hidden;
}
.tac {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.tvac {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.clearfix::before,
.clearfix::after {
  display: block;
  content: "";
  clear: both;
}
.clearfix {
  *zoom: 1;
}
.haier-login-page {
  height: 100vh;
  background: #fff;
  header {
    color: #333;
    padding-left: 0.56rem;
    h4 {
      font-size: 0.6rem;
      margin: 0.94rem 0 0.24rem 0;
    }
    p {
      margin-bottom: 1.5rem;
    }
  }
  .content {
    padding: 0.3rem 1rem 0 1rem;
    background-color: #fff;
    transform: translateY(-1px);
    .yd-cell-item {
      padding-left: 0;
      border-bottom: 1px solid #e7e7e7;
      .yd-input {
        border-bottom: none;
      }
    }
    .yd-cell-right {
      padding-right: 0;
      .yd-input {
        padding-left: 0.36rem;
        input {
          font-size: 0.3rem;
          color: #999;
        }
      }
    }
    .code {
      .yd-cell-left {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      .get-code {
        color: #4d8dfc;
        font-size: 0.3rem;
      }
    }
    .phone {
      span {
        padding: 0 0.4rem;
        height: 0.5rem;
        line-height: 0.5rem;
        font-size: 0.36rem;
        font-weight: bold;
        color: #666;
        border-right: 2px solid #e7e7e7;
      }
    }
    .yd-btn-block {
      height: 0.9rem;
      margin-top: 1.52rem;
    }
  }
}
</style>
