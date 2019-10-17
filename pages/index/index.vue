<template>
	<view>
		<basics v-if="PageCur=='basics'"></basics>
		<my v-if="PageCur=='my'"></my>
		<view class="cu-bar tabbar bg-white shadow foot">
			<view class="action" @click="NavChange" data-cur="basics">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/tabbar/basics' + [PageCur=='basics'?'_cur':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='basics'?'text-green':'text-gray'">点餐</view>
			</view>
			<view class="action" @click="NavChange" data-cur="my">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/tabbar/about' + [PageCur == 'my'?'_cur':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='my'?'text-green':'text-gray'">订单</view>
			</view>
		</view>
	</view>
</template>

<script>
	import basics from '../../pages/basics/home.vue'
	import my from '../../pages/basics/my.vue'
  export default {
	  components:{
		  basics,
			my
	  },
    data() {
      return {
        PageCur: 'basics'
      }
    },
    methods: {
      NavChange: function(e) {
        this.PageCur = e.currentTarget.dataset.cur
      }
    }
  }
</script>

<style>

</style>
