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
            <view>{{item.name}} {{item.isHot?`(${item.isHot})`:''}}</view>
            <view>{{item.num}}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="btns">
      <button class="btn" @tap="copy">复制订单</button>
      <button class="btn" @tap="submit" type="primary">创建新订单</button>
    </view>
    <uni-dialog title="选择餐厅" ref="popup" @clickHandle="submitDialog" :btns="dialogOpts.btns">
      <view class="textArea-cont">
        <view class="desc">
          <text>选择餐厅</text>
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
        if (!this.dialogData.storeId) {
          uni.showToast({
            title: '请选择餐厅',
            duration: 1500,
            icon: 'none'
          })
          return
        }
        if (e.type === 'OK') {
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
        uni.showLoading({
          title: '加载中...',
          mask: true
        });

        wx.cloud.callFunction({
          name: 'getTotal',
          data: {},
          success: res => {
						uni.hideLoading()
            this.totalData = res.result.data.total
            this.detail = res.result.data
          },
          fail: err => {
						uni.hideLoading()
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
        padding:20upx;
        .card-item{
          line-height: 60upx;
          justify-content: space-between;
          align-items: center;
          display: flex;
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
    padding:20upx;
    .radio{
      margin: 10upx;
      width: 30%;
      display: inline-block;

    }
  }
</style>
