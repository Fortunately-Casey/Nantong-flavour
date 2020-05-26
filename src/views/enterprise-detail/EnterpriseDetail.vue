<template>
  <div
    class="enterprise-detail"
    :style="{ height: bodyHeight ? bodyHeight + 'px' : '100%' }"
  >
    <div class="top">
      <div class="back" @click="back"><van-icon name="arrow-left" />返回</div>
      企业详情
    </div>
    <div class="content">
      <div class="name">{{ enterpriseName }}</div>
      <div class="image-content">
        <div class="name">企业图片</div>
        <scroll class="wrapper1">
          <div class="image-list">
            <van-image
              width="120"
              height="80"
              :src="item.url"
              alt
              v-for="(item, index) in fileList"
              :key="index"
              @click="showImage"
              fit="contain"
            />
          </div>
        </scroll>
      </div>
      <div class="address-content">
        <div class="left">
          <div class="address">
            <div class="icon"></div>
            {{ address }}
          </div>
          <div class="open-time">
            <div class="icon"></div>
            营业时间：{{ businessHours }}
          </div>
          <div class="linkphone">
            <div class="icon"></div>
            联系电话：{{ linkPhone }}
          </div>
        </div>
        <!-- <div class="right">
          <div class="phone-icon" @click="showPhone"></div>
        </div>-->
      </div>
      <div class="enterprise-info">
        <div class="info">
          <div class="icon"></div>
          企业说明
        </div>
        <div class="info-text">{{ description }}</div>
      </div>
      <div class="discounts-info">
        <div class="info">
          <div class="icon"></div>
          优惠信息
        </div>
        <scroll class="wrapper">
          <ul class="offers-list">
            <li
              class="offer-item"
              v-for="(item, index) in companyOffers"
              :key="index"
            >
              <div class="offer-name">
                <div class="icon"></div>
                {{ item.offerTitle }}
              </div>
              <div class="offer-address">
                活动时间:{{ item.offerStartTime + "-" + item.offerEndTime }}
              </div>
              <div class="offer-time">活动描述:{{ item.offerDescription }}</div>
            </li>
          </ul>
        </scroll>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, ImagePreview } from "vant";
import Scroll from "@/components/Scroll";
import * as api from "@/service/apiList";
import http from "@/service/service";
import { Indicator } from "mint-ui";
import { Image as VanImage } from "vant";
export default {
  data() {
    return {
      enterpriseName: "",
      address: "",
      linkPhone: "",
      businessHours: "",
      description: "",
      fileList: [],
      companyOffers: [],
      bodyHeight: ""
    };
  },
  created() {
    this.getDetail();
  },
  mounted() {
    this.bodyHeight = document.documentElement.clientHeight;
  },
  methods: {
    getDetail() {
      let vm = this;
      Indicator.open();
      http
        .get(api.COMPANYINFOBYTEMP, {
          companyID: this.$route.query.companyID
        })
        .then(resp => {
          Indicator.close();
          vm.enterpriseName = resp.data.data.companyName;
          vm.linkPhone = resp.data.data.linkPhone;
          vm.createTime = resp.data.data.companyOffers.createTime;
          vm.address = resp.data.data.address;
          vm.enterpriseExplain = resp.data.data.description;
          if (resp.data.data.claimStatus) {
            vm.isClaimed = true;
          }
          vm.businessHours = resp.data.data.businessHours;
          vm.description = resp.data.data.description;
          resp.data.data.companyOffers.map(v => {
            vm.companyOffers.push({
              companyID: v.companyID,
              offerTitle: v.offerTitle,
              offerStartTime: v.offerStartTime,
              offerEndTime: v.offerEndTime,
              offerDescription: v.offerDescription
            });
          });
          if (resp.data.data.corporatePictures) {
            let pictures = resp.data.data.corporatePictures.split(";");
            pictures.map(v => {
              if (v != "") {
                vm.fileList.push({
                  url: v
                });
              }
            });
          }
        });
    },
    showPhone() {
      Toast.setDefaultOptions({ duration: 4000 });
      Toast(this.linkPhone);
    },
    showImage() {
      let arr = [];
      this.fileList.map(v => {
        arr.push(v.url);
      });
      ImagePreview(arr);
    },
    back() {
      this.$router.push({
        path: "/visitorPage"
      });
    }
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
        padding-left: 0;
        font-size: 14px;
        border: none;
      }
      .wrapper1 {
        width: 100%;
        overflow: hidden;
        -webkit-overflow-scrolling: touch;
        .image-list {
          width: 1000px;
          img {
            width: 120px;
            height: 80px;
            border-radius: 4px;
            margin-right: 10px;
          }
        }
      }
    }
    .address-content {
      height: 132px;
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
        .open-time,
        .linkphone {
          flex: 1;
          line-height: 44px;
          font-family: "FZSong";
          padding-left: 20px;
          position: relative;
          border-bottom: 1px solid #ecf1f7;
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
        .linkphone {
          .icon {
            width: 15px;
            height: 15px;
            background: url("../../assets/image/phone-icon.png") no-repeat;
            background-size: 100% 100%;
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
      padding-bottom: 20px;
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
        -webkit-overflow-scrolling: touch;
        .offers-list {
          width: 770px;
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
            width: 255px;
            height: 119px;
            background: url("../../assets/image/offer-bg.png") no-repeat;
            background-size: 100% 100%;
            padding-left: 20px;
            position: relative;
            .close-icon {
              position: absolute;
              right: 10px;
              top: 25px;
              font-size: 18px;
              color: #fff;
            }
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
