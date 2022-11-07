// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'charvii-cloud-2g52wp3h8e63445d' }) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    // console.log(context);
    const wxContext = cloud.getWXContext()
    let openid = wxContext.OPENID
    // const db = wx.cloud.database()
    let result = await db.collection('user_account').doc(openid).get()
        .then(res => {
            return {
                openid, 
                status: true,
                massage: res.errMsg
            }
        }).catch(err => {
            return {
                openid, 
                status: false,
                massage: err.errMsg
            }
        })
    return result
    // return a
    // {
    //     fail: (err) => {
    //         return {
    //             massage: err,
    //             status: false
    //         }
    //     },
    //     success: (res) => {
    //         return {
    //             massage: res,
    //             status: true
    //         }
    //     }

    // }
    // return {
    //     event,
    //     openid: wxContext.OPENID,
    //     appid: wxContext.APPID,
    //     unionid: wxContext.UNIONID,
    // }
}