<template>
  <div class="middlePage">
    <div class="title flex flex-dir-left flex-cross-center">
      <img :src="skuimage" />
      <h3>{{data.title}}</h3>
    </div>
    <div class="reciveRedEnvelope flex flex-main-justify" @click="go">
      <img src="@/assets/img/middle-tag.png" />
      <p>{{data.itemtitle}}</p>
      <span>立即领取</span>
    </div>
    <h2>权益说明</h2>
    <description :data="description"></description>
  </div>
</template>

<script>
import description from "../../components/description";
export default {
  data() {
    return {
      data: "",
      content: "",
      description: "",
      skuimage: ""
    };
  },
  components: { description },
  methods: {
    // 外链跳转
    go() {
      location.href = this.data.externallinks;
    }
  },
  mounted() {
    this.$http
      .post("./focus.qyDetail", {
        // id: "2552730779173378",
        // qytype: "11"
        id: this.$route.query.id,
        qytype: this.$route.query.qytype
      })
      .then(res => {
        this.data = res.data.rows[0];
        this.skuimage = this.getSkuImg(res.data.rows[0].qyimage, "30")[0];
        this.description = res.data.rows[0].description.split(",");
        console.log(this.data, "1111111111");
      });
  }
};
</script>

<style lang='scss'>
.middlePage {
  font-family: PingFang SC;
  padding: 0 0.4rem;
  .title {
    height: 1.6rem;
    line-height: 1.6rem;
    img {
      width: 1rem;
      height: 1rem;
      margin-right: 0.28rem;
    }
    h3 {
      font-size: 0.38rem;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
    }
  }
  .reciveRedEnvelope {
    width: 6.7rem;
    height: 1.6rem;
    border-radius: 5px;
    margin: 0 auto;
    background: linear-gradient(
      133deg,
      rgba(212, 176, 123, 1) 0%,
      rgba(207, 166, 106, 1) 100%
    );
    box-shadow: 0px 1px 13px rgba(27, 45, 149, 0.05);
    padding: 0 0.22rem 0 0.4rem;
    align-items: center;
    margin-top: 0.4rem;
    margin-bottom: 0.44rem;

    p {
      color: #ffffff;
      flex-grow: 1;
      font-size: 0.3rem;
    }
    img {
      height: 0.84rem;
      width: 0.84rem;
      margin-right: 0.2rem;
    }
    span {
      font-size: 0.26rem;
      width: 1.8rem;
      height: 0.52rem;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 3px 6px rgba(206, 166, 106, 1);
      border-radius: 20px;
      line-height: 0.52rem;
      text-align: center;
      color: #b2823c;
    }
  }
  h2 {
    font-size: 0.44rem;
    font-weight: bold;
    width: 6.7rem;
    margin: 0 auto;
    line-height: 30px;
    color: rgba(51, 51, 51, 1);
    margin-bottom: 0.4rem;
  }
  .text-one {
    width: 6.7rem;
    margin: 0 auto;
    font-size: 0.26rem;
    line-height: 0.54rem;
    color: #666666;
  }
}
</style>
