import { API_BASE_URL, ENV_VERSION, USER_ID_KEY, TOKEN_KEY } from "../config/env"
const request = function (path, method, data, header) {
    let user_id = "";
    let token = "";
    try {
        user_id = wx.getStorageSync(USER_ID_KEY);
        token = wx.getStorageSync(TOKEN_KEY);
    } catch (e) {}
    header = header || {};
    let cookie = [];
    cookie.push("USERID=" + user_id);
    cookie.push("TOKEN=" + token);
    cookie.push("device=" + 1);
    cookie.push("app_name=" + 1);
    cookie.push("app_version=" + ENV_VERSION);
    cookie.push("channel=" + 1);
    header.cookie = cookie.join("; ");
    return new Promise((resolve, reject) => {
        wx.request({//后台请求
            url: API_BASE_URL + path,
            header: header,
            method: method,
            data: data,
            success: function (res) {
                if (res.statusCode !== 200) {
                    reject("网络繁忙，请稍后~")
                } else {
                    resolve(res.data)
                }
            },
            fail: function (res) {
                reject("not data");
            }
        });
    });
};

module.exports = {
    request,
};