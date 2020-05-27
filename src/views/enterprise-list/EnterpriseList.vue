<template>
  <div class="enterprise-list" :style="{ height: bodyHeight ? bodyHeight + 'px' : '100%' }">
    <div class="top">
      <div class="back" @click="goback"><van-icon name="arrow-left" />返回</div>
      店铺列表
    </div>
    <div class="content">
      <van-index-bar :index-list="indexList">
        <div v-for="(item, index) in barList" :key="index">
          <van-index-anchor :index="item.key" />
          <van-cell
            :title="v.companyName"
            v-for="(v, i) in item.items"
            :key="i"
            @click="goToEnterprise(v)"
          />
        </div>
      </van-index-bar>
    </div>
  </div>
</template>

<script>
import * as api from "@/service/apiList";
import http from "@/service/service";
// import { EventBus } from "@/common/eventBus.js";
import { Indicator } from "mint-ui";
export default {
  data() {
    return {
      barList: [],
      indexList: [],
      bodyHeight:""
    };
  },
  created() {
    this.getCompanyList();
  },
  mounted() {
    this.bodyHeight = document.documentElement.clientHeight;
  },
  methods: {
    getCompanyList() {
      let vm = this;
      Indicator.open();
      http.get(api.COMPANYLIST, {}, vm).then(resp => {
        Indicator.close();
        let res = resp.data.data;
        let arr = [];
        for (var k in res) {
          arr.push({
            key: k,
            items: res[k]
          });
          vm.indexList.push(k);
        }
        console.log(arr);
        vm.barList = arr;
      });
    },
    goToEnterprise(v) {
      // EventBus.$emit("chosedEnterprise", v);
      this.$router.push({
        path: "/enterpriseMap",
        query: {
          companyID: v.companyID
        }
      });
    },
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
    font-size: 18px;
    z-index: 999;
    top: 0px;
    left: 0px;
    width: 100%;
    .back {
      width: 50px;
      height: 18px;
      position: absolute;
      left: 16px;
      top: 50%;
      line-height: 18px;
      transform: translateY(-50%);
      font-size: 16px;
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
</style>
