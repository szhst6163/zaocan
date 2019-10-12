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
							<view class="cu-avatar round lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg);"></view>
							<view class="content">
								<view class="text-grey">凯尔</view>
								<view class="text-gray text-sm flex">
									<text class="text-cut">
										<text class="cuIcon-infofill text-red  margin-right-xs"></text>
										我已天理为凭，踏入这片荒芜，不再受凡人的枷锁遏制。我已天理为凭，踏入这片荒芜，不再受凡人的枷锁遏制。
									</text> </view>
							</view>
							<view class="action">
								<view class="text-grey text-xs">22:20</view>
								<view class="cu-tag round bg-grey sm">5</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
  export default {
    data() {
      return {
        list: [],
				tags:[{name:'餐厅A'},{name:'餐厅B'}],
        tabCur: 0,
				listData:[]
      };
    },
    mounted() {
      uni.showLoading({
        title: '加载中...',
        mask: true
      });
      let list = [{}];
      for (let i = 1; i < 26; i++) {
        list[i] = {};
        list[i].name =  '套餐' + i;
        list[i].id = i;
      }
      this.listData[0] = list;
      this.listData[1] = [{name:"套餐12",name:'套餐13'}];
      this.list = this.listData[0];
      uni.hideLoading()
    },
    methods: {
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

	.VerticalNav.nav .cu-item.cur {
		background-color: #f1f1f1;
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
		height: calc(100vh - 100upx + env(safe-area-inset-bottom) / 2);
	}
	.VerticalMain {
		/*background-color: #f1f1f1;*/
		height: calc(100vh - 100upx + env(safe-area-inset-bottom) / 2);
		flex: 1;
		padding-bottom:20upx;
	}
</style>
