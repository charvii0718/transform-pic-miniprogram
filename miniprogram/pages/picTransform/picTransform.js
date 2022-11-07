const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pixelText: '',
        isText: false,
        canOprate: true,
        test: '',
        pixelSize: 25,

        canvasHeight: 300,
        originalImage: {
            path: '',
            width: 0,
            height: 0
        },
        zoomRate: 1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // console.log(+new Date());
    },
    havefun() {
        wx.showToast({
            title: 'javascript unknown error: CARZY THUR. V me 50, code:0718',
            icon: "none",
            duration: 2000
        })
    },
    byebye() {
        console.log('byebye');
        wx.exitMiniProgram()
    },
    nofunction() {
        return
    },
    chooseImage() {
        wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            sourceType: ['album', 'camera'],
            maxDuration: 30,
            camera: 'back',
            success: (res) => {
                this.setData({
                    'originalImage.path': res.tempFiles[0].tempFilePath
                })
                wx.nextTick(() => this.drawOffscreenCanvas())
            }
        })
    },
    async drawOffscreenCanvas() {
        if (!this.data.originalImage.path || !this.data.canOprate) return
        this.setData({
            canOprate: false
        })
        let { width, height } = await wx.getImageInfo({ src: this.data.originalImage.path })
        this.setData({
            zoomRate: 600 / width
        })
        this.setData({
            'originalImage.width': width,
            'originalImage.height': height
        })
        // 创建离屏 2D canvas 实例
        const offCanvas = wx.createOffscreenCanvas({ type: '2d', width: width, height: height })
        const context = offCanvas.getContext('2d')

        // 创建一个图片
        const image = offCanvas.createImage()
        await new Promise(resolve => {
            image.onload = resolve
            image.src = this.data.originalImage.path
        })

        context.clearRect(0, 0, width, height)
        context.drawImage(image, 0, 0)

        // 也可转为base64格式,创建image对象渲染
        // this.originalImage = offCanvas.toDataURL("image/jpeg", 1);

        // 保存图片原始canvas数据对象
        let originalImage = context.getImageData(0, 0, width, height)

        let pixelSize = Math.floor(this.data.pixelSize / this.data.zoomRate)
        let pixelData = this.getPixelData(originalImage, pixelSize)
        context.clearRect(0, 0, width, height)
        this.handleOffscreenCanvas(context, pixelData)

        let canvasImageData = context.getImageData(0, 0, width, height)
        wx.nextTick(
            () => { this.renderCanvas(canvasImageData) }
        )
    },
    // 获取单位块颜色信息
    getPixelData(originalImage, pixelSize) {
        let pixelData = []
        for (let i = 0; i * pixelSize < originalImage.height; i++) {
            let lengthY = originalImage.height - pixelSize * i > pixelSize ?
                pixelSize : originalImage.height - pixelSize * i
            let randomValueX = Math.floor(lengthY / 2)
            let randomY = i * pixelSize + randomValueX
            let row = []

            for (let j = 0; j < originalImage.width / pixelSize; j++) {
                let lengthX = originalImage.width - pixelSize * j > pixelSize ?
                    pixelSize : originalImage.width - pixelSize * j
                let randomValueY = Math.floor(lengthX / 2)
                let randomX = j * pixelSize + randomValueY

                // 获取随机点颜色
                let color = this.getPxInfo(randomX, randomY, originalImage)
                row.push({
                    color,
                    x: j * pixelSize,
                    y: i * pixelSize,
                    lengthX,
                    lengthY
                })
            }
            pixelData.push(row)
        }
        for (let i = 0; i < pixelData.length - 1; i++) {
            pixelData[i]
            for (let j = 0; j < pixelData[i].length - 1; j++) {

                let cur = pixelData[i][j].color
                let nextRow = pixelData[i + 1][j].color
                let nextCol = pixelData[i][j + 1].color
                if (Math.abs(cur[0] - nextRow[0]) < 16 && Math.abs(cur[1] - nextRow[1]) < 16 && Math.abs(cur[2] - nextRow[2]) < 16) {
                    nextRow[0] = cur[0]
                    nextRow[1] = cur[1]
                    nextRow[2] = cur[2]
                }
                if (Math.abs(cur[0] - nextCol[0]) < 16 && Math.abs(cur[1] - nextCol[1]) < 16 && Math.abs(cur[2] - nextCol[2]) < 16) {
                    nextCol[0] = cur[0]
                    nextCol[1] = cur[1]
                    nextCol[2] = cur[2]
                }
            }
        }
        return pixelData
    },
    getPxInfo(x, y, imageData) {
        let width = imageData.width
        let color = []

        color[0] = imageData.data[(y * width + x) * 4],
            color[1] = imageData.data[(y * width + x) * 4 + 1],
            color[2] = imageData.data[(y * width + x) * 4 + 2],
            color[3] = imageData.data[(y * width + x) * 4 + 3]
        return color
    },
    // 加工离屏canvas
    handleOffscreenCanvas(context, pixelData) {
        let textArray = this.data.isText ? (this.data.pixelText.length ? this.data.pixelText.split('') : "调侃的侃".split('')) : undefined
        if (textArray) {
            let fontSize = Math.floor(this.data.pixelSize / this.data.zoomRate)
            let fontStyle = `900 ${fontSize}px Arial,Hrial,Helvetic,sans-serf`
            pixelData.forEach((row, rowindex, arr1) => {
                row.forEach((pixel, colindex, arr2) => {
                    let index = ((arr1.length) * rowindex + colindex + 1) % textArray.length
                    this.setPxByText(pixel, textArray[index], fontStyle, fontSize, context)
                });
            })
        } else {
            pixelData.forEach(d => {
                d.forEach(pixel => {
                    let { x, y, lengthX, lengthY, color } = pixel
                    this.setPxByBlock(pixel, context)
                });
            })
        }
    },
    setPxByBlock(pixel, context) {
        context.fillStyle = `rgba(${pixel.color.toString()})`
        context.fillRect(pixel.x, pixel.y, pixel.lengthX, pixel.lengthY)
    },
    setPxByText(pixel, text, fontStyle, fontSize, context) {
        context.fillStyle = `rgba(${pixel.color[0]},${pixel.color[1]},${pixel.color[2]},0.2)`
        context.fillRect(pixel.x, pixel.y, pixel.lengthX, pixel.lengthY)

        context.fillStyle = `rgba(${pixel.color.toString()})`
        context.font = fontStyle; //设置样式   
        context.fillText(text, pixel.x, pixel.y + fontSize)
    },

    renderCanvas(canvasImageData) {
        // 通过 SelectorQuery 获取 Canvas 节点
        wx.createSelectorQuery()
            .select('#canvas')
            .fields({
                node: true,
                size: true,
            })
            .exec(res => {
                const canvas = res[0].node
                const ctx = canvas.getContext('2d')
                this.setData({
                    canvasHeight: this.data.originalImage.height * this.data.zoomRate
                })
                wx.nextTick(() => {
                    canvas.width = this.data.originalImage.width
                    canvas.height = this.data.originalImage.height
                    ctx.putImageData(canvasImageData, 0, 0)
                    this.setData({
                        canOprate: true
                    })
                })


            })
    },
    downloadCanvasImage() {
        // 当画布处于非渲染状态，才可执行保存相关逻辑
        if (this.data.canOprate) {

            // 无图片时告警用户
            if (this.data.originalImage.path) {
                wx.createSelectorQuery()
                    .select('#canvas')
                    .fields({
                        node: true,
                        size: true,
                    })
                    .exec(res => {
                        let canvas = res[0].node
                        // todo 这里的传参需要优化 目前导出的的图片是有问题的
                        wx.canvasToTempFilePath({
                            x: 0,
                            Y: 0,
                            width: this.data.originalImage.width,
                            height: this.data.originalImage.height,
                            destWidth: this.data.originalImage.width,
                            destHeight: this.data.originalImage.height,
                            canvasId: 'canvas',
                            canvas: canvas,
                            success: this.downloadImg
                        })
                    })
            } else {
                wx.showToast({
                    title: '画布中啥都没有呢﹒︠ᴗ﹒︡',
                    icon: "none",
                    mask: true,
                    duration: 1500
                })
            }
        }

    },
    downloadImg(res) {
        wx.showLoading({
            title: '加载中...'
        });
        //wx.saveImageToPhotosAlbum方法：保存图片到系统相册
        wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath, //图片文件路径
            success: function (data) {
                wx.hideLoading(); //隐藏 loading 提示框
                wx.showToast({
                    title: '保存成功',
                    icon: 'success'
                })
            },
            // 接口调用失败的回调函数
            fail: function (err) {
                if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
                    wx.showModal({
                        title: '提示',
                        content: '需要您授权保存相册',
                        modalType: false,
                        success: modalSuccess => {
                            wx.openSetting({
                                success(settingdata) {
                                    console.log("settingdata", settingdata)
                                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                                        wx.showModal({
                                            title: '提示',
                                            content: '获取权限成功,再次点击图片即可保存',
                                            modalType: false,
                                        })
                                    } else {
                                        wx.showModal({
                                            title: '提示',
                                            content: '获取权限失败，将无法保存到相册哦~',
                                            modalType: false,
                                        })
                                    }
                                },
                                fail(failData) {
                                    console.log("failData", failData)
                                },
                                complete(finishData) {
                                    console.log("finishData", finishData)
                                }
                            })
                        }
                    })
                }
            },
            complete(res) {
                wx.hideLoading(); //隐藏 loading 提示框
            }
        })
    },
    pixelSizeChange(event) {
        console.log(event.detail.value);
        if (event.detail.value === this.data.value) {
            return
        }
        this.setData({
            pixelSize: event.detail.value
        })
        this.drawOffscreenCanvas()
    },
    pixelTextChange(event) {
        if (this.lastText === this.data.pixelText) {
            return
        }
        this.lastText = this.data.pixelText
        this.drawOffscreenCanvas()
    },
    toggleModel(event) {
        if (!this.data.canOprate) return
        if (this.data.isText !== event.currentTarget.dataset.istext) {
            this.setData({
                isText: !this.data.isText
            })
            this.drawOffscreenCanvas()
        }
    },
})