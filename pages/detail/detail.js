const { tours } = require('../../utils/data');

Page({
  data: {
    line: null,
    selectedDateIndex: 0,
    specs: [
      { key: 'adult', label: '成人' },
      { key: 'child', label: '儿童' },
      { key: 'roomDiff', label: '单房差' }
    ]
  },

  onLoad(options) {
    const line = tours.find((item) => item.id === options.id) || tours[0];
    this.setData({ line });
    wx.setNavigationBarTitle({ title: line.city + '线路详情' });
  },

  pickDate(e) {
    this.setData({ selectedDateIndex: Number(e.detail.value) });
  },

  goBooking() {
    const { line, selectedDateIndex } = this.data;
    wx.navigateTo({ url: `/pages/booking/booking?id=${line.id}&dateIndex=${selectedDateIndex}` });
  }
});
