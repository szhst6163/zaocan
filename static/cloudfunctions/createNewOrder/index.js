const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
// 云函数入口函数
exports.main = async (event, context) => {
  const { ENV, OPENID, APPID } = cloud.getWXContext()
  await cloud.database().collection('total').doc('total')
    .update({
      data: {
        list: [],
        date: new Date().getTime()
      }
    })
  await cloud.database().collection('storeFocus').where({name:"focus"})
    .update({
      data: {
        id: event.storeId
      }
    })
  return {code:0,msg:'成功'}
}
