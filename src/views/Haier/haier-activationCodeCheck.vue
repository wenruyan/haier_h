<template>
  <div class="box" v-show="show">
    <div class="activationCode">
      <div class="codeBox">
        <div class="flex flex-main-justify">
          <p class="productName">
            <img src="@/assets/img/tag.png" />
            {{codeName}}
          </p>
          <img src="@/assets/img/phone-icon-pray.png" alt="" class="phone" @click="goContact">
        </div>
        <div :class="codeStatus == '90' ? codeContent:codeDisable">
          <h2>激活码</h2>
          <p>{{activationCode}}</p>
          <input id="copyObj" :value="activationCode" />
          <button @click="copyTxt(activationCode)" v-if="codeStatus == '90'">复制</button>
          <button v-else>已过期</button>
        </div>
        <img src="@/assets/img/pocket.png" class="pocket" />
      </div>
    </div>

    <div class="codeInfo">
      <h2>到期时间</h2>
      <p>到期时间：{{moment(endTime).format('YYYY-MM-DD')}}</p>
      <h2>说明</h2>
      <description :data="descList"></description>
    </div>
  </div>
</template>

<script>
import description from "../../components/description";
export default {
  name: "activationCodeCheck",
  data() {
    return {
      codeContent: "codeContent",
      codeDisable: "codeDisable",
      codeName: "",
      activationCode: "",
      codeStatus: "",
      endTime: "",
      descList: "",
      show: false
    };
  },
  components: { description },
  computed: {
    // fncodestatus() {
    //   let status = this.codeStatus;
    //   switch (this.codeStatus) {
    //     case "90":
    //       status = "复制去使用";
    //       break;
    //     case "110":
    //       status = "已过期";
    //       break;
    //   }
    //   console.log(status);
    //   return status;
    // }
  },
  created() {},
  mounted() {
    this.$http
      .post("./focus.cardPackageDetail", {
        cardid: this.$route.query.cardid,
        carddetailid: this.$route.query.carddetailid
      })
      .then(res => {
        console.log("res", res.data.rows[0]);
        this.endTime = res.data.rows[0].endtime;
        this.descList = res.data.rows[0].description.split(",");
        this.activationCode = res.data.rows[0].codestring;
        this.codeName = res.data.rows[0].name;
        this.codeStatus = res.data.rows[0].status;
        this.show = true;
      });
  }
};
</script>

<style lang="scss">
.box {
  font-family: PingFang SC;
  .activationCode {
    background: url(../../assets/img/card-bg.png);
    background-size: cover;
    height: 4.5rem;
    overflow: hidden;
    .codeBox {
      padding: 0.4rem;
      position: relative;
      .productName {
        font-size: 0.3rem;
        color: rgba(255, 255, 255, 1);
        margin-bottom: 0.34rem;
        img {
          width: 0.26rem;
          margin-right: 0.2rem;
        }
      }
      .phone {
        width: 0.34rem;
        height: 0.34rem;
      }
      input {
        position: fixed;
        z-index: -1;
        opacity: 0;
      }
      .codeContent {
        text-align: center;
        width: 6.7rem;
        height: 3.64rem;
        background: rgba(53, 53, 54, 1);
        border-radius: 10px;
        color: #cfa76c;
        padding-top: 0.64rem;
        h2 {
          font-size: 0.4rem;
          font-weight: bold;
          margin-bottom: 0.26rem;
        }
        p {
          font-size: 0.3rem;
          margin-bottom: 0.42rem;
        }
        button {
          width: 1.8rem;
          height: 0.52rem;
          background: rgba(207, 167, 108, 1);
          box-shadow: 0px 3px 6px rgba(44, 44, 49, 0.2);
          border-radius: 20px;
          border: none;
          color: #fff;
        }
        .btn-dev {
          width: 1.8rem;
          height: 0.52rem;
          background: rgba(146, 146, 146, 1);
          box-shadow: 0px 3px 6px rgba(44, 44, 49, 0.2);
          border-radius: 20px;
          border: none;
          color: #fff;
        }
      }
      .codeDisable {
        text-align: center;
        width: 6.7rem;
        height: 3.64rem;
        background: rgba(53, 53, 54, 1);
        border-radius: 10px;
        color: rgba(146, 146, 146, 1);
        padding-top: 0.64rem;
        h2 {
          font-size: 0.4rem;
          font-weight: bold;
          margin-bottom: 0.26rem;
        }
        p {
          font-size: 0.3rem;
          margin-bottom: 0.42rem;
        }
        button {
          width: 1.8rem;
          height: 0.52rem;
          background: rgba(146, 146, 146, 1);
          box-shadow: 0px 3px 6px rgba(44, 44, 49, 0.2);
          border-radius: 20px;
          border: none;
          color: #fff;
        }
      }
      .pocket {
        position: absolute;
        top: 74%;
        left: 0;
      }
    }
  }
  .codeInfo {
    padding: 0.4rem;
    h2 {
      font-size: 0.44rem;
      font-weight: bold;
      line-height: 30px;
      color: rgba(51, 51, 51, 1);
      margin-bottom: 0.26rem;
    }
    p {
      font-size: 0.26rem;
      color: rgba(102, 102, 102, 1);
      margin-bottom: 0.4rem;
    }
    li {
      line-height: 0.54rem;
      font-size: 0.26rem;
      color: #666666;
    }
  }
}
</style>
