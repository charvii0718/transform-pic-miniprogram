// components/MyButton/MyButton.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        text: {
            type: String,
            value: "按钮"
        },
        openType: {
            type: String,
            value: ""
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        catchtouchmove() {
            return
        }

    },
    lifetimes: {
        attached() {
            console.log(this.data.openType);
        }
    }
})
