//index.js
//获取应用实例
import { login } from "../../api/user/userLogin"
import { test } from "../../api/test/test"

const app = getApp();
let self = undefined;
Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
    },
    onLoad: function () {
        self = this;
        test().then( (res)=>{
            console.log(res);// 正确返回结果
            if (res.code === 20006) {
                login().then( (res)=>{
                    if (res.code) {
                        // 弹框提示，登录失效
                        return;
                    }
                    // 登录成功后重新请求
                    test()
                }).catch( (errMsg)=>{});
                return
            }
            wx.hideLoading();
        }).catch( (errMsg)=>{
            console.log(errMsg);// 错误提示信息
            wx.hideLoading();
        });
    },

    wxGetUserInfo: function () {
         self.onLoad();
    },

});
