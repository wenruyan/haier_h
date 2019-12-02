<template>
  <div class="page mine-page">
    <div class="title flex flex-dir-left flex-cross-center">
      <img src="../../assets/img/user.png" alt />
      <h3>{{hidePhone($store.state.haierPhone)}}</h3>
    </div>
    <div class="main-content" v-if="showPage">
      <div
        class="data-one-one"
        v-for="(item,ind) in myReceive"
        :key="ind"
        :class="{'un-paid':item.status == '20', 'expiration':item.status == '30', 'fast-expiration':item.status == '10'}"
        @click="go(item)"
      >
        <div class="top flex flex-cross-center">
          <img :src="item.url" class="sku-img" />
          <div class="top-content flex flex-dir-top flex-main-justify flex-1">
            <div class="flex flex-main-justify flex-cross-center">
              <div>
                <h5>{{item.name}}</h5>
                <p>{{item.itemtitle}}</p>
              </div>
              <span class="go-use">去使用</span>
            </div>
            <div class="pr flex flex-main-justify flex-cross-center" v-if="item.type == '40'">
              <span>到期时间：{{moment(item.endtime).format('YYYY-MM-DD HH:mm:ss')}}</span>
              <span class="type" v-if="item.status == '10'">{{typeObj[item.status]}}</span>
            </div>
          </div>
          <img src="../../assets/img/expiration.png" class="e-tip" v-if="item.status == '30'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgData: [],
      data: [],
      total: "",
      loading: false,
      fullscreenLoading: true,
      showPage: false,
      name: "",
      myReceive: [],
      typeObj: {
        "10": "快过期",
        "30": "已过期"
      },
      companyGive: []
    };
  },
  created() {
    // setTimeout(() => {
    //   this.fullscreenLoading = false;
    //   this.showPage = true;
    // }, 500);
    // this.$http.post("/focus.findStaffById", {}).then(res => {
    //   this.$store.commit("updateUserInfo", res.data.rows[0]);
    // });
    this.getData();
  },
  mounted() {},
  methods: {
    getData() {
      console.log();
      this.$http
        .post("/focus.HaierCardPackageList", {
          page: "",
          rows: "",
          type: "0",
          // userId: "2550219468931584",
          userId: this.$store.state.haierUserInfo.userId,
          companyNo: this.$store.state.haierUserInfo.companyNo
        })
        .then(res => {
          console.log(res, "HaierCardPackageList");
          res.data.rows.forEach(item => {
            item.url = this.getSkuImg(item.picList, "30")[0];
          });
          this.fullscreenLoading = false;
          this.showPage = true;
          this.myReceive = res.data.rows;
        });
    },
    // 跳转到客服
    goLink() {
      // if()
      if (
        navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
        "micromessenger"
      ) {
        // 在微信中打开
        window.location.href =
          "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU5MzYyNzMxMQ%3d%3d&scene=110#wechat_redirect";
      } else {
        this.$dialog.toast({
          mes: "请在微信中关注公众号“孚库网络科技有限公司”联系我们",
          timeout: 1500
        });
      }
    },
    go(item) {
      // 权益跳转
      // 权益类型 productlist
      // 1-文章 isselect 10: 直接外链 20: 中转页
      // 其他-兑换码详情
      console.log(item, "item");
      // 日志记录
      // this.record("", item.id, () => {
      if (item.type == "11") {
        if (item.isselect == "10") {
          location.href = item.externallinks;
          return false;
        } else {
          this.PUSH({
            path: "/haier-equityMiddle",
            query: {
              id: item.skuid,
              qytype: item.type
            }
          });
        }
      } else {
        this.PUSH({
          path: "/haier-activationCodeCheck",
          query: {
            cardid: item.cardid,
            carddetailid: item.carddetailid
          }
        });
      }
      // });
    }
  }
};
</script>

