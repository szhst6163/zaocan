<template>
	<view>
    <button v-if="total" class="btn" @tap="submit" type="primary">提交</button>
  </view>
</template>

<script>

  export default {
    components: {
    },
    data() {
      return {
      };
    },
    computed: {
    },
    mounted() {
      this.init()
    },
    methods: {
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
            console.log(res)
            this.listData = res.result.data.map(res => res.foods)
            this.list = this.listData[0]
            this.tags = res.result.data
          },
          fail: err => {
						uni.hideLoading()
            console.error('[云函数] [getTotal] 调用失败', err)
          }
        })
      },
      radioChange(item, la) {
        this.$nextTick(()=>{
          item.isHot = la
        })
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

<style>
  @import "../../style/index.scss";
	.fixed {
		position: fixed;
		z-index: 99;
	}
  .btn{
    position: fixed;
    bottom:130upx;
    width: 100%;
    height: 98upx;
  }
	.VerticalNav.nav {
		width: 200upx;
		white-space: initial;
	}

	.VerticalNav.nav .cu-item {
		width: 100%;
		text-align: center;
		background-color: #fff;
		margin: 0;
		border: none;
		height: 50px;
		position: relative;
	}

	.VerticalNav.nav .cu-item.cur::after {
		content: "";
		width: 8upx;
		height: 30upx;
		border-radius: 10upx 0 0 10upx;
		position: absolute;
		background-color: currentColor;
		top: 0;
		right: 0upx;
		bottom: 0;
		margin: auto;
	}

	.VerticalBox {
		display: flex;
		padding-bottom:98upx;
		box-sizing: border-box;
	}

	.VerticalNav{
		height: calc(100vh - 250upx);
	}
	.VerticalMain {
		/*background-color: #f1f1f1;*/
		height: calc(100vh - 250upx);
		flex: 1;
	}
	.radiosGroup{
		width: 200upx;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
</style>
