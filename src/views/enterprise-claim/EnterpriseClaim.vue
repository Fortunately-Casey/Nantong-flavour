<template>
  <div class="enterprise-claim">
    <div class="top">
      <div class="back" @click="back"><van-icon name="arrow-left" />返回</div>
      企业认领
      <div class="edit" :class="canEdit ? 'can-edit' : ''" @click="edit">
        编辑
      </div>
    </div>
    <div class="content">
      <div class="enterprise-info">
        <div class="item">
          <div class="name">企业名称</div>
          <div class="value">
            <input
              type="text"
              @blur="blur"
              v-model="enterpriseName"
              :disabled="!canEdit"
            />
          </div>
        </div>
        <div class="item">
          <div class="name">企业电话</div>
          <div class="value">
            <input
              type="text"
              @blur="blur"
              v-model="phoneNumber"
              :disabled="!canEdit"
            />
          </div>
        </div>
        <div class="item">
          <div class="name">成立时间</div>
          <div class="value" @click="showCreateDate">
            {{ toDate(createTime) }}
          </div>
        </div>
        <div class="item" style="padding:0;margin:0 16px">
          <div class="name">企业地址</div>
          <div class="value"></div>
        </div>
        <div class="item">
          <div class="name"></div>
          <div class="value">
            <input
              type="text"
              v-model="enterpriseAddress"
              style="width:100%"
              @blur="blur"
              :disabled="!canEdit"
            />
          </div>
        </div>
      </div>
      <div class="enterprise-explain">
        <div class="item">
          <div class="name">企业说明</div>
        </div>
        <div class="text-area">
          <textarea
            name
            id
            maxlength="50"
            v-model="enterpriseExplain"
            :disabled="!canEdit"
          ></textarea>
        </div>
      </div>
      <div class="enterprise-photo">
        <div class="left">企业照片</div>
        <div class="right">
          <van-uploader
            v-model="fileList"
            multiple
            :after-read="afterRead"
            max-count="2"
          />
        </div>
      </div>
      <div class="special-offers">
        <div class="item">
          <div class="name">优惠信息</div>
          <div class="value">
            <div class="add-button" @click="isShowAdd = true">
              <div class="add-icon"></div>
              新增优惠
            </div>
          </div>
        </div>
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
      <div class="bottom" v-if="isClaimed && !canEdit">
        <div class="claim-cancel"></div>
        <div class="punch-button"></div>
      </div>
      <div class="bottom" v-if="isClaimed && canEdit">
        <div class="cancel"></div>
        <div class="save-button"></div>
      </div>
      <div
        class="claim-button"
        v-if="!isClaimed"
        @click="isShowClaim = true"
      ></div>
      <van-popup v-model="isShowClaim" round>
        <div class="commit-affirm">
          <div class="text">
            请确认这是您的企业后再进行提交哦～ 是否确认提交？
          </div>
          <div class="buttons">
            <div class="canncel" @click="isShowClaim = false">再想想</div>
            <div class="confirm" @click="comfirmCommit">确认提交</div>
          </div>
        </div>
      </van-popup>
    </div>
    <div class="date-time" v-if="isShowCreateDate">
      <van-datetime-picker
        v-model="enterpriseDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="confirmCreateDate"
        @cancel="canncelCreateDate"
      />
    </div>
    <van-dialog v-model="isShowAdd" title="新增优惠" show-cancel-button>
      <van-field
        v-model="specialTitle"
        name="优惠标题"
        label="优惠标题"
        placeholder="请输入优惠标题"
        :rules="[{ required: true, message: '请填写优惠标题' }]"
      />
      <van-field
        readonly
        clickable
        name="calendar"
        :value="date"
        label="活动时间"
        placeholder="请选择活动时间"
        @click="show = true"
      />
      <van-field
        v-model="specialAddress"
        name="优惠地址"
        label="优惠地址"
        placeholder="请输入优惠地址"
        :rules="[{ required: true, message: '请填写优惠地址' }]"
      />
    </van-dialog>
    <van-calendar v-model="show" type="range" @confirm="onConfirm" />
  </div>
</template>

