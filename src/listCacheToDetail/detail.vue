<template>
  <div class="detail">
    我是详情页面 {{ detail.name }}哦，哈哈
    <p>id:{{ detail.id }}</p>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusa ntium dolore ea earum et ex id ipsum laboriosam
      laborum laudantium non, o dio perferendis tempora tenetur ullam veniam! Eaque laudantium optio saepe.
    </p>
    <el-button type="primary" @click="back" class="back-btn">返回</el-button>
  </div>
</template>

<script>
export default {
  name: 'detail',
  data() {
    return {
      detail: {},
    };
  },
  created() {
    this.detail = this.$route.query;
  },
  methods: {
    back() {
      // history.back();
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
.detail {
  padding: 20px;

  .back-btn {
    position: absolute;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
