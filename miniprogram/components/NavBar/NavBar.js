// components/NavBar.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        navName: {
            type: String,
            value: ""
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        navHeight: 0,
        statusBarHeight: 0,
        height: 100
    },

    /**
     * 组件的方法列表
     */
    methods: {
      havefun() {
        wx.showToast({
          title: '似乎你也无聊，祝您开心每一天^_^',
          icon: "none",
          duration: 2000
        })
      },
        getNavInfo() {
            //获取菜单按钮的布局位置信息
            let menuButtonObject = wx.getMenuButtonBoundingClientRect();
            //获取手机状态栏高度
            wx.getSystemInfo({
                success:res=> {
                    let statusBarHeight = res.statusBarHeight
                    // (menuButtonObject.top - statusBarHeight) 可以理解为 menuButton 的上下外边距
                    let navHeight = menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2;
                    this.setData({
                        navHeight,
                        statusBarHeight,
                    })
                }
            })
        },
    },
    lifetimes: {
        attached: function () {
            this.getNavInfo()
        }
    }
})