<script>
import { blur, Todate } from "@/common/tool/tool.js";
import { Toast } from "vant";
import Scroll from "@/components/Scroll";
import * as api from "@/service/apiList";
import http from "@/service/service";
export default {
  data() {
    return {
      createTime: new Date(),
      enterpriseName: "",
      phoneNumber: "",
      enterpriseAddress: "",
      enterpriseExplain: "",
      fileList: [],
      minDate: new Date(2000, 1, 1),
      maxDate: new Date(2055, 1, 1),
      enterpriseDate: new Date(),
      isShowCreateDate: false,
      isShowClaim: false,
      canEdit: false,
      isClaimed: false,
      isShowAdd: false,
      specialTitle: "",
      specialAddress: "",
      date: "",
      show: false
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      let vm = this;
      http
        .get(api.COMPANYINFO, {
          companyID: this.$route.query.companyID
        })
        .then(resp => {
          console.log(resp.data.data);
          vm.enterpriseName = resp.data.data.companyName;
          vm.phoneNumber = resp.data.data.linkPhone;
          vm.createTime = resp.data.data.companyOffers.createTime;
          vm.enterpriseAddress = resp.data.data.address;
          vm.enterpriseExplain = resp.data.data.description;
        });
    },
    blur() {
      blur();
    },
    toDate(date) {
      return Todate(date);
    },
    onConfirm(date) {
      console.log(date);
      const [start, end] = date;
      this.show = false;
      this.date = `${this.toDate(start)} - ${this.toDate(end)}`;
    },
    confirmCreateDate(date) {
      this.createTime = this.toDate(date);
      this.isShowCreateDate = false;
    },
    canncelCreateDate() {
      this.isShowCreateDate = false;
    },
    showCreateDate() {
      if (!this.canEdit) {
        return;
      }
      this.isShowCreateDate = true;
    },
    afterRead(file) {
      console.log(file);
    },
    comfirmCommit() {
      this.isClaimed = true;
      this.isShowClaim = false;
    },
    edit() {
      if (!this.isClaimed) {
        Toast("请先认领然后才能进行编辑！");
        return;
      }
      this.canEdit = true;
    },
    back() {
      this.$router.push({
        path: "/enterpriseMap"
      });
    }
  },
  components: {
    Scroll
  }
};
</script>
<style lang="less" scoped>
.enterprise-claim {
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
    position: relative;
    .enterprise-info {
      background-color: #fff;
      .item {
        height: 44px;
        border-bottom: 1px solid #ecf1f7;
        padding: 0 16px;
        display: flex;
        align-items: center;
        .name {
          font-family: "FZSong";
          font-size: 16px;
          width: 65px;
          text-align: center;
        }
        .value {
          flex: 1;
          height: 44px;
          display: flex;
          flex-direction: row-reverse;
          align-items: center;
          color: #728096;
          font-family: "FZSong";
          font-size: 16px;
          input {
            height: 40px;
            text-align: right;
            color: #728096;
            font-family: "FZSong";
            font-size: 16px;
          }
        }
      }
    }
    .enterprise-explain,
    .special-offers {
      background-color: #fff;
      margin-top: 12px;
      .item {
        height: 44px;
        border-bottom: 1px solid #ecf1f7;
        padding: 0 16px;
        display: flex;
        align-items: center;
        .name {
          font-family: "FZSong";
          font-size: 16px;
          width: 65px;
          text-align: center;
        }
        .value {
          flex: 1;
          height: 44px;
          display: flex;
          flex-direction: row-reverse;
          align-items: center;
          color: #728096;
          font-family: "FZSong";
          font-size: 16px;
          .add-button {
            color: #975b16;
            font-family: "FZSong";
            position: relative;
            .add-icon {
              width: 8px;
              height: 8px;
              background: url("../../assets/image/add-icon.png") no-repeat;
              background-size: 100% 100%;
              position: absolute;
              left: -10px;
              top: 50%;
              transform: translateY(-50%);
            }
          }
        }
      }

      .text-area {
        textarea {
          width: 100%;
          border: none;
          height: 45px;
          line-height: 22.5px;
          padding: 0 16px;
          resize: none;
          font-family: "FZSong";
          color: #728096;
        }
      }
    }
    .enterprise-photo {
      height: 100px;
      background-color: #fff;
      margin-top: 12px;
      padding: 0 16px;
      display: flex;
      .left {
        width: 70px;
        font-family: "FZSong";
        font-size: 16px;
        text-align: center;
        line-height: 100px;
        margin-right: 15px;
      }
      .right {
        flex: 1;
        display: flex;
        align-items: center;
        padding-top: 10px;
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

    .claim-button {
      width: 260px;
      height: 36px;
      background: url("../../assets/image/claim-button.png") no-repeat;
      background-size: 100% 100%;
      margin: 0 auto;
      margin-top: 20px;
      margin-bottom: 20px;
    }
    .bottom {
      width: 100%;
      height: 40px;
      padding-top: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      .claim-cancel {
        width: 112px;
        height: 35px;
        background: url("../../assets/image/claim-cancel.png") no-repeat;
        background-size: 100% 100%;
      }
      .punch-button {
        width: 112px;
        height: 35px;
        background: url("../../assets/image/punch-button.png") no-repeat;
        background-size: 100% 100%;
        margin-left: 30px;
      }
      .cancel {
        width: 112px;
        height: 35px;
        background: url("../../assets/image/cancel-button.png") no-repeat;
        background-size: 100% 100%;
      }
      .save-button {
        width: 112px;
        height: 35px;
        background: url("../../assets/image/save-button.png") no-repeat;
        background-size: 100% 100%;
        margin-left: 30px;
      }
    }
    .commit-affirm {
      width: 260px;
      height: 90px;
      font-weight: 500;
      font-size: 16px;
      .text {
        margin-top: 20px;
        padding: 0 15px;
        font-family: "FZSong";
        text-align: center;
        font-size: 13px;
      }
      .buttons {
        height: 40px;
        display: flex;
        border-top: 1px solid #cbd5e0;
        margin-top: 18px;
        .canncel {
          flex: 1;
          border-right: 1px solid #cbd5e0;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: "FZSong";
          color: #a0aec0;
        }
        .confirm {
          flex: 1;
          display: flex;
          justify-content: center;
          font-family: "FZSong";
          align-items: center;
          color: #975b16;
        }
      }
    }
  }
  .date-time {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
  }
}
</style>
