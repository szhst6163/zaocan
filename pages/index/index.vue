<template>
	<view>
		<view class="VerticalBox">
			<scroll-view class="VerticalNav nav" scroll-y scroll-with-animation>
				<view class="cu-item" :class="index==tabCur?'text-green cur':''" v-for="(item,index) in tags" :key="index" @tap="TabSelect" :data-id="index">{{item.name}}</view>
			</scroll-view>
			<scroll-view class="VerticalMain" scroll-y scroll-with-animation>
				<view class="padding-top padding-lr" v-for="(item,index) in list" :key="index" :id="'main-'+index">
					<view class="cu-bar solid-bottom bg-white">
						<view class="action">
							<text class="cuIcon-title text-green"></text>{{item.name}}</view>
					</view>
					<view class="cu-list menu-avatar">
						<view class="cu-item">
							<view>
								<uni-number-box
									class="step"
									:min="0"
									v-model="list[index]['num']"
								></uni-number-box>
							</view>
							<view v-if="item.kouwei">
								<radio-group class="radiosGroup">
									<label @tap="radioChange(item,'辣')" class="radio"><radio name="la" :checked="item.isHot === '辣'" value="辣" />辣</label>
									<label @tap="radioChange(item,'不辣')" class="radio"><radio name="la" :checked="item.isHot === '不辣'" value="不辣" />不辣</label>
								</radio-group>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="cu-modal" :class="{show:showDialog}">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">授权</view>
					<view class="action" @tap="showDialog = false">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					<button open-type="getUserInfo" @getuserinfo="bindGetUserInfo">授权登录</button>
				</view>
			</view>
		</view>
		<form @submit="submit" report-submit="true">
			<button v-if="total" class="btn"  formType="submit" type="primary">提交</button>
		</form>
	</view>
</template>

<script>
  import uniNumberBox from '@/colorui/components/uni-number-box.vue'

  export default {
    components: {
      uniNumberBox
    },
    data() {
      return {
        isLock: false,
        list: [],
        tags:[],
        tabCur: 0,
        listData:[[]],
        showDialog: false
      };
    },
    computed: {
      total() {
        let data = this.listData[0].map(res => res.num)
        let num = 0
        data.forEach(res => {
          num += res
        })
        return num
      }
    },
    mounted() {
      this.onGetOpenid()
      this.init()
			this.getUserInfo()
    },
    methods: {
      bindGetUserInfo(e) {
        if(e.detail.userInfo){
          uni.showLoading({
            title: '授权中...',
            mask: true
          });
          wx.cloud.callFunction({
            name: 'setUserInfo',
            data: {data:e.detail.userInfo},
            success: res => {
              this.showDialog = false
              uni.hideLoading()
              uni.showToast({
                title: '授权成功',
                icon:'none',
                duration: 1500
              })
            },
            fail: err => {
              uni.hideLoading()
              console.error( err)
            }
          })
        } else {
          uni.showToast({
            title: '授权失败',
            icon:'none',
            duration: 1500
          })
				}
      },
      showModal(e) {
        this.showDialog = true
      },
      getUserInfo() {
        uni.getSetting({
					success: res => {
            if (!res.authSetting['scope.userInfo']) {
              this.showModal()
            }
					}
				})
			},
      init() {
        if(this.isLock) return
        this.isLock = true
        uni.showLoading({
          title: '加载中...',
          mask: true
        });
        wx.cloud.callFunction({
          name: 'getList',
          data: {},
          success: res => {
						this.isLock = false
						uni.stopPullDownRefresh()
            uni.hideLoading()
            this.listData = res.result.data.map(res => res.foods)
            this.list = this.listData[0]
            this.tags = res.result.data
          },
          fail: err => {
						this.isLock = false
						uni.stopPullDownRefresh()
            uni.hideLoading()
            console.error('[云函数] [getList] 调用失败', err)
          }
        })
      },
      onGetOpenid() {
        // 调用云函数
        wx.cloud.callFunction({
          name: 'login',
          data: {},
          success: res => {
            console.log('[云函数] [login] user openid: ', res.result.openid)
            wx.globalData.openid = res.result.openid
          },
          fail: err => {
            console.error('[云函数] [login] 调用失败', err)
          }
        })
      },
      submit(e) {
        let data = this.listData[0].filter(res => res.num)
        let str = ''
        data.forEach(res => {
          str += `${res.name}${res.isHot?`(${res.isHot})`:''}*${res.num};\n`
        })
        uni.showModal({
          title: '提示',
          content: `你点了${str}`,
          success:(res) => {
            if (res.confirm) {
              uni.showLoading({mask:true})
              wx.cloud.callFunction({
                name: 'submit',
                data:{list: data,formId: e.detail.formId},
                success: res => {
                  uni.hideLoading()
                  uni.showToast({
                    title: '成功',
                    icon:'success',
                    duration: 1500
                  })
                },
                fail: err => {
                  uni.hideLoading()
                  console.error('[云函数] [getList] 调用失败', err)
                }
              })
            }
          }
        });
      },
      radioChange(item, la) {
        this.$nextTick(()=>{
          item.isHot = la
        })
      },
      onPullDownRefresh() {
        if(this.isLock) return
        this.list = []
        this.init()
      },
      onTabItemTap() {
        uni.pageScrollTo({scrollTop: 0, duration: 100})
          .then(()=>{
            uni.startPullDownRefresh()
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
		bottom:0;
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
		box-sizing: border-box;
	}

	.VerticalNav{
		box-sizing: border-box;
		height: 100vh;
		padding-bottom:98upx;
	}
	.VerticalMain {
		box-sizing: border-box;
		/*background-color: #f1f1f1;*/
		height: 100vh;
		padding-bottom:98upx;
		flex: 1;
	}
	.radiosGroup{
		width: 200upx;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
</style>
