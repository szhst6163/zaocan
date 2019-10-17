const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
// 云函数入口函数
exports.main = async (event, context) => {
  const { ENV, OPENID, APPID } = cloud.getWXContext()
  const data = await cloud.database().collection('storeFocus').where({name:'focus'}).get()
  const id = data.data[0].id
  let menuT = await cloud.database().collection('menu').where({id}).get()
  let totalListT = await cloud.database().collection('total').get()
  let list = totalListT.data[0].list
  let menu = menuT.data[0].foods
  menu.forEach(res => {
    if(res.isHot){
      let obj = Object.assign({},res)
      obj.isHot = "不辣"
      menu.push(obj)
    }
  })
  list.forEach(res => {
    let d  = menu.filter(r => r.isHot === res.isHot && r.id === res.id)[0]
    if(d)d.num += res.num
  })
  return {
    data:{
      total:menu.filter(res => res.num),
      time:totalListT.data[0].date,
      store:menuT.data[0].name,
      tel:menuT.data[0].tel
    }
  }
}
