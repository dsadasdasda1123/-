<template>
  <view v-if="line" class="container">
    <view class="card order-info">
      <view class="title">{{ line.title }}</view>
      <view>出发日期：{{ currentPrice.date }}</view>
      <view>成人价：<text class="price">¥{{ currentPrice.adult }}</text></view>
    </view>

    <view class="section-title">报名信息</view>
    <view class="card form">
      <input v-model="traveler.name" placeholder="旅客姓名" />
      <input v-model="traveler.idCard" placeholder="身份证号（用于保险）" />
      <input v-model="traveler.mobile" placeholder="手机号" type="number" maxlength="11" />
    </view>

    <view class="section-title">优惠券抵扣</view>
    <view class="card coupon">
      <view v-if="selectedCoupon">已自动匹配：{{ selectedCoupon.name }}，减 ¥{{ couponDiscount }}</view>
      <view v-else>暂无可用优惠券</view>
    </view>

    <view class="section-title">电子合同（进阶）</view>
    <view class="card contract">
      <view>{{ contractSigned ? '已签署电子合同' : '支付前后可在线签署电子合同（此处为模拟流程）' }}</view>
      <button v-if="!contractSigned" size="mini" @click="signContract">立即签署</button>
    </view>

    <view class="card pay-bar">
      <view>应付金额：<text class="price">¥{{ finalPrice }}</text></view>
      <button type="primary" @click="submitOrder">微信支付</button>
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
      traveler: { name: '', idCard: '', mobile: '' },
      selectedCoupon: null,
      couponDiscount: 0,
      finalPrice: 0,
      contractSigned: false
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
    this.selectedDateIndex = Number(options.dateIndex || 0)
    this.calculatePrice()
  },
  methods: {
    calculatePrice() {
      const base = this.currentPrice.adult
      const coupons = getApp().globalData.coupons || []
      const available = coupons.filter((coupon) => base >= coupon.threshold)
      const best = available.sort((a, b) => b.discount - a.discount)[0] || null
      this.selectedCoupon = best
      this.couponDiscount = best ? best.discount : 0
      this.finalPrice = Math.max(base - this.couponDiscount, 0)
    },
    validateForm() {
      if (!this.traveler.name || !this.traveler.idCard || !this.traveler.mobile) {
        uni.showToast({ title: '请完整填写报名信息', icon: 'none' })
        return false
      }
      if (!/^\d{17}[\dXx]$/.test(this.traveler.idCard)) {
        uni.showToast({ title: '身份证号格式不正确', icon: 'none' })
        return false
      }
      if (!/^1\d{10}$/.test(this.traveler.mobile)) {
        uni.showToast({ title: '手机号格式不正确', icon: 'none' })
        return false
      }
      return true
    },
    signContract() {
      this.contractSigned = true
      uni.showToast({ title: '电子合同已签署(模拟)', icon: 'success' })
    },
    submitOrder() {
      if (!this.validateForm()) return
      uni.showLoading({ title: '调起微信支付...' })
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({ title: '支付成功(示例)', icon: 'success' })
        const orders = getApp().globalData.orders || []
        orders.unshift({
          id: `OD${Date.now()}`,
          lineTitle: this.line.title,
          date: this.currentPrice.date,
          amount: this.finalPrice,
          status: '待出行',
          voucher: '集合地点：张家界高铁站东广场，08:30',
          traveler: this.traveler,
          coupon: this.selectedCoupon ? this.selectedCoupon.name : '无',
          contractSigned: this.contractSigned,
          comment: null
        })
        getApp().globalData.orders = orders
        uni.switchTab({ url: '/pages/orders/orders' })
      }, 900)
    }
  }
}
</script>

<style scoped>
.order-info, .form, .coupon, .contract { padding: 16rpx; margin-bottom: 16rpx; }
.title { font-weight: 600; margin-bottom: 8rpx; }
.form input { background: #f5f6f9; margin: 10rpx 0; padding: 14rpx; border-radius: 10rpx; }
.contract { display: flex; justify-content: space-between; align-items: center; gap: 16rpx; }
.pay-bar { margin-top: 26rpx; padding: 18rpx; display: flex; justify-content: space-between; align-items: center; }
</style>
