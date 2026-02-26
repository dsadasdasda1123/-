<template>
  <view v-if="line" class="page-wrap">
    <swiper class="gallery" indicator-dots autoplay circular>
      <swiper-item v-for="item in line.gallery" :key="item"><image :src="item" mode="aspectFill" /></swiper-item>
    </swiper>

    <view class="container">
      <view class="card intro">
        <view class="title">{{ line.title }}</view>
        <view class="sub">{{ line.duration }} · {{ line.promo }}</view>
        <view class="price">¥{{ currentPrice.adult }} 起</view>
      </view>

      <view class="section-title">动态报价</view>
      <view class="card quote">
        <picker mode="selector" :range="line.priceCalendar" range-key="date" @change="pickDate">
          <view class="picker">出发日期：{{ currentPrice.date }}（点击切换）</view>
        </picker>
        <view class="spec-grid">
          <view class="spec-item" v-for="item in specs" :key="item.key">
            <text>{{ item.label }}</text>
            <text class="price">¥{{ currentPrice[item.key] }}</text>
          </view>
        </view>
      </view>

      <view class="section-title">详细行程</view>
      <view class="card list-card">
        <view class="list-item" v-for="item in line.itinerary" :key="item">{{ item }}</view>
      </view>

      <view class="section-title">费用说明</view>
      <view class="card list-card">
        <view class="h4">费用包含</view>
        <view class="list-item" v-for="item in line.feeInclude" :key="`inc-${item}`">· {{ item }}</view>
        <view class="h4">费用不含</view>
        <view class="list-item" v-for="item in line.feeExclude" :key="`exc-${item}`">· {{ item }}</view>
      </view>

      <view class="section-title">预订须知</view>
      <view class="card list-card">
        <view class="list-item" v-for="item in line.bookingNotice" :key="item">· {{ item }}</view>
      </view>
    </view>

    <view class="bottom-bar">
      <button open-type="contact" plain>在线咨询</button>
      <button type="primary" @click="goBooking">立即预订</button>
    </view>
  </view>
</template>

<script>
import { tours } from '@/utils/data'

export default {
  data() {
    return {
      line: null,
      selectedDateIndex: 0,
      specs: [
        { key: 'adult', label: '成人' },
        { key: 'child', label: '儿童' },
        { key: 'roomDiff', label: '单房差' }
      ]
    }
  },
  computed: {
    currentPrice() {
      if (!this.line) return {}
      return this.line.priceCalendar[this.selectedDateIndex]
    }
  },
  onLoad(options) {
    this.line = tours.find((item) => item.id === options.id) || tours[0]
    uni.setNavigationBarTitle({ title: `${this.line.city}线路详情` })
  },
  methods: {
    pickDate(e) {
      this.selectedDateIndex = Number(e.detail.value)
    },
    goBooking() {
      uni.navigateTo({ url: `/pages/booking/booking?id=${this.line.id}&dateIndex=${this.selectedDateIndex}` })
    }
  }
}
</script>

<style scoped>
.page-wrap { padding-bottom: 130rpx; }
.gallery { height: 420rpx; }
.gallery image { width: 100%; height: 100%; }
.intro { padding: 18rpx; }
.title { font-size: 34rpx; font-weight: 700; line-height: 1.4; }
.sub { margin: 10rpx 0; color: #666; }
.quote { padding: 16rpx; }
.picker { padding: 14rpx; border-radius: 12rpx; background: #f5f6f9; margin-bottom: 16rpx; }
.spec-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10rpx; }
.spec-item { background: #fafafa; border-radius: 12rpx; padding: 12rpx; display: flex; flex-direction: column; gap: 6rpx; }
.list-card { padding: 16rpx; }
.list-item { line-height: 1.8; border-bottom: 1rpx solid #f0f0f0; padding: 8rpx 0; }
.h4 { margin-top: 10rpx; font-weight: 600; }
.bottom-bar { position: fixed; left: 0; right: 0; bottom: 0; padding: 16rpx 24rpx; background: #fff; display: grid; grid-template-columns: 1fr 1fr; gap: 16rpx; box-shadow: 0 -8rpx 30rpx rgba(0,0,0,.06); }
</style>
