
const common = {
    // 用户登录
    async userLogin() {
        let appid = '';
        let secret = '';

        // 获取小程序相关密钥
        const db = wx.cloud.database()
        await db.collection("app_info").doc('charvii').get().then(res => {
            appid = res.data.appid;
            secret = res.data.secret;
        })

        wx.login().then(res => {
            wx.request({
                url: `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${res.code}&grant_type=authorization_code`,
                success: res => {
                    db.collection('user_account').doc(res.data.openid).get({
                        success: res1 => {

                            console.log(res1, "res1");
                        },
                        fail: err1 => {
                            console.log(err1, "err1");
                            // 未注册用户，绑定头像及其id
                        }
                    })
                }
            })
        })
    }
}

export default common