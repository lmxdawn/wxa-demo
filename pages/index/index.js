//index.js

import { userInfo } from "../../api/user/user"

const app = getApp();
let self = undefined;
Page({
    data: {
        userInfo: {},
        isShow: false
    },
    onLoad: function () {
        self = this;
    },

    getUserInfo: function () {
        console.log(app.globalData.userInfo);
        self.setData({
            isShow: !self.data.isShow
        });
        if (app.globalData.userInfo) {
            self.setData({
                userInfo: app.globalData.userInfo
            })
            return
        }
        userInfo().then( (res)=>{
            console.log(res, 111111);// 打印结果
            // 接口错误
            if (res.code) {
                return
            }
            self.setData({
                userInfo: res
            })
        }).catch( (errMsg)=>{
            console.log(errMsg, 2222);// 错误提示信息
        });
    },

});
