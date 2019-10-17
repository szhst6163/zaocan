<template>
  <uni-popup ref="popup" :maskClick="false" custom type="center">
    <view class="dialog-cont">
      <view class="title">{{title}}</view>
      <view class="body">
        <view v-if="dialogText" class="info" v-html="dialogText"></view>
        <slot></slot>
      </view>
      <view class="footer">
        <view class="btns">
          <view v-for="(item, i) in btns" :key="i" :class="{okbtn:item.type === 'OK'}" @tap="clickHandle(item)">{{item.text}}</view>
        </view>
      </view>
    </view>
  </uni-popup>
</template>

<script>
  import {uniPopup} from '@dcloudio/uni-ui'

  export default {
    name: "uni-dialog",
    props: {
      btns:{
        type:Array,
        default:[{text:'取消'},{text:'确定',type:'OK'}]
      },
      title:{
        type:String,
        default:''
      },
      dialogText:{
        type:String,
        default:''
      }
    },
    components: {
      uniPopup
    },
    data() {
      return {
        paramsData: {}
      }
    },
    methods: {
      clickHandle(item) {
        if(item.type){
          this.$emit('clickHandle',{type:item.type, data:this.paramsData})
        }else {
          this.close()
        }
      },
      open() {
        this.$refs.popup.open()
      },
      close() {
        this.$refs.popup.close()
      }
    },
  }
</script>

<style lang="scss">
  .dialog-cont {
    color: #333333;
    border-radius: 8upx;
    background: #fff;
    padding-top:42upx;
    .title {
      text-align: center;
      font-size: 34upx;
      margin-bottom: 20upx;
    }
    .body {
      box-sizing: border-box;
      padding:0 34upx;
      min-width: 80vw;
      .info{
        text-align: center;
        padding:37upx 0 79upx;
      }
    }
    .footer{
      font-size: $uni-font-size-lg;
      line-height: 85upx;
      .btns{
        display: flex;
        align-items: center;
        border-top:2upx solid #eaeaea;
        color:#aaa;
        .okbtn{
          color: #16ac31;
        }
        >view{
          flex:1;
          text-align: center;
          border-right:2upx solid #eaeaea;
          &:last-child{
            border:none;
          }
        }
      }
    }

  }

</style>
