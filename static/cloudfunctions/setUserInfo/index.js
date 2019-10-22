const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async (event, context) => {
  const { ENV, OPENID, APPID } = cloud.getWXContext()
  try {
    return await db.collection('userList')
      .add({
        data: {
            _id: OPENID,
            ...event.data}
      })
  } catch(e) {
    console.error(e)
  }
}
