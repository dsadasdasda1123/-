Page({
  data: {
    activeStatus: '全部',
    statusList: ['全部', '待付款', '待出行', '已完成', '退款中'],
    orders: []
  },

  onShow() {
    const app = getApp();
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
    ];

    this.setData({ orders: app.globalData.orders.concat(seedOrders) });
  },

  switchStatus(e) {
    this.setData({ activeStatus: e.currentTarget.dataset.status });
  },

  completeOrder(e) {
    const id = e.currentTarget.dataset.id;
    const orders = this.data.orders.map((item) => (item.id === id ? { ...item, status: '已完成' } : item));
    this.setData({ orders });
    getApp().globalData.orders = orders.filter((item) => item.id.startsWith('OD1'));
  },

  addComment(e) {
    const id = e.currentTarget.dataset.id;
    const orders = this.data.orders.map((item) => {
      if (item.id === id) {
        return { ...item, comment: '导游服务很贴心，线路安排合理，点赞！[图文评价示例]' };
      }
      return item;
    });
    this.setData({ orders });
  }
});
