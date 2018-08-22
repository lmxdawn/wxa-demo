//app.js

import { userInfo } from "./api/user/user"

let appSelf = undefined;

App({
    onLaunch: function () {
        appSelf = this;
        // 应用程序第一次进入，获取用户信息，不做任何错误处理
        userInfo().then( (res)=>{
            console.log(res);// 打印结果
            if (!res.code) {
                appSelf.globalData.userInfo = res
            }
        }).catch( (errMsg)=>{
            console.log(errMsg);// 错误提示信息
        });

    },

    /*基础配置加载、弹框等*/
    globalData: {
        userInfo: null
    }
});