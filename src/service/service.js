/* eslint-disable no-console */
import axios from "axios";
import { getURL } from "@/common/tool/tool";

let http = {};
http.post = function(apiUrl, params, vue) {
  let token = window.localStorage.getItem("token");
  const url = getURL(apiUrl);
  return axios
    .post(url, params, {
      headers: {
        token: token
      }
    })
    .then(resp => {
      if (resp.data.errorCode == "03009") {
        vue.$router.push({
          path: "/login"
        });
        return;
      }
      return Promise.resolve(resp);
    })
    .catch(err => {
      console.log(err);
    });
};

http.upload = function(apiUrl, params, vue) {
  let token = window.localStorage.getItem("token");
  const url = getURL(apiUrl);
  return axios
    .post(url, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        token: token
      }
    })
    .then(resp => {
      if (resp.data.errorCode == "03009") {
        vue.$router.push({
          path: "/login"
        });
        return;
      }
      return Promise.resolve(resp);
    })
    .catch(err => {
      console.log(err);
    });
};

http.get = function(apiUrl, params, vue) {
  let token = window.localStorage.getItem("token");
  const url = getURL(apiUrl);
  return axios
    .get(url, {
      params: params,
      headers: {
        token: token
      }
    })
    .then(resp => {
      console.log();
      if (resp.data.errorCode == "03009") {
        vue.$router.push({
          path: "/login"
        });
        return;
      }
      return Promise.resolve(resp);
    })
    .catch(err => {
      console.log(err);
    });
};

http.delete = function(apiUrl, params, vue) {
  let token = window.localStorage.getItem("token");
  const url = getURL(apiUrl);
  return axios
    .delete(url, {
      params: params,
      headers: {
        token: token
      }
    })
    .then(resp => {
      if (resp.data.errorCode == "03009") {
        vue.$router.push({
          path: "/login"
        });
        return;
      }
      return Promise.resolve(resp);
    })
    .catch(err => {
      console.log(err);
    });
};

export default http;
