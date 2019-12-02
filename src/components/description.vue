<template>
  <div class="description">
    <div v-for="(item, index) in data" :key="index" class="text-one">
      <img :src="decodeURL(item)" alt v-if="regHttp(item)" />
      <p v-else v-html="item"></p>
    </div>
    <contact-service v-if="contactShow != '1'"></contact-service>
  </div>
</template>

<script>
import contactService from "../components/contact-service";
export default {
  data() {
    return {};
  },
  props: ["data", "contactShow"],
  components: { contactService }
};
</script>

<style lang="scss">
.text-one {
  p,
  img {
    margin-bottom: 0.16rem !important;
  }
  p {
    font-size: 0.26rem !important;
    color: #666 !important;
  }
}
</style>
