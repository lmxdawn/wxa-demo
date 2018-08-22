import { API_BASE_URL, ENV_VERSION, USER_ID_KEY, TOKEN_KEY, FROM } from "../config/env"

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
                    reject(res.data)
                } else {
                    if (res.data.code === 20006) {
                        login().then( (res)=>{
                            resolve(res)
                        }).catch( (errMsg)=>{
                            reject(errMsg);
                        })
                    }
                    resolve(res.data)
                }
            },
            fail: function (res) {
                reject("not data");
            }
        });
    });
}

const login = function () {
    try {
        wx.removeStorageSync(USER_ID_KEY)
        wx.removeStorageSync(TOKEN_KEY)
    } catch (e) {}
    return new Promise((resolve, reject) => {
        wx.login({
            success: res => {
                let code = res.code;
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                wx.getUserInfo({
                    withCredentials: true,
                    success: res => {
                        let userInfo = res.userInfo;
                        let name = userInfo.nickName;
                        let avatar = userInfo.avatarUrl;
                        let sex = userInfo.gender;
                        let data = {
                            code: code,
                            encryptedData: res.encryptedData,
                            iv: res.iv,
                            name: name,
                            avatar: avatar,
                            sex: sex,
                            from: FROM,
                        };
                        request("/api/user/login/byWeChatApplet", "POST", data).then( (res)=>{
                            if (!res.code) {
                                try {
                                    wx.setStorageSync(USER_ID_KEY, res.user_id);
                                    wx.setStorageSync(TOKEN_KEY, res.token)
                                } catch (e) {
                                    reject(JSON.stringify(e));
                                }
                            }
                            resolve(res)
                        }).catch( (errMsg)=>{
                            reject(errMsg)
                        });
                    },
                    fail: function (res) {
                        console.log(res);

                        if (res.errMsg && res.errMsg.startsWith("getUserInfo:fail") && res.errMsg.search("unauthorized") != -1) {
                            // 跳转授权页面
                            wx.navigateTo({
                                url: '/pages/auth/auth'
                            })
                            return;
                        }
                        wx.getSetting({
                            success: (res) => {
                                if (!res.authSetting["scope.userInfo"]) {
                                    // 跳转授权页面
                                    wx.navigateTo({
                                        url: '/pages/auth/auth'
                                    })
                                }
                            }
                        });
                    }
                })
            }
        })
    });
};

module.exports = {
    request,
    login,
};