const { tours } = require('../../data/tours');

Page({
  data: {
    tour: null
  },

  onLoad(options) {
    const tour = tours.find((item) => item.id === options.id);
    if (!tour) {
      wx.showToast({
        title: '行程不存在',
        icon: 'none'
      });
      setTimeout(() => wx.navigateBack(), 800);
      return;
    }

    this.setData({ tour });
  },

  goBooking() {
    wx.navigateTo({
      url: `/pages/booking/booking?id=${this.data.tour.id}`
    });
  }
});
