<template>
  <div class="enterprise-claim">
    <div class="top">
      <div class="back" @click="back"><van-icon name="arrow-left" />返回</div>
      店铺认领
      <div class="edit" :class="canEdit ? '' : 'can-edit'" @click="edit">
        编辑
      </div>
    </div>
    <div class="content">
      <div class="enterprise-info">
        <div class="item">
          <div class="name">店铺名称</div>
          <div class="value">
            <input
              type="text"
              @blur="blur"
              v-model="enterpriseName"
              :disabled="true"
            />
          </div>
        </div>
        <div class="item">
          <div class="name">店铺电话</div>
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
          <div class="name">营业时间</div>
          <div class="value">
            <!-- {{ startTime }} -->
            <div class="end" @click="showEndTime">{{ endTime }}</div>
            -
            <div class="start" @click="showStartTime">{{ startTime }}</div>
          </div>
        </div>
        <div class="item" style="padding:0;margin:0 16px">
          <div class="name">店铺地址</div>
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
          <div class="name">店铺说明</div>
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
        <div class="left">店铺照片</div>
        <scroll class="wrapper1">
          <div class="right">
            <van-uploader
              v-model="fileList"
              multiple
              :after-read="afterRead"
              max-count="8"
              :disabled="!canEdit"
              :deletable="canEdit"
            />
          </div>
        </scroll>
      </div>
      <div class="special-offers">
        <div class="item">
          <div class="name">优惠信息</div>
          <div class="value">
            <div class="add-button" @click="add">
              <div class="add-icon"></div>
              新增优惠
            </div>
          </div>
        </div>
      </div>
      <scroll class="wrapper">
        <ul class="offers-list">
          <!-- <span>暂无优惠信息</span> -->
          <li
            class="offer-item"
            v-for="(item, index) in companyOffers"
            :key="index"
          >
            <van-icon
              name="cross"
              class="close-icon"
              @click="deleteOffer(index)"
            />
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
      <div class="bottom">
        <div class="cancel" @click="cancel" v-if="isClaimed && canEdit"></div>
        <div
          class="save-button"
          @click="saveConfirm"
          v-if="isClaimed && canEdit"
        ></div>
        <div
          class="claim-button"
          v-if="!isClaimed"
          @click="isShowClaim = true"
        ></div>
      </div>

      <van-popup v-model="isShowClaim" round>
        <div class="commit-affirm">
          <div class="text">
            请确认这是您的店铺后再进行提交哦～ 是否确认提交？
          </div>
          <div class="buttons">
            <div class="canncel" @click="isShowClaim = false">再想想</div>
            <div class="confirm" @click="comfirmCommit">确认提交</div>
          </div>
        </div>
      </van-popup>
    </div>
    <div class="date-time" v-if="isShowStartTime">
      <van-datetime-picker
        v-model="currentTime1"
        type="time"
        title="选择时间"
        :min-hour="0"
        :max-hour="24"
        @confirm="confirmStart"
        @cancel="isShowStartTime = false"
      />
    </div>
    <div class="date-time" v-if="isShowEndTime">
      <van-datetime-picker
        v-model="currentTime2"
        type="time"
        title="选择时间"
        :min-hour="0"
        :max-hour="24"
        @confirm="confirmEnd"
        @cancel="isShowEndTime = false"
      />
    </div>
    <van-dialog
      v-model="isShowAdd"
      title="新增优惠"
      show-cancel-button
      @confirm="addConfirm"
    >
      <van-field
        v-model="offerTitle"
        name="优惠标题"
        label="优惠标题"
        placeholder="请输入优惠标题"
        maxlength="8"
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
        v-model="offerDescription"
        name="活动描述"
        label="活动描述"
        placeholder="请输入活动描述"
        maxlength="12"
        :rules="[{ required: true, message: '请填写活动描述' }]"
      />
    </van-dialog>
    <van-calendar v-model="show" type="range" @confirm="onConfirm" />
  </div>
</template>

