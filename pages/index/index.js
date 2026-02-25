const { tours, categories, banners } = require('../../utils/data');

Page({
  data: {
    banners,
    categories,
    keyword: '',
    flashSales: tours.filter((item) => item.flashSale),
    hotDestinations: tours
  },

  onSearchInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  goSearch() {
    wx.navigateTo({
      url: `/pages/search/search?keyword=${encodeURIComponent(this.data.keyword)}`
    });
  },

  goCategory(e) {
    const category = e.currentTarget.dataset.category;
    wx.navigateTo({
      url: `/pages/search/search?category=${encodeURIComponent(category)}`
    });
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` });
  }
});
