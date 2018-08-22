//index.js

import { login } from "../../utils/httpUtils"

const app = getApp();
let self = undefined;
Page({
    data: {
    },
    onLoad: function () {
        self = this;
    },

    auth: function (e) {
        console.log(app.globalData.userInfo);
        if (e.detail.userInfo) {
            login().then( (res)=>{
                console.log(res);// 打印结果
                if (res.code) {
                    // 接口错误
                    return
                }
                // 跳转回上一个页面
                wx.navigateBack()
            }).catch( (errMsg)=>{
                console.log(errMsg);// 错误提示信息
            });
        }
    },

});
