const { tours } = require('../../utils/data');

Page({
  data: {
    line: null,
    selectedDateIndex: 0,
    traveler: {
      name: '',
      idCard: '',
      mobile: ''
    },
    selectedCoupon: null,
    couponDiscount: 0,
    finalPrice: 0,
    contractSigned: false
  },

  onLoad(options) {
    const line = tours.find((item) => item.id === options.id) || tours[0];
    const selectedDateIndex = Number(options.dateIndex || 0);
    this.setData({ line, selectedDateIndex });
    this.calculatePrice();
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`traveler.${field}`]: e.detail.value });
  },

  calculatePrice() {
    const app = getApp();
    const { line, selectedDateIndex } = this.data;
    const base = line.priceCalendar[selectedDateIndex].adult;
    const available = app.globalData.coupons.filter((coupon) => base >= coupon.threshold);
    const best = available.sort((a, b) => b.discount - a.discount)[0] || null;
    const discount = best ? best.discount : 0;
    this.setData({
      selectedCoupon: best,
      couponDiscount: discount,
      finalPrice: Math.max(base - discount, 0)
    });
  },

  validateForm() {
    const { name, idCard, mobile } = this.data.traveler;
    if (!name || !idCard || !mobile) {
      wx.showToast({ title: '请完整填写报名信息', icon: 'none' });
      return false;
    }
    if (!/^\d{17}[\dXx]$/.test(idCard)) {
      wx.showToast({ title: '身份证号格式不正确', icon: 'none' });
      return false;
    }
    if (!/^1\d{10}$/.test(mobile)) {
      wx.showToast({ title: '手机号格式不正确', icon: 'none' });
      return false;
    }
    return true;
  },

  signContract() {
    this.setData({ contractSigned: true });
    wx.showToast({ title: '电子合同已签署(模拟)', icon: 'success' });
  },

  submitOrder() {
    if (!this.validateForm()) return;

    const app = getApp();
    const { line, selectedDateIndex, traveler, finalPrice, selectedCoupon, contractSigned } = this.data;

    wx.showLoading({ title: '调起微信支付...' });
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: '支付成功(示例)', icon: 'success' });

      app.globalData.orders.unshift({
        id: `OD${Date.now()}`,
        lineTitle: line.title,
        date: line.priceCalendar[selectedDateIndex].date,
        amount: finalPrice,
        status: '待出行',
        voucher: '集合地点：张家界高铁站东广场，08:30',
        traveler,
        coupon: selectedCoupon ? selectedCoupon.name : '无',
        contractSigned,
        comment: null
      });

      wx.switchTab({ url: '/pages/orders/orders' });
    }, 900);
  }
});
