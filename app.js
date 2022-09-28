// app.js
App({
    onLaunch: function () {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                env: 'charvii-cloud-2g52wp3h8e63445d',
                traceUser: true
            })
        }
    },
})