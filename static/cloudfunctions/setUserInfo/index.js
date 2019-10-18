const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  const { ENV, OPENID, APPID } = cloud.getWXContext()
  try {
    return await db.collection('userList').where({
      name: "userInfo"
    })
      .update({
        data: {
          userInfo:  _.push({...event.data,openId:OPENID})
        },
      })
  } catch(e) {
    console.error(e)
  }
}
