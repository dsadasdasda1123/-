<template>
  <view class="container">
    <view class="search-bar card">
      <input v-model="keyword" placeholder="搜索线路/目的地" confirm-type="search" @confirm="goSearch" />
      <button size="mini" type="primary" @click="goSearch">搜索</button>
    </view>

    <swiper class="banner-swiper card" indicator-dots autoplay circular>
      <swiper-item v-for="item in banners" :key="item.id">
        <image class="banner-image" mode="aspectFill" :src="item.image" />
        <view class="banner-title">{{ item.title }}</view>
      </swiper-item>
    </swiper>

    <view class="section-title">快捷分类</view>
    <view class="category-grid card">
      <view class="category-item" v-for="item in categories" :key="item" @click="goCategory(item)">
        <view class="emoji">🧭</view>
        <text>{{ item }}</text>
      </view>
    </view>

    <view class="section-title">特惠抢购</view>
    <scroll-view class="flash-scroll" scroll-x>
      <view class="flash-list">
        <view class="flash-item card" v-for="item in flashSales" :key="item.id" @click="goDetail(item.id)">
          <image :src="item.cover" mode="aspectFill" />
          <view class="flash-content">
            <view class="line1">{{ item.title }}</view>
            <view class="price">¥{{ item.priceCalendar[0].adult }} 起</view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="section-title">热门目的地</view>
    <view class="destination-grid">
      <view class="dest-item card" v-for="item in hotDestinations" :key="item.id" @click="goDetail(item.id)">
        <image :src="item.cover" mode="aspectFill" />
        <view class="dest-content">
          <view class="dest-city">{{ item.city }}</view>
          <view class="dest-desc">{{ item.description }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { tours, categories, banners } from '@/utils/data'

export default {
  data() {
    return {
      banners,
      categories,
      keyword: '',
      flashSales: tours.filter((item) => item.flashSale),
      hotDestinations: tours
    }
  },
  methods: {
    goSearch() {
      uni.navigateTo({ url: `/pages/search/search?keyword=${encodeURIComponent(this.keyword)}` })
    },
    goCategory(category) {
      uni.navigateTo({ url: `/pages/search/search?category=${encodeURIComponent(category)}` })
    },
    goDetail(id) {
      uni.navigateTo({ url: `/pages/detail/detail?id=${id}` })
    }
  }
}
</script>

<style lang="scss" scoped>
.search-bar { padding: 16rpx; display: flex; gap: 16rpx; align-items: center; }
.search-bar input { flex: 1; background: #f3f4f7; border-radius: 12rpx; padding: 12rpx; }
.banner-swiper { height: 320rpx; margin-top: 20rpx; overflow: hidden; position: relative; }
.banner-image { width: 100%; height: 100%; }
.banner-title { position: absolute; left: 20rpx; bottom: 20rpx; color: #fff; background: rgba(0, 0, 0, .4); padding: 8rpx 14rpx; border-radius: 10rpx; }
.category-grid { display: grid; grid-template-columns: repeat(4, 1fr); padding: 16rpx; margin-bottom: 10rpx; }
.category-item { text-align: center; padding: 16rpx 0; }
.emoji { font-size: 42rpx; margin-bottom: 8rpx; }
.flash-scroll { white-space: nowrap; }
.flash-list { display: flex; gap: 16rpx; }
.flash-item { width: 420rpx; overflow: hidden; }
.flash-item image { width: 100%; height: 200rpx; }
.flash-content { padding: 14rpx; }
.line1 { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.destination-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16rpx; }
.dest-item { overflow: hidden; }
.dest-item image { width: 100%; height: 180rpx; }
.dest-content { padding: 12rpx; }
.dest-city { font-weight: 600; margin-bottom: 6rpx; }
.dest-desc { color: #666; font-size: 24rpx; line-height: 1.4; }
</style>
