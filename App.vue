<script>
export default {
  globalData: {
    coupons: [
      { id: 'coupon-100', name: '满1000减100', threshold: 1000, discount: 100 },
      { id: 'coupon-300', name: '满3000减300', threshold: 3000, discount: 300 }
    ],
    orders: []
  }
}
</script>

<style lang="scss">
@import './uni.scss';
</style>
