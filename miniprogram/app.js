// app.js
App({
    async onLaunch() {
        this.checkCloud()
    },
    checkCloud() {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            // 小程序-云环境初始化
            wx.cloud.init({
                env: 'charvii-cloud-2g52wp3h8e63445d',
                traceUser: true
            })
            // 云函数-云环境初始化
            // const cloud = require('wx-server-sdk')
            // cloud.init({
            //     env: cloud.DYNAMIC_CURRENT_ENV
            // })
        }
    },
    globalData: {
    }
})