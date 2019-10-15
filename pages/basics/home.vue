<template>
	<view>
		<view class="VerticalBox">
			<scroll-view class="VerticalNav nav" scroll-y scroll-with-animation>
				<view class="cu-item" :class="index==tabCur?'text-green cur':''" v-for="(item,index) in tags" :key="index" @tap="TabSelect"
							:data-id="index">
					Tab-{{item.name}}
				</view>
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
    <button class="btn" @tap="submit" type="primary">提交</button>
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
        list: [],
				tags:[{name:'餐厅A'},{name:'餐厅B'}],
        tabCur: 0,
				listData:[]
      };
    },
    computed: {
      // total() {
      //   let data = this.listData[0].map(res => res.num)
      //   let num = 0
      //   data.forEach(res => {
      //     num += res
      //   })
      //   return num
      // }
    },
    mounted() {
      uni.showLoading({
        title: '加载中...',
        mask: true
      });
      let list = [{}];
      for (let i = 0; i < 26; i++) {
        list[i] = {};
        list[i].name =  '套餐' + i;
        list[i].id = i;
        list[i].kouwei = true;
        list[i].isHot = '辣';
        list[i].num = 0
      }
      this.listData[0] = list;
      this.listData[1] = [{name:"套餐12"}];
      this.list = this.listData[0];
      uni.hideLoading()
    },
    methods: {
      submit() {
        let data = this.listData[0].filter(res => res.num)
        let str = ''
        data.forEach(res => {
          str += `${res.name}${res.isHot?`(${res.isHot})`:''}*${res.num};\n`
        })
        uni.showModal({
          title: '提示',
          content: `你点了${str}`,
          success: function (res) {
            if (res.confirm) {
              console.log(data)
            }
          }
        });
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
    margin-top:10upx;
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
	}

	.VerticalNav{
		height: calc(100vh - 200upx + env(safe-area-inset-bottom) / 2);
	}
	.VerticalMain {
		/*background-color: #f1f1f1;*/
		height: calc(100vh - 200upx + env(safe-area-inset-bottom) / 2);
		flex: 1;
	}
	.radiosGroup{
		width: 200upx;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
</style>
