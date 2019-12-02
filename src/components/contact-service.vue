<template>
  <div class="contact-service" @click="goContact">
    <span class="c-s-text">如有更多疑问，请</span>
    <span class="c-s-contact">联系客服</span>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss">
.contact-service {
  padding-bottom: .32rem;
  span {
    font-size: 0.26rem;
    &.c-s-text {
      color: #666;
    }
    &.c-s-contact {
      color: #4d8dfc;
      font-weight: bold;
    }
  }
}
</style>
