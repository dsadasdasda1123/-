<template>
  <view class="container">
    <view class="card user-box">
      <view class="avatar">👤</view>
      <view>
        <view class="name">{{ user.nickname }}</view>
        <view class="mobile">{{ user.mobile }}</view>
      </view>
    </view>

    <view class="section-title">订单状态追踪</view>
    <view class="card stat-grid">
      <view v-for="item in stats" :key="item.label" class="stat-item">
        <view class="num">{{ item.count }}</view>
        <view>{{ item.label }}</view>
      </view>
    </view>

    <view class="section-title">功能入口</view>
    <view class="card menu">
      <view class="menu-item">电子凭证</view>
      <view class="menu-item">常用旅客</view>
      <view class="menu-item">联系客服</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      user: { nickname: '旅行家小王', mobile: '138****5678' },
      stats: [
        { label: '待付款', count: 1 },
        { label: '待出行', count: 2 },
        { label: '已完成', count: 8 },
        { label: '退款中', count: 0 }
      ]
    }
  }
}
</script>

<style scoped>
.user-box { display: flex; gap: 14rpx; padding: 20rpx; align-items: center; }
.avatar { width: 88rpx; height: 88rpx; border-radius: 50%; background: #f1f2f5; display: flex; align-items: center; justify-content: center; font-size: 42rpx; }
.name { font-weight: 700; }
.mobile { margin-top: 6rpx; color: #777; font-size: 24rpx; }
.stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); padding: 16rpx; }
.stat-item { text-align: center; }
.num { font-size: 34rpx; font-weight: 700; color: #1aad19; }
.menu { padding: 0 16rpx; }
.menu-item { padding: 22rpx 0; border-bottom: 1rpx solid #f0f0f0; }
</style>
