Component({
    /**
     * 组件的属性列表
     */
    properties: {
        width: {
            type: Number,
            value: 300
        },
        min: {
            type: Number,
            value: 0
        },
        max: {
            type: Number,
            value: 100
        },
        initValue: {
            type: Number,
            value: 0
        },
        disabled: {
            type:Boolean,
            value: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        sliderWidth: 300,
        firstProgress: 0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        catchtouchmove() {
            return
        },
        sliderChange() {
            wx.createSelectorQuery().in(this).select('.slider-progress-line').boundingClientRect(res => {
                let length = res.width
                let rate = length / this.data.sliderWidth
                // value = min + rate * (max-min)
                let value = Math.floor(this.data.min + rate * (this.data.max - this.data.min))
                this.triggerEvent('sliderchange',{value})
            }).exec()

        },
        initSlider() {
            wx.getSystemInfo({
                success: (res) => {
                    // rate = (initValue - min) / (max -min)
                    let rate = (this.data.initValue - (this.data.min)) / (this.data.max - this.data.min)
                    // sliderWidth = rWidht / 750 * screenWidth
                    let sliderWidth = this.data.width / 750 * res.screenWidth
                    // length = rate * sliderWidth
                    let length = rate * sliderWidth
                    this.setData({
                        sliderWidth,
                        firstProgress: length
                    })

                },
            })
        }
    },
    lifetimes: {
        attached() {
            this.initSlider()
        }
    }
})
