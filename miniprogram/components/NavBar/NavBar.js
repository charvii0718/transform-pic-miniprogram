// components/NavBar.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        navName: ''
    },

    /**
     * 组件的初始数据
     */
    data: {
        navHeight: 0,
        statusBarHeight: 0,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        getNavInfo() {
            //获取菜单按钮的布局位置信息
            let menuButtonObject = wx.getMenuButtonBoundingClientRect();
            //获取系统信息
            let a = wx.getSystemInfo({
                success: res => {
                    let statusBarHeight = res.statusBarHeight;
                    let navHeight = menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2;
                    // (menuButtonObject.top - statusBarHeight) 可以理解为 menuButton 的上下外边距
                    
                    this.setData({
                        navHeight,
                        statusBarHeight,
                    })
                    console.log(this.data.navHeight,this.data.statusBarHeight,"你好a");
                },
                fail(err) {
                    console.log(err);
                }
            });
        },
    },
    lifetimes: {
        attached: function () {
            this.getNavInfo()
        }
    }
})
