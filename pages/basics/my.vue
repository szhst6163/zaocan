<template>
	<view class="body">
    <view class="list">
      <view class="list-cont">
        <view class="title">
          <view>{{time}}</view>
          <view class="green" @tap="call">{{detail.store}}</view>
        </view>
        <view class="list-card">
          <view class="card-item" v-for="item in totalData">
            <view class="card-item-2">
              <view class="bold">{{item.name}} {{item.isHot?`(${item.isHot})`:''}}</view>
              <view class="users">
                <view class="user" v-for="user in item.users ">
                  <view class="img"><image :src="user.img"></image></view>
                  <view class="text">{{user.userName}}</view>
                </view>
              </view>
            </view>
            <view class="bold">*{{item.num}}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="btns">
      <button class="btn" @tap="copy">复制订单</button>
      <button class="btn" @tap="submit" type="primary">创建新订单</button>
    </view>
    <uni-dialog title="请选择" ref="popup" @clickHandle="submitDialog" :btns="dialogOpts.btns">
      <view class="textArea-cont">
        <view class="desc">
          <text>请选择</text>
        </view>
        <view>
          <radio-group class="radiosGroup" @change="radioChange">
            <label v-for="item in dialogOpts.opts" class="radio"><radio name="storeId" :value="item.id" />{{item.name}}</label>
          </radio-group>
        </view>
      </view>
    </uni-dialog>
  </view>
</template>

<script>

  import formatDate from "../../lib/formatDate";
  import UniDialog from "../compoments/uni-dialog/index";

  export default {
    components: {
      UniDialog
    },
    data() {
      return {
        isLock: false,
        totalData: [],
        dialogData: {
          storeId:''
        },
        dialogOpts: {
          btns: [{text:'取消',type:'cancel'},{text:'确定',type:'OK'}],
          opts: []
        },
        detail: {}
      };
    },
    computed: {
      time() {
        return formatDate(this.detail.time)
      }
    },
    mounted() {
      this.init()
      this.initStore()
    },
    methods: {
      onTabItemTap() {
        uni.pageScrollTo({scrollTop: 0, duration: 100})
          .then(()=>{
            uni.startPullDownRefresh()
          })
      },
      onPullDownRefresh() {
        if(this.isLock) return
        this.totalData = []
        this.init()
      },
      copy() {
        let str = ''
        this.totalData.forEach(res => {
          str += `${res.name}${res.isHot?`(${res.isHot})`:''}*${res.num};\n`
        })
        uni.setClipboardData({
          data: str
        });
      },
      radioChange(e) {
        this.dialogData.storeId = e.detail.value
      },
      initStore() {
        uni.showLoading({
          title: '加载中...',
          mask: true
        });
        wx.cloud.callFunction({
          name: 'getAllList'
        })
          .then(res => {
            uni.hideLoading()
            this.dialogOpts.opts = res.result.data
          })
          .catch(err => {
            uni.hideLoading()
            console.error('[云函数] [getList] 调用失败', err)
          })
      },
      submitDialog(e) {
        if (e.type === 'OK') {
          if (!this.dialogData.storeId) {
            uni.showToast({
              title: '请选择',
              duration: 1500,
              icon: 'none'
            })
            return
          }
          uni.showLoading({mask: true});
          wx.cloud.callFunction({
            name: 'createNewOrder',
            data: {
              storeId: this.dialogData.storeId*1
            }
          })
            .then(res => {
              uni.hideLoading()
              uni.showToast({
                title: '成功',
                duration: 1500
              })
              this.$refs.popup.close()
              this.init()
            })
            .catch(err => {
              uni.hideLoading()
              console.error('[云函数] [getTotal] 调用失败', err)
            })
        } else {
          this.$refs.popup.close()
        }
      },
      call(){
        uni.makePhoneCall({
          phoneNumber: this.detail.tel
        });
      },
      init() {
        if(this.isLock) return
        this.isLock = true
        uni.showLoading({
          title: '加载中...',
          mask: true
        });

        wx.cloud.callFunction({
          name: 'getTotal',
          data: {},
          success: res => {
            console.log(res)
            this.isLock = false
						uni.hideLoading()
            uni.stopPullDownRefresh()
            this.totalData = res.result.data.total
            this.detail = res.result.data
          },
          fail: err => {
            this.isLock = false
						uni.hideLoading()
            uni.stopPullDownRefresh()
            console.error('[云函数] [getTotal] 调用失败', err)
          }
        })
      },
      submit() {
        this.$refs.popup.open()
      },
      TabSelect(e) {
        this.tabCur = e.currentTarget.dataset.id;
        this.list = this.listData[this.tabCur]
      },
      VerticalMain(e) {
      }
    },
  }
</script>

<style lang="scss" scoped>
  .body{
    .bold{
      font-weight: 600;
      font-size: 28upx;
      color: #14c197;
    }
    .list-cont{
      background: #fff;
      .title{
        padding:20upx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom:2upx solid #eaeaea;
        height: 80upx;
        .green{
          color:#1cbbb4;
        }
      }
      .list-card{
        padding:0 20upx;
        .card-item{
          line-height: 60upx;
          justify-content: space-between;
          align-items: center;
          display: flex;
          margin:20upx 0;
          border-bottom:2upx solid #eaeaea;
          .card-item-2{
            .users{
              display: flex;
              flex-wrap: wrap;
              .user{
                width: 50upx;
                margin:0 10upx;
                font-size: 16upx;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                .img{
                  width: 50upx;
                  height: 50upx;
                  .text{
                    overflow:hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                  }
                  image{
                    width: 100%;
                    height: 100%;
                    border-radius: 100%;

                  }
                }
              }

            }
          }
        }
      }
    }
    .btns{
      padding:40upx;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .btn{
        margin:0 20upx;
      }
    }
  }
  .radiosGroup{
    padding:0 20upx;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    .radio{
      flex:1;
      min-width: 33;
      margin: 10upx;
      display: inline-block;

    }
  }
</style>