<style lang="scss">
.mine-page {
  height: 100%;
  width: 100%;
  padding: 0 0.42rem 0.42rem 0.42rem;
  background-color: #f8f8f8;
  overflow-y: auto;
  .title {
    height: 1.6rem;
    line-height: 1.6rem;
    margin-bottom: 0.3rem;
    img {
      width: 0.92rem;
      height: 0.92rem;
    }
    h3 {
      font-size: 0.36rem;
      margin-left: 0.4rem;
    }
  }
  .main-content {
    .data-one-one {
      border-radius: 0.1rem;
      padding: 0 0.32rem;
      margin-bottom: 0.26rem;
      box-sizing: border-box;
      position: relative;
      background-color: #fff !important;
      box-shadow: 0px 0.02rem 0.26rem rgba(27, 45, 149, 0.05);
      .fast-expiration-tip {
        position: absolute;
        right: 0;
        top: 0;
        width: 1.04rem;
        height: 0.82rem;
      }
      .top {
        height: 2.04rem;
        &.my-buy {
          border-bottom: 1px solid #e0e0e0;
        }
        .top-content {
          height: 1.48rem;
          flex-grow: 1;
          h5,
          p {
            width: 2.4rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          h5 {
            font-size: 0.34rem;
            color: #333;
          }
          p {
            color: #333;
            font-size: 0.26rem;
            margin-top: 0.08rem;
          }
          .go-use {
            width: 1.4rem;
            height: 0.52rem;
            line-height: 0.52rem;
            text-align: center;
            background-color: #cfa76c;
            color: #fff;
            border-radius: 0.26rem;
            font-size: 0.24rem;
          }
          .pr {
            span {
              color: #999;
              font-size: 0.22rem;
            }
          }
        }
      }
      img.sku-img {
        width: 1.48rem;
        height: 1.48rem;
        margin-right: 0.22rem;
      }
      img.e-tip {
        width: 1.06rem;
        height: 1.06rem;
        position: relative;
        z-index: 3;
      }
      .type {
        height: 0.42rem;
        line-height: 0.42rem;
        padding: 0 0.22rem;
        opacity: 1;
        border-radius: 0.08rem;
      }
    }
    .data-one {
      margin-top: 0.62rem;
      &.data-my-receive {
        .pr {
          position: relative;
          .type {
            position: absolute;
            right: 0;
          }
        }
      }
      .d-o-title {
        margin-bottom: 0.36rem;
        h4 {
          color: #333;
          font-size: 0.44rem;
          font-weight: bold;
        }
        .more {
          color: #999;
          font-size: 0.28rem;
        }
      }
      .empty {
        height: 1.6rem;
        text-align: center;
        background-color: #fff;
        color: #999;
        margin-bottom: 0.62rem;
        i {
          font-size: 0.6rem;
          margin-right: 0.16rem;
        }
        span {
          font-size: 0.28rem;
        }
      }
      .data-one-one {
        border-radius: 0.1rem;
        padding: 0 0.32rem;
        margin-bottom: 0.26rem;
        box-sizing: border-box;
        position: relative;
        &.un-paid {
          box-shadow: 0px 0.02rem 0.26rem rgba(27, 45, 149, 0.05);
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.5) 0%,
            rgba(221, 212, 255, 0.1) 100%
          );
          .type {
            color: #5251ff;
            background: rgba(219, 219, 255, 1);
          }
        }
        &.fast-expiration {
          box-shadow: 0px 0.06rem 0.12rem rgba(255, 170, 167, 0.3);
          border: 0.02rem solid rgba(255, 216, 214, 1);
          .type {
            color: #fe463f;
            background: #ffd8d6;
          }
        }
        &.expiration {
          position: relative;
          box-shadow: 0px 0.02rem 0.26rem rgba(27, 45, 149, 0.05);
          &:after {
            content: "";
            width: 100%;
            height: 100%;
            border-radius: 0.1rem;
            position: absolute;
            left: 0;
            top: 0;
            background-color: rgba(255, 255, 255, 0.6);
            z-index: 2;
          }
        }
        .fast-expiration-tip {
          position: absolute;
          right: 0;
          top: 0;
          width: 1.04rem;
          height: 0.82rem;
        }
        .top {
          height: 1.5rem;
          &.my-buy {
            border-bottom: 1px solid #e0e0e0;
          }
          .top-content {
            height: 0.8rem;
            flex-grow: 1;
            h5 {
              font-size: 0.34rem;
              color: #333;
            }
            p {
              color: #999;
              font-size: 0.22rem;
            }
          }
        }
        img.sku-img {
          width: 0.8rem;
          height: 0.8rem;
          margin-right: 0.22rem;
        }
        img.e-tip {
          width: 1.06rem;
          height: 1.06rem;
          position: relative;
          z-index: 3;
        }
        .bottom {
          height: 0.88rem;
          line-height: 0.88rem;
          .money {
            color: #333;
            font-size: 0.22rem;
            font-weight: bold;
          }
        }
        .type {
          height: 0.42rem;
          line-height: 0.42rem;
          padding: 0 0.22rem;
          opacity: 1;
          border-radius: 0.08rem;
        }
      }
    }
    .mine-name {
      padding: 0 0 0.18rem 0;
      display: flex;
      align-items: center;
      margin-bottom: 0.4rem;
      img {
        width: 1rem;
        height: 1rem;
        margin-right: 0.24rem;
        border-radius: 100%;
      }
      p {
        font-size: 0.4rem;
        font-weight: bold;
      }
    }
  }
}
</style>
