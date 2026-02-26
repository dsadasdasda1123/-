<template>
  <view class="container">
    <scroll-view class="status-tabs" scroll-x>
      <view class="tab-list">
        <view v-for="item in statusList" :key="item" class="tab" :class="activeStatus===item?'on':''" @click="activeStatus=item">{{ item }}</view>
      </view>
    </scroll-view>

    <view class="order-list">
      <view v-for="item in filteredOrders" :key="item.id" class="card order-item">
        <view class="row between">
          <text>{{ item.lineTitle }}</text>
          <text class="status">{{ item.status }}</text>
        </view>
        <view class="meta">出发：{{ item.date }} · 金额：¥{{ item.amount }}</view>
        <view class="meta">电子凭证：{{ item.voucher }}</view>

        <view v-if="item.status==='待付款'" class="actions">
          <button size="mini" type="warn">继续支付</button>
          <button size="mini" @click="completeOrder(item.id)">模拟出行完成</button>
        </view>

        <view v-if="item.status==='已完成'" class="actions">
          <button size="mini" @click="addComment(item.id)">发布图文评价</button>
        </view>

        <view v-if="item.comment" class="comment">评价：{{ item.comment }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      activeStatus: '全部',
      statusList: ['全部', '待付款', '待出行', '已完成', '退款中'],
      orders: []
    }
  },
  computed: {
    filteredOrders() {
      if (this.activeStatus === '全部') return this.orders
      return this.orders.filter((item) => item.status === this.activeStatus)
    }
  },
  onShow() {
    const seedOrders = [
      {
        id: 'OD20260101001',
        lineTitle: '珠海长隆亲子周边游 3日',
        date: '2026-03-07',
        amount: 1399,
        status: '待付款',
        voucher: '请支付后查看凭证',
        traveler: { name: '张三' },
        comment: null
      },
      {
        id: 'OD20251225088',
        lineTitle: '川西小环线 6日私家团',
        date: '2025-12-30',
        amount: 4899,
        status: '已完成',
        voucher: '集合地点：成都IFS西门，07:30',
        traveler: { name: '李四' },
        comment: null
      }
    ]
    const dynamicOrders = getApp().globalData.orders || []
    this.orders = dynamicOrders.concat(seedOrders)
  },
  methods: {
    completeOrder(id) {
      this.orders = this.orders.map((item) => (item.id === id ? { ...item, status: '已完成' } : item))
    },
    addComment(id) {
      this.orders = this.orders.map((item) => {
        if (item.id === id) {
          return { ...item, comment: '导游服务很贴心，线路安排合理，点赞！[图文评价示例]' }
        }
        return item
      })
    }
  }
}
</script>

<style scoped>
.status-tabs { white-space: nowrap; margin-bottom: 16rpx; }
.tab-list { display: flex; gap: 12rpx; }
.tab { padding: 10rpx 22rpx; background: #fff; border-radius: 999rpx; color: #666; }
.tab.on { background: #1aad19; color: #fff; }
.order-list { display: flex; flex-direction: column; gap: 16rpx; }
.order-item { padding: 16rpx; }
.row { display: flex; }
.between { justify-content: space-between; }
.status { color: #1aad19; }
.meta { margin-top: 8rpx; color: #666; font-size: 24rpx; }
.actions { margin-top: 12rpx; display: flex; gap: 12rpx; }
.comment { margin-top: 10rpx; background: #f6fbf6; border-radius: 10rpx; padding: 10rpx; color: #2f6f35; }
</style>