<script>
import { Dialog, Notify } from "vant";
import { blur, Todate } from "@/common/tool/tool.js";
import { Toast } from "vant";
import Scroll from "@/components/Scroll";
import * as api from "@/service/apiList";
import http from "@/service/service";
import { Indicator } from "mint-ui";
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
      isShowStartTime: false,
      isShowEndTime: false,
      isShowClaim: false,
      canEdit: false,
      startTime: "",
      endTime: "",
      currentTime1: "",
      currentTime2: "",
      isClaimed: false,
      isShowAdd: false,
      offerTitle: "",
      offerDescription: "",
      date: "",
      show: false,
      companyOffers: [],
      bodyHeight: ""
    };
  },
  created() {},
  mounted() {
    this.$nextTick(function() {
      this.getDetail();
    });
  },
  methods: {
    getDetail() {
      let vm = this;
      vm.fileList = [];
      vm.companyOffers = [];
      Indicator.open();
      http
        .get(api.COMPANYINFO, {
          companyID: this.$route.query.companyID
        })
        .then(resp => {
          Indicator.close();
          vm.enterpriseName = resp.data.data.companyName;
          vm.phoneNumber = resp.data.data.linkPhone;
          vm.createTime = resp.data.data.companyOffers.createTime;
          vm.enterpriseAddress = resp.data.data.address;
          vm.enterpriseExplain = resp.data.data.description;
          if (resp.data.data.claimStatus) {
            vm.isClaimed = true;
          }
          if (resp.data.data.businessHours) {
            vm.startTime = resp.data.data.businessHours.split("-")[0];
            vm.endTime = resp.data.data.businessHours.split("-")[1];
          }
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
    blur() {
      blur();
    },
    toDate(date) {
      return Todate(date);
    },
    addConfirm() {
      let vm = this;
      this.companyOffers.push({
        companyID: vm.$route.query.companyID,
        offerTitle: vm.offerTitle,
        offerStartTime: vm.date.split("~")[0],
        offerEndTime: vm.date.split("~")[1],
        offerDescription: vm.offerDescription
      });
    },
    // addNewoffer1() {
    //   this.isShowAdd = true;
    //   this.offerTitle = "";
    //   this.date = "";
    //   this.offerDescription = "";
    // },
    add() {
      if (!this.canEdit) {
        return;
      }
      this.isShowAdd = true;
      this.offerTitle = "";
      this.date = "";
      this.offerDescription = "";
    },
    onConfirm(date) {
      // console.log(date);
      const [start, end] = date;
      this.show = false;
      this.date = `${this.toDate(start)} ~ ${this.toDate(end)}`;
    },
    deleteOffer(index) {
      if (!this.canEdit) {
        return;
      }
      this.companyOffers.splice(index, 1);
    },
    showStartTime() {
      if (!this.canEdit) {
        return;
      }
      this.isShowStartTime = true;
    },
    showEndTime() {
      if (!this.canEdit) {
        return;
      }
      this.isShowEndTime = true;
    },
    afterRead(file) {
      console.log(file);
    },
    comfirmCommit() {
      let vm = this;
      Indicator.open();
      http
        .post(api.CLAIMCOMPANY, {
          companyID: vm.$route.query.companyID
        })
        .then(resp => {
          Indicator.close();
          if (resp.data.success) {
            this.isClaimed = true;
            this.isShowClaim = false;
            Notify({ type: "success", message: "认领成功" });
            vm.getDetail();
          } else {
            Notify({ type: "warning", message: resp.data.message });
          }
        });
    },
    confirmStart(value) {
      this.startTime = value;
      this.isShowStartTime = false;
    },
    confirmEnd(value) {
      this.endTime = value;
      this.isShowEndTime = false;
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
    },
    cancel() {
      this.getDetail();
      this.canEdit = false;
    },
    saveConfirm() {
      let vm = this;
      Dialog.confirm({
        title: "保存更改",
        message: "确认要保存改店铺信息吗？"
      }).then(() => {
        Indicator.open();
        let formData = new FormData();
        // let files = [];
        // console.log(this.fileList);
        let arr = [];
        this.fileList.map(v => {
          if (!v.url) {
            formData.append("file", v.file);
          }
          if (v.url) {
            arr.push(v.url);
          }
        });
        formData.append("corporatePictures", arr.join(";"));
        formData.append("companyID", vm.$route.query.companyID);
        formData.append("companyName", vm.enterpriseName);
        formData.append("linkPhone", vm.phoneNumber);
        formData.append("address", vm.enterpriseAddress);
        formData.append("businessHours", `${vm.startTime}-${vm.endTime}`);
        formData.append("description", vm.enterpriseExplain);
        // formData.append("companyOffers", vm.companyOffers);
        formData.append("jsonStr", JSON.stringify(vm.companyOffers));
        // console.log(vm.companyOffers.join(','));
        // console.log(formData.get('companyOffers'))
        http.upload(api.COMPANYINFOMODIFY, formData, vm).then(resp => {
          Indicator.close();
          if (resp.data.success) {
            this.isClaimed = false;
            Notify({ type: "success", message: "修改成功" });
            vm.getDetail();
          } else {
            Notify({ type: "warning", message: "取消失败" });
          }
        });
      });
    }
  },
  beforeDestroy() {
    window.event.returnValue = true;
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
          width: 75px;
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
          .start,
          .end {
            float: right;
            width: 50px;
            height: 40px;
            color: #728096;
            font-family: "FZSong";
            text-align: center;
            line-height: 40px;
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
          width: 75px;
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
        width: 100px;
        font-family: "FZSong";
        font-size: 16px;
        text-align: center;
        line-height: 100px;
        margin-right: 15px;
      }
      .wrapper1 {
        width: 100%;
        overflow: hidden;
        .right {
          // flex: 1;
          width: 800px;
          display: flex;
          align-items: center;
          padding-top: 10px;
        }
      }
    }
    .wrapper {
      width: 100%;
      overflow: hidden;
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
              margin-right: 8px;
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
    }
    .bottom {
      width: 100%;
      // height: 40px;
      padding-top: 30px;
      padding-bottom: 30px;
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
      height: 108px;
      font-weight: 500;
      font-size: 16px;
      .text {
        margin-top: 20px;
        padding: 0 15px;
        font-family: "FZSong";
        text-align: center;
        line-height: 25px;
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
