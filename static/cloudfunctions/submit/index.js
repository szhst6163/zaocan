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
  let userInfo = await cloud.database().collection('userList').doc(OPENID).get()
  let list = event.list
  let str1 = ''
  let str2 = 0
  list.forEach(res => {
    res.openid = OPENID
    res.headImg = userInfo.data.avatarUrl
    res.userName = userInfo.data.nickName
    str1 += `${res.name}${res.isHot?`(${res.isHot})`:''}*${res.num};\n`
    str2 += res.price*1
  })
  await db.collection('total').doc('total')
    .update({
      data: {
        list: _.push(list),
      }
    })
  await cloud.callFunction({
    // 要调用的云函数名称
    name: 'wxmessage',
    // 传递给云函数的参数
    data: {
      formId:event.formId,
      openId: OPENID,
      data:{
        keyword1:{
          value: str1
        },
        keyword2:{
          value:str2 + '元'
        }
      }

    }
  })
  return {code:0,msg:'成功'}
}
