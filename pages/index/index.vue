<template>
	<view>
		<basics v-if="PageCur=='basics'"></basics>
		<plugin v-if="PageCur=='plugin'"></plugin>
		<view class="cu-bar tabbar bg-white shadow foot">
			<view class="action" @click="NavChange" data-cur="basics">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/tabbar/basics' + [PageCur=='basics'?'_cur':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='basics'?'text-green':'text-gray'">元素</view>
			</view>
			<view class="action" @click="NavChange" data-cur="plugin">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/tabbar/about' + [PageCur == 'plugin'?'_cur':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='plugin'?'text-green':'text-gray'">扩展</view>
			</view>
		</view>
	</view>
</template>

<script>
	import basics from '../../pages/basics/home.vue'
  export default {
	  components:{
		  basics:basics
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
