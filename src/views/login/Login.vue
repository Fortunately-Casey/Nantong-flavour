<template>
  <div
    class="login-content"
    :style="{ height: bodyHeight ? bodyHeight + 'px' : '100%' }"
  >
    <div class="logo-top"></div>
    <div class="top-title"></div>
    <div class="top-title2"></div>
    <div class="bottom-logo"></div>
    <div class="bottom-title">技术支持：南通市测绘院有限公司</div>
    <div class="login-box">
      <div class="login" v-if="isLogin">
        <div class="input">
          <div class="user-icon"></div>
          <input
            type="number"
            placeholder="请填写手机号码"
            @blur="blur"
            v-model="username"
          />
        </div>
        <div class="input" style="margin-bottom:5px">
          <div class="pw-icon"></div>
          <input
            type="text"
            placeholder="输入密码"
            @blur="blur"
            style="-webkit-text-security:disc;text-security:disc;"
            v-model="userPW"
          />
        </div>
      </div>
      <div class="register" v-else>
        <div class="input">
          <div class="user-icon"></div>
          <input
            type="number"
            placeholder="请填写手机号码"
            @blur="blur"
            v-model="adminUserID"
          />
        </div>
        <div class="input">
          <div class="pw-icon"></div>
          <input
            type="text"
            placeholder="输入密码"
            @blur="blur"
            v-model="password"
            style="-webkit-text-security:disc;text-security:disc;"
          />
        </div>
        <div class="input" style="margin-bottom:5px">
          <div class="pw-icon"></div>
          <input
            type="text"
            placeholder="确认密码"
            @blur="blur"
            v-model="confirmPassword"
            style="-webkit-text-security:disc;text-security:disc;"
          />
        </div>
      </div>
      <div class="switch-button">
        <span @click="isLogin = !isLogin">{{ isLogin ? "注册" : "登录" }}</span>
      </div>
      <div class="login-button" v-if="isLogin" @click="login">登录</div>
      <div class="register-button" v-else @click="register">注册</div>
    </div>
  </div>
</template>
<script>
import { blur } from "@/common/tool/tool";
import * as api from "@/service/apiList";
import http from "@/service/service";
import { Notify } from "vant";
import { Indicator } from "mint-ui";
export default {
  data() {
    return {
      isLogin: true,
      bodyHeight: "",
      adminUserID: "",
      password: "",
      confirmPassword: "",
      username: "",
      userPW: ""
    };
  },
  created() {
    let username = window.localStorage.getItem("username");
    let password = window.localStorage.getItem("password");
    if (username) {
      this.username = username;
    }
    if (password) {
      this.userPW = password;
    }
  },
  mounted() {
    this.bodyHeight = document.documentElement.clientHeight;
  },
  methods: {
    login() {
      Indicator.open();
      let vm = this;
      if (!vm.username || !vm.userPW) {
        Notify({ type: "warning", message: "账号密码不能为空" });
        return;
      }
      let params = {
        adminUserID: vm.username,
        password: vm.userPW
      };
      http.post(api.Login, params, this).then(resp => {
        Indicator.close();
        if (resp.data.success) {
          Notify({ type: "success", message: "登录成功" });
          window.localStorage.setItem("token", resp.data.data.token);
          window.localStorage.setItem("username", vm.username);
          window.localStorage.setItem("password", vm.userPW);
          this.$router.push({
            path: "/enterpriseMap"
          });
        } else {
          Notify({ type: "danger", message: resp.data.message });
        }
      });
    },
    register() {
      let vm = this;
      if (!vm.adminUserID || !vm.password || !vm.confirmPassword) {
        Notify({ type: "warning", message: "账号密码不能为空" });
        return;
      }
      let params = {
        adminUserID: vm.adminUserID,
        password: vm.password,
        confirmPassword: vm.confirmPassword
      };
      http.post(api.REGISTERED, params, this).then(resp => {
        if (resp.data.success) {
          Notify({ type: "success", message: "注册成功" });
          vm.adminUserID = "";
          vm.password = "";
          vm.confirmPassword = "";
          vm.isLogin = true;
        } else {
          Notify({ type: "danger", message: resp.data.message });
        }
      });
    },
    blur() {
      blur();
    }
  }
};
</script>
<style lang="less" scoped>
.login-content {
  height: 100%;
  background: url("../../assets/image/login-bg.png");
  background-size: 100% 100%;
  position: relative;
  overflow: hidden;
  .logo-top {
    width: 320px;
    height: 306px;
    background: url("../../assets/image/nantong-bg.png") no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
    background-position: 0px 15px;
  }
  .top-title {
    width: 34px;
    height: 152px;
    background: url("../../assets/image/top-title.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    left: 240px;
    top: 60px;
  }
  .top-title2 {
    width: 18px;
    height: 101px;
    background: url("../../assets/image/top-title2.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    left: 300px;
    top: 30px;
  }
  .login-box {
    margin-top: 5px;
    .input {
      margin: 20px auto;
      width: 230px;
      height: 40px;
      position: relative;
      .user-icon,
      .pw-icon {
        width: 14px;
        height: 14px;
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
      }
      .user-icon {
        background: url("../../assets/image/username.png") no-repeat;
        background-size: 100% 100%;
      }
      .pw-icon {
        background: url("../../assets/image/password.png") no-repeat;
        background-size: 100% 100%;
      }
      input {
        padding-left: 30px;
        display: block;
        width: 230px;
        height: 40px;
        border-radius: 20px;
        border: 1px solid #e2e8f0;
      }
      input:focus {
        outline: none;
        border: 1px solid #975b16;
      }
    }
    .switch-button {
      width: 230px;
      height: 30px;
      margin: 0 auto;
      span {
        float: right;
        font-size: 12px;
        color: #975b16;
        margin-right: 20px;
      }
    }
    .login-button,
    .register-button {
      width: 230px;
      height: 40px;
      border-radius: 20px;
      background-color: #975b16;
      color: #fff;
      margin: 0 auto;
      text-align: center;
      line-height: 40px;
      font-size: 14px;
      letter-spacing: 10px;
      text-indent: 10px;
    }
  }
  .bottom-logo {
    width: 160px;
    height: 18px;
    background: url("../../assets/image/bottom-logo.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    left: 50%;
    bottom: 40px;
    transform: translateX(-50%);
  }
  .bottom-title {
    position: absolute;
    left: 0;
    bottom: 10px;
    width: 100%;
    text-align: center;
    font-size: 12px;
  }
}
</style>
