const { tours } = require('../../utils/data');

Page({
  data: {
    keyword: '',
    category: '',
    results: tours
  },

  onLoad(options) {
    const keyword = decodeURIComponent(options.keyword || '');
    const category = decodeURIComponent(options.category || '');
    this.setData({ keyword, category });
    this.applyFilter(keyword, category);
  },

  onKeywordInput(e) {
    const keyword = e.detail.value;
    this.setData({ keyword });
    this.applyFilter(keyword, this.data.category);
  },

  applyFilter(keyword, category) {
    const key = (keyword || '').trim();
    const results = tours.filter((item) => {
      const matchKey = !key || item.title.includes(key) || item.city.includes(key) || item.destination.includes(key);
      const matchCategory = !category || item.categories.includes(category);
      return matchKey && matchCategory;
    });
    this.setData({ results });
  },

  toDetail(e) {
    wx.navigateTo({ url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}` });
  }
});
