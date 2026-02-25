const { tours } = require('../../data/tours');

Page({
  data: {
    keyword: '',
    tours,
    filteredTours: tours
  },

  onKeywordInput(e) {
    const keyword = e.detail.value.trim();
    const filteredTours = this.data.tours.filter((item) => {
      if (!keyword) {
        return true;
      }
      return (
        item.title.includes(keyword) ||
        item.city.includes(keyword) ||
        item.highlights.some((tag) => tag.includes(keyword))
      );
    });

    this.setData({
      keyword,
      filteredTours
    });
  },

  goDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/tour/tour?id=${id}`
    });
  }
});
