<template>
  <div class="enterprise-detail">
    <div class="top">
      <div class="back" @click="back"><van-icon name="arrow-left" />返回</div>
      企业详情
    </div>
    <div class="content">
      <div class="name">一柱楼食品有限公司</div>
      <div class="image-content">
        <div class="name">企业图片</div>
        <div class="image-list">
          <img src="../../assets/image/box.png" alt />
          <img src="../../assets/image/box.png" alt />
        </div>
      </div>
      <div class="address-content">
        <div class="left">
          <div class="address">
            <div class="icon"></div>
            江苏省南通市崇川区工农路172号
          </div>
          <div class="open-time">
            <div class="icon"></div>
            营业时间：9:00-23:00
          </div>
        </div>
        <div class="right">
          <div class="phone-icon" @click="showPhone"></div>
        </div>
      </div>
      <div class="enterprise-info">
        <div class="info">
          <div class="icon"></div>
          企业说明
        </div>
        <div class="info-text">
          由各种物质组成的巨型球状天体，叫做星球。由各种物质组成的巨型球状天体，叫做星球。
        </div>
      </div>
      <div class="discounts-info">
        <div class="info">
          <div class="icon"></div>
          优惠信息
        </div>
        <scroll class="wrapper">
          <ul class="offers-list">
            <!-- <span>暂无优惠信息</span> -->
            <li class="offer-item">
              <div class="offer-name">
                <div class="icon"></div>
                全店满500减50
              </div>
              <div class="offer-address">活动时间:2020-05-20-2020-05-30</div>
              <div class="offer-time">活动地址:工农路一柱楼前台</div>
            </li>
            <li class="offer-item">
              <div class="offer-name">
                <div class="icon"></div>
                全店满500减50
              </div>
              <div class="offer-address">活动时间:2020-05-20-2020-05-30</div>
              <div class="offer-time">活动地址:工农路一柱楼前台</div>
            </li>
            <li class="offer-item">
              <div class="offer-name">
                <div class="icon"></div>
                全店满500减50
              </div>
              <div class="offer-address">活动时间:2020-05-20-2020-05-30</div>
              <div class="offer-time">活动地址:工农路一柱楼前台</div>
            </li>
          </ul>
        </scroll>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import Scroll from "@/components/Scroll";
export default {
  data() {
    return {};
  },
  created() {},
  methods: {
    showPhone() {
      Toast.setDefaultOptions({ duration: 4000 });
      Toast("0513-84883768");
    },
    back() {}
  },
  components: {
    Scroll
  }
};
</script>

<style lang="less" scoped>
.enterprise-detail {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .top {
    height: 50px;
    background: url("../../assets/image/top-bg.png") no-repeat;
    background-position: right bottom;
    background-size: cover;
    position: relative;
    text-align: center;
    line-height: 50px;
    font-family: "FZSong";
    color: #fff;
    font-size: 18px;
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
    .edit {
      width: 40px;
      height: 18px;
      line-height: 18px;
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255, 255, 255, 0.6);
      font-family: "FZSong";
      font-size: 16px;
    }
    .can-edit {
      color: #fff;
    }
  }
  .content {
    flex: 1;
    background-color: #ecf1f7;
    .name {
      height: 44px;
      border-bottom: 1px solid #ecf1f7;
      padding: 0 16px;
      background-color: #fff;
      line-height: 44px;
      font-family: "FZSong";
      font-size: 14px;
    }
    .image-content {
      height: 138px;
      border-bottom: 1px solid #ecf1f7;
      padding: 0 16px;
      background-color: #fff;
      .name {
        height: 44px;
        line-height: 44px;
        font-family: "FZSong";
        font-size: 14px;
        border: none;
      }
      .image-list {
        img {
          width: 120px;
          height: 80px;
          border-radius: 4px;
          background-color: #000;
          margin-right: 10px;
        }
      }
    }
    .address-content {
      height: 88px;
      background-color: #fff;
      border-bottom: 1px solid #ecf1f7;
      margin-top: 15px;
      padding: 0 16px;
      display: flex;
      .left {
        flex: 1;
        display: flex;
        flex-direction: column;
        .address {
          flex: 1;
          border-bottom: 1px solid #ecf1f7;
          line-height: 44px;
          font-family: "FZSong";
          padding-left: 20px;
          position: relative;
          .icon {
            width: 14px;
            height: 16px;
            background: url("../../assets/image/address-icon.png") no-repeat;
            background-size: 100% 100%;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
        .open-time {
          flex: 1;
          line-height: 44px;
          font-family: "FZSong";
          padding-left: 20px;
          position: relative;
          .icon {
            width: 14px;
            height: 16px;
            background: url("../../assets/image/time-icon.png") no-repeat;
            background-size: 100% 100%;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
      .right {
        width: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        .phone-icon {
          width: 15px;
          height: 15px;
          background: url("../../assets/image/phone-icon.png") no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    .enterprise-info {
      height: 116px;
      background-color: #fff;
      border-bottom: 1px solid #ecf1f7;
      margin-top: 15px;
      padding: 0 16px;
      .info {
        border-bottom: 1px solid #ecf1f7;
        line-height: 44px;
        font-family: "FZSong";
        padding-left: 20px;
        position: relative;
        .icon {
          width: 14px;
          height: 16px;
          background: url("../../assets/image/address-icon.png") no-repeat;
          background-size: 100% 100%;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .info-text {
        height: 72px;
        font-family: "FZSong";
        padding-top: 5px;
        font-size: 14px;
        color: #728096;
        line-height: 22.5px;
      }
    }
    .discounts-info {
      background-color: #fff;
      margin-top: 15px;
      padding: 0 16px;
      .info {
        border-bottom: 1px solid #ecf1f7;
        line-height: 44px;
        font-family: "FZSong";
        padding-left: 20px;
        position: relative;
        .icon {
          width: 16px;
          height: 12px;
          background: url("../../assets/image/juan.png") no-repeat;
          background-size: 100% 100%;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .wrapper {
        width: 100%;
        overflow: hidden;
        .offers-list {
          width: 750px;
          min-height: 68px;
          background-color: #fff;
          overflow: hidden;
          span {
            font-family: "FZSong";
            font-size: 14px;
            color: #728096;
          }
          .offer-item {
            float: left;
            width: 247px;
            height: 119px;
            background: url("../../assets/image/offer-bg.png") no-repeat;
            background-size: 100% 100%;
            padding-left: 20px;
            .offer-name {
              display: flex;
              align-items: center;
              height: 35px;
              margin-top: 25px;
              color: #975b16;
              font-family: "FZSong";
              font-size: 16px;
              .icon {
                width: 16px;
                height: 16px;
                background: url("../../assets/image/gift.png") no-repeat;
                background-size: 100% 100%;
              }
            }
            .offer-address,
            .offer-time {
              height: 25px;
              line-height: 25px;
              color: #d69e2e;
              font-family: "FZSong";
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>
