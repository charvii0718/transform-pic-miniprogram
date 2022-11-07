Page({
    data: {
        avatarUrl: "",
        nickname: "",
        openid: '',
        showDialog: false,
        showButton: false,
        reasonText: '',
        dialogHeight: "fit-content"
    },
    onLoad: function (options) {
        // console.log(+new Date());
        this.login()
        this.getDialogHeight()
        this.getText()
    },
    getDialogHeight() {
        wx.getSystemInfo({
            success:res=> {
                let height = (res.screenHeight - 100) * 0.6
                this.setData({
                    dialogHeight: `${height}px`
                })
            }
        })
    },
    getText() {
        wx.cloud.callFunction({
            name: "getText",
            data: { type: "reason" },
            success: res => {
                this.setData({
                    reasonText: res.result.text
                })
            }
        })
    },
    async login() {
        wx.showLoading({
            title: '请等待 ●__●',
            mask: true,
            complete: () => {
                this.loginTimer = setTimeout(() => {
                    console.log("我被执行了");
                    wx.hideLoading({
                        success: () => this.loginTimer = null
                    })
                    this.setData({
                        showButton: true
                    })
                }, 30000);
            }
        })
        let { result } = await wx.cloud.callFunction({ name: "login" })
        wx.hideLoading({
            success: () => {
                if (this.loginTimer) {
                    clearTimeout(this.loginTimer)
                    this.loginTimer = null
                }
            }
        })
        if (result.status) {
            this.navigateToTrans()
        } else {
            this.setData({
                openid: result.openid
            })
        }
    },

    // 用户注册
    userRegister() {
        if (this.data.avatarUrl && this.data.nickname) {
            wx.showLoading({
                title: '请等待 ●__●',
                mask: true,
                complete: () => {
                    this.registerTimer = setTimeout(() => {
                        wx.hideLoading({
                            success: () => this.registerTimer = null
                        }
                        )
                        this.setData({
                            showButton: true
                        })
                    }, 30000);
                }
            })
            // return
            let cloudPath = this.data.avatarUrl.split('//')
            cloudPath = cloudPath[cloudPath.length - 1]

            // 将头像上传至云端
            wx.cloud.uploadFile({
                cloudPath,
                filePath: this.data.avatarUrl,
                success: avatar_res => {
                    let registerTime = Date()
                    wx.cloud.database().collection("user_account").add({
                        data: {
                            _id: this.data.openid,
                            user_avatar: avatar_res.fileID,
                            user_nickName: this.data.nickname,
                            registerTime
                        },
                        success: (res) => {
                            wx.hideLoading({
                                success: () => {
                                    if (this.registerTimer) {
                                        clearTimeout(this.registerTimer)
                                        this.registerTimer = null
                                    }

                                },
                            })
                            this.openDialog()
                        },
                        fail: (err) => {
                            wx.showToast({
                                title: '用户注册异常',
                                icon: 'none'
                            })
                            this.setData({
                                showButton: true
                            })
                            console.log(err, "用户注册异常");
                        },
                    })
                }
            })
        } else {
            wx.showToast({
                title: '未授权头像/昵称',
                icon: 'none',
                duration: 1500,
                mask: true
            })
        }
    },
    // 用户头像更新回调
    onChooseAvatar(e) {
        const { avatarUrl } = e.detail
        this.setData({
            avatarUrl: avatarUrl,
        })
        this.userRegister()
    },
    onNameChange() {
        this.userRegister()
    },
    onDialogClose() {
        console.log("浮窗关闭");
        this.navigateToTrans()
    },
    openDialog() {
        this.setData({
            showDialog: true,
        })
    },
    navigateToTrans() {
        console.log("登录成功");
        wx.switchTab({
            url: '../picTransform/picTransform'
        })
    }
})
