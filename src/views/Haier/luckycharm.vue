<template>
  <div
    class="luckyCharmC"
    :style="{overflow: loginModal || runOutModal || awardModal ? 'hidden' : 'auto'}"
  >
    <div class="luckyCharm">
      <img
        class="title-img"
        src="@/assets/img/lucky-title.png"
      />
      <img
        class="fish-img"
        src="@/assets/img/fish.png"
      />
      <div class="out mgt">
        <div class="in first">
          <div class="title flex flex-main-center award-view">
            <div class="line"></div>
            <div class="circle"></div>
            <h1>奖品展示</h1>
            <div class="circle"></div>
            <div class="line"></div>
          </div>
          <Swiper
            class="awardList"
            :showIndicator="false"
            duration="1000"
            interval="2500"
            v-if="swiperShow"
          >
            <Slide
              v-for="(num,index1) in 3"
              class="flex flex-main-around"
              :key="index1"
            >
              <div
                v-for="(item,index2) in testAward[index1]"
                :key="index2"
              >
                <img :src="item.url" />
                <span>{{item.name}}</span>
              </div>
            </Slide>
          </Swiper>
          <div
            class="swiper-empty"
            style="height: 2rem;border:1px solid rgba(200,200,200,0.5)"
            v-else
          ></div>
          <div
            class="winList"
            ref="winList"
            v-if="winList.length"
          >
            <p
              v-for="(item,index) in winList"
              :key="index"
              :class="{'trans':count!=0}"
              :style="{'transform':'translateY('+y+'px)'}"
            >{{item.phone}}翻到了{{item.name}}</p>
          </div>
          <div
            class="winList"
            ref="winList"
            v-else
          >
            <p>暂无记录</p>
          </div>
        </div>
      </div>
      <div class="out">
        <div class="in second">
          <ul class="flex flex-main-around">
            <li
              @click="openCard(index)"
              v-for="index in 9"
              :key="index"
            >
              <img
                src="@/assets/img/card-back.png"
                v-show="!(cardIndex == index)"
              />
              <img
                src="@/assets/img/card-face.png"
                v-show="cardIndex == index"
              />
            </li>
          </ul>
        </div>
      </div>
      <div class="title flex flex-main-center fp-desc">
        <div class="line"></div>
        <div class="circle"></div>
        <h1>翻牌说明</h1>
        <div class="circle"></div>
        <div class="line"></div>
      </div>
      <div class="out">
        <div class="in third">
          <div
            v-for="(item, index) in desc"
            :key="index"
            class="text-one"
          >
            <img
              :src="decodeURL(item)"
              alt
              v-if="regHttp(item)"
            />
            <p
              v-else
              v-html="item"
            ></p>
          </div>
          <div class="text-one">
            <P>5.本活动最终解释权归赞积分所有</P>
          </div>
        </div>
      </div>
      <p class="support">本活动由赞积分提供</p>
      <div
        class="modal flex"
        v-show="loginModal"
        @click="hideLoginModal"
      >
        <div class="out">
          <div class="in fourth">
            <h1>登录</h1>
            <yd-cell-group>
              <yd-cell-item class="phone">
                <yd-input
                  slot="left"
                  required
                  v-model.trim="phone"
                  :show-success-icon="false"
                  :show-error-icon="false"
                  :show-clear-icon="false"
                  :on-blur="scrollReset"
                  regex="mobile"
                  placeholder="请填写手机号"
                ></yd-input>
              </yd-cell-item>
              <yd-cell-item class="flex code">
                <yd-input
                  slot="right"
                  v-model.trim="code"
                  max="6"
                  :show-success-icon="false"
                  :show-error-icon="false"
                  :show-clear-icon="false"
                  placeholder="短信验证码"
                  :on-blur="scrollReset"
                ></yd-input>
                <i
                  slot="left"
                  @click="getCode"
                  v-show="showtime"
                >获取验证码</i>
                <i
                  slot="left"
                  v-show="!showtime"
                >{{time}}s</i>
              </yd-cell-item>
            </yd-cell-group>
            <span
              @click="login"
              class="login"
            >登录</span>
          </div>
          <img
            class="close"
            @click="closeLoginModal"
            src="@/assets/img/close2.png"
          />
        </div>
      </div>
      <div
        class="modal runOut flex"
        v-show="runOutModal"
      >
        <div class="out">
          <div class="in fifth">
            <h1>提示</h1>
            <p>您已参与过活动</p>
            <span @click="runOutModal = false">确定</span>
          </div>
        </div>
      </div>
      <div
        class="modal flex flex-main-center"
        v-show="awardModal"
      >
        <div
          v-if="toggleAnimation"
          class="flex"
        >
          <img
            class="card-back-left"
            src="@/assets/img/card-back-left.png"
          />
          <img
            class="card-back-right"
            src="@/assets/img/card-back-right.png"
          />
        </div>
        <div
          class="award flex flex-dir-top"
          v-else
        >
          <img
            class="award-word"
            src="../../assets/img/getAwardWord.png"
          />
          <img
            class="award-img"
            :src="getAward.imgUrl"
          />
          <!-- <span>{{getAward.name}}</span> -->
          <!-- <p class="award-desc">奖品将以短信形式发放</p> -->
          <p class="award-desc">{{getAward.name}}</p>
          <input
            id="copyObj"
            :value="getAward.value"
          />
          <div
            class="code"
            v-if="getAward.type == 30"
          >{{getAward.value}}</div>
          <div
            class="line"
            v-else
          ></div>
          <div
            class="go"
            @click="copyTxt(getAward.value)"
            v-if="getAward.type == 30"
          >复制兑换码</div>
          <div
            class="go"
            @click="go(getAward)"
            v-else
          >去使用</div>
          <img
            class="close"
            @click="close"
            src="@/assets/img/close2.png"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { setInterval } from "timers";
