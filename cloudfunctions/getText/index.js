// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: 'charvii-cloud-2g52wp3h8e63445d' }) // 使用当前云环境

const reason = `
事情的起因是朋友抖音@了我两个C语言画爱心的视频，恍惚间仿佛回到了大学。
时过境迁，我已经记不清C语言的语法了，但我仍有兴趣做个无聊的东西。
于是我在微信上挂载了这个小程序，如果你也无聊，不妨来看看，这其实没那么无聊。`

const notice = `任何问题或想法请联系我，最后祝您开心每一天`

// 云函数入口函数
exports.main = async (event, context) => {
    // const wxContext = cloud.getWXContext()
    let type = event.type
    let result = {
        text: ''
    }
    if (type === "reason") {
        result.text = reason
    } else if (type === "contact-notice") {
        result.text = notice
    }
    return result
}