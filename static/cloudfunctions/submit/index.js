const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
// 云函数入口函数
exports.main = async (event, context) => {
  const { ENV, OPENID, APPID } = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command
  let list = event.list
  // list.forEach(res => {
  //   res.openid = OPENID
  // })
  await db.collection('total').doc('total')
    .update({
      data: {
        list: _.push(list),
      }
    })
  return {code:0,msg:'成功'}
}