import { Swiper, Slide } from "vue-swiper-component";
export default {
  components: { Swiper, Slide },
  data() {
    return {
      swiperShow: false,
      loginModal: false,
      runOutModal: false,
      awardModal: false,
      showAward: [],
      testAward: [],
      winList: [],
      getAward: "",
      y: 0,
      count: 1,
      cardIndex: 0,
      tmpCardIndex: 0,
      showtime: true,
      time: 60,
      phone: "",
      timer: "",
      code: "",
      desc: "",
      toggleAnimation: true
    };
  },
  created() {
    this.getAwardHistory();
    this.loadAward();
  },
  mounted() {
    this.loadDesc();
    this.record({
      userId: this.$store.state.fpUserInfo.userId,
      paraType: "20"
    });
    if (new Date(localStorage.getItem("date")) <= new Date()) {
      this.record({
        userId: this.$store.state.fpUserInfo.userId,
        paraType: "10"
      });
    }
    let date = this.moment(new Date()).format("YYYY/MM/DD");
    console.log("====", date);
    localStorage.setItem("date", date + " 23:59:59");
  },
  methods: {
    openCard(index) {
      // 存在用户手机号 则不显示登录框
      this.record({
        userId: this.$store.state.fpUserInfo.userId,
        operationType: "10",
        sort: index
      });
      if (!localStorage.getItem("phone")) {
        this.tmpCardIndex = index;
        this.loginModal = true;
        return false;
      }
      this.loadfanPai();
    },
    close() {
      this.awardModal = false;
      this.toggleAnimation = true;
    },
    login() {
      document.body.scrollTop = 0;
      this.record({
        userId: this.$store.state.fpUserInfo.userId,
        operationType: "10",
        operationObject: "30"
      });
      this.submit();
    },
    submit() {
      if (!this.judgePhone()) {
        return false;
      } else if (this.code == "") {
        // console.log("haha");
        this.$dialog.toast({
          mes: "验证码不能为空",
          timeout: 1500
        });
      } else {
        let param = {
          phone: this.phone,
          vCode: this.code
        };
        this.$http.post("/focus.HaierLogin", param).then(res => {
          if (res.code == 120) {
            this.$dialog.toast({
              mes: "验证码不正确",
              timeout: 1500
            });
          } else {
            this.$dialog.toast({
              mes: "登录成功",
              timeout: 1500,
              callback: () => {
                // console.log(res, "login");
                this.$store.commit("updateFpUserInfo", res.data);
                localStorage.setItem("phone", this.phone);
                this.loginModal = false;
                // this.getAwardHistory();
                this.record({
                  userId: this.$store.state.fpUserInfo.userId
                });
                this.loadfanPai();
              }
            });
          }
        });
      }
    },
    loadfanPai() {
      // 翻牌接口
      this.$http
        .post("/focus.HaierFanPai", {
          // userId: "1",
          userId: this.$store.state.fpUserInfo.userId,
          companyNo: this.$store.state.fpUserInfo.companyNo
          // companyNo: "1006004"
        })
        .then(res => {
          console.log("翻牌====", res);
          if (res.code == "200") {
            this.getAward = res.data;
            this.getAward.imgUrl = this.getSkuImg(
              JSON.parse(res.data.picList),
              "40"
            )[0];
            this.awardModal = true;
            setTimeout(() => {
              this.toggleAnimation = false;
            }, 500);
          } else if (res.code == "911") {
            this.loginModal = true;
          } else if (res.code == "120") {
            this.runOutModal = true;
          }
        });
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
    },
    getCode() {
      if (this.judgePhone()) {
        this.$http
          .post("/focus.getH5PhoneVcode", { phone: this.phone })
          .then(res => {
            console.log(res.code, "过去验证码");
            if (res.code) res.code = Number(res.code);
            switch (res.code) {
              case 110:
                this.msg = "请稍后重试";
                break;
              case 120:
                this.msg = "今天短信次数已达上限，请明天再试";
                break;
              case 100:
                this.msg = "手机号不能为空";
                break;
              case 119:
                this.msg = "获取失败，请重试";
                break;
            }
            if (res.code != "200") {
              this.$dialog.toast({
                mes: this.msg,
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
    getAwardHistory() {
      // 抽奖记录
      this.$http
        .post("/focus.HaiercompanyUserAwardList", {
          companyNo: this.$store.state.fpUserInfo.companyNo
        })
        .then(res => {
          this.winList = res.data.rows;
          if (this.winList.length) {
            this.winList.forEach(_ => {
              _.phone = this.hidePhone(_.phone);
            });
            // 获奖名单滚动展示
            let height = this.$refs.winList.offsetHeight;
            let first = this.winList[0];
            let last = this.winList[this.winList.length - 1];
            if (this.winList.length == 1) {
              this.winList.push(first);
            }
            this.winList.unshift(last);
            this.winList.push(first);
            this.y = -height * this.count;
            setInterval(() => {
              this.count++;
              this.y = -height * this.count;
              console.log(height);
              // console.log(this.y, "y");
              if (this.count == this.winList.length - 2) {
                setTimeout(() => {
                  this.count = 0;
                  this.y = 0;
                }, 500);
              }
            }, 2000);
          }
        });
    },
    hideLoginModal(e) {
      console.log(e);
    },
    closeLoginModal() {
      this.loginModal = false;
      this.record({
        userId: this.$store.state.fpUserInfo.userId,
        operationType: "10",
        operationObject: "90"
      });
    },
    go(data) {
      if (data.type == 30) {
        // 兑换码
      } else {
        // 11的时候是文章
        window.location.href = data.value;
      }
    },
    scrollReset() {
      window.scroll(0, 100);
    },
    loadAward() {
      // 海尔奖品列表接口;
      this.$http.post("/focus.HaierAwardList", {}).then(res => {
        console.log("data====", res.data.rows);
        res.data.rows.forEach(_ => {
          _.url = this.getSkuImg(_.picList, "40")[0];
        });
        for (var i = 0; i < res.data.rows.length; i += 3) {
          this.testAward.push(res.data.rows.slice(i, i + 3));
        }
        this.swiperShow = true;
      });
    },
    loadDesc() {
      // 说明接口
      this.$http.post("/focus.HaierPublicParams", {}).then(res => {
        this.desc = res.data.description.split(",");
      });
    }
  }
};
</script>
<style lang="scss">
.luckyCharmC {
  height: 100%;
}
.luckyCharm {
  background: url(../../assets/img/Haier-bg.png);
  background-size: cover;
  text-align: center;
  padding: 1.6rem 0.4rem 0.82rem;
  font-family: PingFang-SC-Medium;
  .title-img {
    position: relative;
    z-index: 10;
  }
  .fish-img {
    position: relative;
    z-index: 9;
    top: -2.5rem;
    left: 0.6rem;
    width: 5.49rem;
    height: 5.24rem;
  }
  .runOut {
    p {
      font-size: 0.3rem;
      font-weight: 500;
      color: rgba(152, 129, 85, 1);
    }
  }
  .card-back-left {
    animation: awardRotateLeft 0.5s ease-in;
    transform-origin: right center;
  }
  .card-back-right {
    animation: awardRotateRight 0.5s ease-in;
    transform-origin: left center;
  }
  .award {
    animation: awardScale 0.5s ease;
    background: url(../../assets/img/award-bg.png) no-repeat;
    background-size: 100%;
    width: 5.63rem;
    height: 6.89rem;
    margin-left: -0.7rem;
    padding-top: 0.7rem;
    padding-left: 0.82rem;
    text-align: center;
    .award-word {
      height: 0.6rem;
      width: 1.85rem;
      margin: 0 auto;
    }
    .award-img {
      // border-radius: 50%;
      border: 3px solid rgba(235, 88, 27, 1);
      width: 1.33rem;
      height: 1.33rem;
      margin: 0.25rem auto 0;
    }
    span {
      color: #ffffff;
      font-size: 0.26rem;
    }
    .award-desc {
      font-size: 0.26rem;
      font-weight: bold;
      color: #fcb08e;
      margin: 0.28rem auto 0;
      line-height: 0.36rem;
      height: 0.72rem;
      min-height: 0.72rem;
      width: 2.84rem;
      overflow: hidden;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .code {
      width: 3.2rem;
      height: 0.5rem;
      min-height: 0.5rem;
      line-height: 0.5rem;
      margin: 0.2rem auto 0.15rem;
      background-color: #b33300;
      color: #ffffff;
      font-weight: bold;
      text-align: center;
      font-size: 0.26rem;
    }
    .line {
      width: 3.4rem;
      height: 0.5rem;
      min-height: 0.5rem;
      margin: 0.1rem auto 0.15rem;
    }
    .go {
      width: 2.7rem;
      height: 0.6rem;
      line-height: 0.6rem;
      border-radius: 0.3rem;
      background-color: #ffedcc;
      color: #da3718;
      margin: 0 auto;
      font-size: 0.26rem;
    }
    .close {
      width: 0.6rem;
      margin: 1.44rem auto 0;
      height: 0.6rem;
    }
    #copyObj {
      position: fixed;
      bottom: -100px;
      opacity: 0;
    }
  }
  .support {
    font-size: 0.22rem;
    font-weight: bold;
    color: rgba(212, 76, 59, 1);
    padding-top: 0.34rem;
  }
  $firstColor: #a1885a;
  $thirdColor: #ffecc7;
  .title {
    align-items: center;
    &.award-view {
      margin-bottom: 0.22rem;
      h1 {
        color: $firstColor;
        font-size: 0.34rem;
      }
      .circle,
      .line {
        border-color: $firstColor;
      }
    }
    &.fp-desc {
      margin-top: 0.48rem;
      margin-bottom: 0.46rem;
      h1 {
        color: $thirdColor;
        font-size: 0.44rem;
      }
      .circle,
      .line {
        border-color: $thirdColor;
      }
    }
    h1 {
      font-weight: bold;
      margin: 0 0.2rem;
    }
    .circle {
      width: 0.13rem;
      height: 0.13rem;
      border: 2px solid #a1885a;
      border-radius: 50%;
    }
    .line {
      width: 0.84rem;
      height: 1px;
      border-top: 1px solid #a1885a;
      margin: 0 0.1rem;
    }
  }
  .first {
    padding: 0.6rem 0.55rem 0.3rem;
    .awardList {
      img {
        margin: 0 auto;
        width: 1.36rem;
        height: 1.36rem;
        border: 3px solid #f0c97f;
        border-radius: 50%;
        margin-bottom: 0.14rem;
      }
      span {
        display: inline-block;
        font-size: 0.22rem;
        color: #b69c6c;
        width: 1.6rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .winList {
      margin-top: 0.33rem;
      font-size: 0.2rem;
      color: rgba(167, 142, 95, 0.6);
      height: 16px;
      overflow: hidden;
      p {
        line-height: 16px !important;
        height: 16px;
        &.trans {
          transition: all 0.5s;
        }
      }
    }
  }
  .second {
    padding: 0.45rem 0.45rem 0.25rem 0.45rem;
    ul {
      flex-wrap: wrap;
      img {
        width: 1.65rem;
        height: 1.98rem;
        margin-bottom: 0.2rem;
      }
    }
  }
  .third {
    text-align: left;
    padding: 0.7rem 0.36rem;
    .text-one {
      p {
        color: #cba765;
        font-size: 0.24rem;
        margin-bottom: 0.4rem;
      }
      &:last-child {
        p {
          margin-bottom: 0;
        }
      }
    }
  }
  .fourth {
    padding: 0.75rem 0.65rem;
  }
  .fifth {
    padding: 0.8rem 0;
  }
}
.mgt {
  margin-top: -3.2rem;
}
.out {
  padding: 0.2rem 0.16rem;
  background: linear-gradient(
    180deg,
    rgba(245, 221, 175, 1),
    rgba(237, 200, 129, 1)
  );
  border-radius: 0.2rem;
  margin-bottom: 0.3rem;
  .in {
    border-radius: 20px;
    background: linear-gradient(
      0deg,
      rgba(255, 220, 155, 1),
      rgba(255, 241, 215, 1)
    );
    box-shadow: 0px 12px 21px 0px rgba(216, 174, 94, 0.14);
    border-radius: 0.2rem;
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
  padding: 0 0.4rem;
  .out {
    width: 100%;
    position: relative;
    h1 {
      font-size: 0.4rem;
      font-weight: bold;
      color: rgba(85, 72, 47, 1);
      margin-bottom: 0.4rem;
    }
    .yd-cell {
      background: transparent;
      .yd-cell-item {
        width: 5.1rem;
        height: 0.8rem;
        background: rgba(255, 246, 229, 1);
        border-radius: 10px;
        margin-bottom: 0.23rem;
        &.phone {
          .yd-cell-left {
            width: 100%;
          }
        }
        &.code {
          .yd-cell-right {
            width: 100%;
            height: 100%;
            min-height: 100%;
          }
          .yd-cell-left {
            position: absolute;
            right: 0.24rem;
            top: 50%;
            transform: translateY(-50%);
            i {
              color: #da3718;
              font-size: 0.26rem;
            }
          }
        }
        .yd-input {
          input::placeholder {
            font-size: 0.26rem;
            color: rgba(217, 185, 126, 1);
          }
        }
        p {
          color: #da3718;
          line-height: 0.8rem;
        }
      }
    }
    span {
      display: block;
      width: 3.38rem;
      margin: 0 auto;
      height: 0.8rem;
      line-height: 0.8rem;
      background: rgba(218, 55, 24, 1);
      border-radius: 0.4rem;
      color: #ffffff;
      margin-top: 0.8rem;
      font-size: 0.3rem;
    }
    .close {
      display: block;
      width: 0.6rem;
      height: 0.6rem;
      position: absolute;
      bottom: -1.4rem;
      left: 50%;
      margin-left: -0.3rem;
    }
  }
}
img {
  display: block;
}
@keyframes awardScale {
  0% {
    transform: scale(1); /*开始为原始大小*/
  }
  25% {
    transform: scale(1.1); /*放大1.1倍*/
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes awardRotateLeft {
  0% {
    transform: rotateY(0deg);
  }
  25% {
    transform: rotateY(90deg);
  }
  50% {
    transform: rotateY(0deg);
  }
  75% {
    transform: rotateY(90deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}
@keyframes awardRotateRight {
  0% {
    transform: rotateY(0deg);
  }
  25% {
    transform: rotateY(-90deg);
  }
  50% {
    transform: rotateY(0deg);
  }
  75% {
    transform: rotateY(-90deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}
</style>
