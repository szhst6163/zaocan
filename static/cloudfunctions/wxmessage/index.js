const cloud = require('wx-server-sdk')
const tid = 'heSl5LrIQZG1Ve_pAYzbeuZXwKDJO7mUnhEMg3wjZvw'; // 模板 id，非必填，也可以从小程序端上传
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.templateMessage.send({
      touser: event.openId, // 通过 getWXContext 获取 OPENID
      page: 'index',
      data: event.data,
      templateId: tid,
      formId: event.formId,
      emphasisKeyword: 'keyword1.DATA'
    })
    // result 结构
    // { errCode: 0, errMsg: 'openapi.templateMessage.send:ok' }
    return result
  } catch (err) {
    // 错误处理
    // err.errCode !== 0
    throw err
  }
}
