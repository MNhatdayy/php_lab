import axios from "axios";

// axios.defaults.baseURL = "http://localhost/php/php_lab/api";
axios.defaults.baseURL = "http://localhost:82/php_lab/api";
axios.defaults.headers.post["Content-Type"] = "application/json";

export const getAuthToken = () => {
  return window.sessionStorage.getItem("token");
};

export const setAuthToken = (data) => {
  window.sessionStorage.setItem("token", data);
};

export const request = (method, url, data) => {
  let headers = {};
  if (getAuthToken() !== null && getAuthToken() !== "null") {
    headers = {
      Authorization: `Bearer ${getAuthToken()}`,
    };
  }

  return axios({
    method: method,
    headers: headers,
    url: url,
    data: data,
  });
};
