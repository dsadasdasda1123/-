<template>
  <view class="container">
    <view class="card search-head">
      <input v-model="keyword" @input="applyFilter" placeholder="输入线路名、城市、目的地" />
      <text v-if="category">当前分类：{{ category }}</text>
    </view>

    <view class="result-list">
      <view class="card result-item" v-for="item in results" :key="item.id" @click="toDetail(item.id)">
        <image :src="item.cover" mode="aspectFill" />
        <view class="meta">
          <view class="title">{{ item.title }}</view>
          <view class="desc">{{ item.duration }} · {{ item.destination }}</view>
          <view class="price">¥{{ item.priceCalendar[0].adult }} 起</view>
        </view>
      </view>
    </view>

    <view v-if="!results.length" class="empty">未找到匹配线路，试试其他关键词。</view>
  </view>
</template>

<script>
import { tours } from '@/utils/data'

export default {
  data() {
    return {
      keyword: '',
      category: '',
      results: tours
    }
  },
  onLoad(options) {
    this.keyword = decodeURIComponent(options.keyword || '')
    this.category = decodeURIComponent(options.category || '')
    this.applyFilter()
  },
  methods: {
    applyFilter() {
      const key = this.keyword.trim()
      this.results = tours.filter((item) => {
        const matchKey = !key || item.title.includes(key) || item.city.includes(key) || item.destination.includes(key)
        const matchCategory = !this.category || item.categories.includes(this.category)
        return matchKey && matchCategory
      })
    },
    toDetail(id) {
      uni.navigateTo({ url: `/pages/detail/detail?id=${id}` })
    }
  }
}
</script>

<style scoped>
.search-head { padding: 16rpx; margin-bottom: 20rpx; }
.search-head input { background: #f5f6fa; border-radius: 12rpx; padding: 14rpx; margin-bottom: 10rpx; }
.search-head text { color: #888; font-size: 24rpx; }
.result-list { display: flex; flex-direction: column; gap: 16rpx; }
.result-item { display: flex; overflow: hidden; }
.result-item image { width: 220rpx; height: 200rpx; }
.meta { padding: 14rpx; flex: 1; }
.title { font-weight: 600; line-height: 1.4; }
.desc { margin: 12rpx 0; color: #666; font-size: 24rpx; }
.empty { margin-top: 80rpx; text-align: center; color: #888; }
</style>
