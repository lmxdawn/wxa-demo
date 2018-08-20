import { request } from "../../utils/httpUtils"
import { showModal } from "../../utils/util"
import { USER_ID_KEY, TOKEN_KEY, FROM } from "../../config/env"
const login = function () {
    try {
        wx.removeStorageSync(USER_ID_KEY);
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
                        request("/api/user_login/byWeChatApplet", "POST", data).then( (res)=>{
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
                        if (res.errMsg && res.errMsg.startsWith("getUserInfo:fail") && res.errMsg.search("unauthorized") !== -1) {
                            reject("getUserInfo:fail");
                            return;
                        }
                        wx.getSetting({
                            success: (res) => {
                                if (!res.authSetting["scope.userInfo"]) {//没授权
                                    showModal('提示', '需要获取用户的权限,点击确定前往设置,打开用户信息', true, function (res) {
                                        wx.openSetting({
                                            success: (res) => {
                                                // 用户返回 不管是否开启 接着去重新登录
                                                login().then( (res)=>{
                                                    if (res.code) {
                                                        reject(res.message);
                                                        return
                                                    }
                                                    try {
                                                        wx.setStorageSync(USER_ID_KEY, res.user_id);
                                                        wx.setStorageSync(TOKEN_KEY, res.token)
                                                    } catch (e) {
                                                        reject(JSON.stringify(e));
                                                    }
                                                    resolve(res)
                                                }).catch( (errMsg)=>{
                                                    reject(errMsg)
                                                });
                                            }
                                        })
                                    }, function () {})
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
    login,
};