<template>
  <div class="enterprise-list">
    <div class="top">
      <div class="back" @click="goback">
        <van-icon name="arrow-left" />返回
      </div>企业列表
    </div>
    <div class="content">
      <van-index-bar>
        <van-index-anchor index="A" />
        <van-cell title="文本" />
        <van-cell title="文本" />
        <van-cell title="文本" />
        <van-index-anchor index="B" />
        <van-cell title="文本" />
        <van-cell title="文本" />
        <van-cell title="文本" />
        <van-index-anchor index="C" />
        <van-cell title="文本" />
        <van-cell title="文本" />
        <van-cell title="文本" />
        <van-index-anchor index="D" />
        <van-cell title="文本" />
        <van-cell title="文本" />
        <van-cell title="文本" />
        <van-index-anchor index="E" />
        <van-cell title="文本" />
        <van-cell title="文本" />
        <van-cell title="文本" />
        <van-index-anchor index="F" />
        <van-cell title="文本" />
        <van-cell title="文本" />
        <van-cell title="文本" />
        <van-index-anchor index="G" />
        <van-cell title="文本" />
        <van-cell title="文本" />
        <van-cell title="文本" />
        <van-index-anchor index="H" />
        <van-cell title="文本" />
        <van-cell title="文本" />
        <van-cell title="文本" />
        <van-index-anchor index="I" />
        <van-cell title="文本" />
        <van-cell title="文本" />
        <van-cell title="文本" />
        <van-index-anchor index="J" />
        <van-cell title="文本" />
        <van-cell title="文本" />
        <van-cell title="文本" />
        <van-index-anchor index="K" />
        <van-cell title="文本" />
        <van-cell title="文本" />
        <van-cell title="文本" />
        <van-index-anchor index="L" />
        <van-cell title="文本" />
        <van-cell title="文本" />
        <van-cell title="文本" />
        <van-index-anchor index="M" />
        <van-cell title="文本" />
        <van-cell title="文本" />
        <van-cell title="文本" />
        <van-index-anchor index="Z" />
        <van-cell title="文本" />
        <van-cell title="文本" />
        <van-cell title="文本" />
      </van-index-bar>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    goback() {
      this.$router.push({
        path: "/enterpriseMap"
      });
    }
  }
};
</script>

<style lang="less" scoped>
.enterprise-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 50px;
  .top {
    height: 50px;
    background: url("../../assets/image/top-bg.png") no-repeat;
    background-position: right bottom;
    background-size: cover;
    position: fixed;
    text-align: center;
    line-height: 50px;
    font-family: "FZSong";
    color: #fff;
    font-size: 16px;
    z-index: 999;
    top: 0px;
    left: 0px;
    width: 100%;
    .back {
      width: 45px;
      height: 18px;
      position: absolute;
      left: 16px;
      top: 50%;
      line-height: 18px;
      transform: translateY(-50%);
      font-size: 14px;
      font-family: "FZSong";
      text-align: right;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .content {
    background-color: #ecf1f7;
    overflow-y: auto;
    flex: 1;
  }
}
.van-cell {
  position: relative;
}
.van-cell::after {
  content: "定位";
  border: none;
  width: 45px;
  height: 15px;
  background: url("../../assets/image/location.png") no-repeat;
  background-size: 15px 15px;
  font-size: 12px;
  line-height: 16px;
  text-align: right;
  position: absolute;
  top: 15px;
  left: 0;
  transform: translateX(250px);
  color: #975b16;
  font-family: "FZSong";
}
</style>