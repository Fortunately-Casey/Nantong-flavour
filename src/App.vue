/* eslint-disable no-irregular-whitespace */
<template>
  <div id="app">
      <router-view />
  </div>
</template>

<style>
body,
html {
  width: 100%;
  height: 100%;
}
#app {
  font-family: "FZSong", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
::-webkit-scrollbar {
  width: 0px !important;
  height: 10px;
}
input {
  border: none;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 0;
  font-size: 14px;
  -webkit-appearance: none;
}
textarea {
  background-color: rgba(255, 255, 255, 0.8);
}
.van-index-bar .van-index-anchor {
  color: #728096 !important;
  font-size: 16px;
}
.van-index-bar .van-cell .van-cell__title span {
  font-family: "FZSong" !important;
  font-size: 18px;
}
.van-index-bar__index {
  color: #728096;
}
.van-index-bar__index {
  font-size: 14px !important;
}
.van-index-bar__index--active {
  color: #975b16 !important;
}
.van-index-bar__sidebar {
  right: 5px !important;
}
.van-action-sheet__header {
  font-family: "FZSong" !important;
}

.van-toast__text {
  font-family: "FZSong" !important;
}
input[type="text"]:focus {
  outline: none;
}
</style>
