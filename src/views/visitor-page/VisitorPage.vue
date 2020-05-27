<template>
  <div class="visitor" :style="{ height: bodyHeight ? bodyHeight + 'px' : '100%' }">
    <router-view></router-view>
    <div class="bottom-tab">
      <div class="left" @click="choseTab(0)">
        <div class="icon" :class="chosedIndex === 0 ? 'active' : ''"></div>
        <div class="name" :class="chosedIndex === 0 ? 'chosed' : ''">主页</div>
      </div>
      <div class="right" @click="choseTab(1)">
        <div class="icon" :class="chosedIndex === 1 ? 'active' : ''"></div>
        <div class="name" :class="chosedIndex === 1 ? 'chosed' : ''">
          店铺列表
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chosedIndex: 0
    };
  },
  methods: {
    choseTab(index) {
      this.chosedIndex = index;
      if (index === 0) {
        this.$router.push({
          path: "/visitorPage/visitorMap"
        });
      } else {
        this.$router.push({
          path: "/visitorPage/factoryList"
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.visitor {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 60px;
  .content {
    flex: 1;
  }
  .bottom-tab {
    width: 100%;
    height: 60px;
    background: #ffffff;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.3);
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    .left,
    .right {
      flex: 1;
      padding-top: 5px;
      .name {
        font-family: "FZSong";
        font-size: 14px;
        margin-top: 10px;
      }
      .chosed {
        color: #b77920;
      }
    }
    .left {
      display: flex;
      flex-direction: column;
      align-items: center;
      .icon {
        width: 24px;
        height: 20px;
        background: url("../../assets/image/home-icon1.png") no-repeat;
        background-size: 100% 100%;
      }
      .active {
        background: url("../../assets/image/home-icon.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      align-items: center;
      .icon {
        width: 20px;
        height: 20px;
        background: url("../../assets/image/enterprise-icon.png") no-repeat;
        background-size: 100% 100%;
      }
      .active {
        background: url("../../assets/image/enterprise-icon1.png") no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}
</style>
