Page({
    data: {
        showAuthorize: false,
        avatarUrl: "",
        nickname: ""
    },
    onLoad: function (options) {
        this.userLogin()
    },

    // 用户登录相关逻辑
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
                    let openid = res.data.openid
                    wx.getStorage({
                        key: "openid",
                        encrypt: true,
                        complete: over => {
                            // 在缓存中查询，若缓存中id与当前登录id一致，则执行注册相关逻辑
                            if (!over.data || over.data !== openid) {
                                wx.setStorage({
                                    key: "openid",
                                    data: res.data.openid,
                                    encrypt: true
                                })
                                db.collection('user_account').doc(openid).get({
                                    fail: () => {
                                        this.setData({
                                            showAuthorize: true
                                        })
                                    }
                                })
                            }
                            // wx.clearStorageSync()
                        }
                    })
                }
            })
        })
    },
    // 注册信息填写完毕回调
    onClose() {
        if (this.data.avatarUrl && this.data.nickname) {
            let cloudPath = this.data.avatarUrl.split('/')
            cloudPath = cloudPath[cloudPath.length - 1]
            
            // 将头像上传至云端
            wx.cloud.uploadFile({
                cloudPath,
                filePath: this.data.avatarUrl,
                success: avatar_res => {
                    wx.getStorage({
                        key: "openid",
                        encrypt: true,
                    }).then(res => {
                        console.log(22222);
                        wx.cloud.database().collection("user_account").add({
                            data: {
                                _id: res.data,
                                user_avatar: avatar_res.fileID,
                                user_nickName: this.data.nickname
                            }
                        })
                    })
                }
            })
            this.setData({
                showAuthorize: false
            })
            console.log(11111);
        } else {
            wx.showToast({
                title: '请授权头像及昵称',
                icon: 'none',
                duration: 1500
            })
        }
    },
    // 用户头像更新回调
    onChooseAvatar(e) {
        const { avatarUrl } = e.detail
        this.setData({
            avatarUrl: avatarUrl,
        })
    },
})
