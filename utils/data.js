const tours = [
  {
    id: 'line-001',
    title: '张家界天门山·凤凰古城 5日跟团游',
    tag: '爆款跟团',
    city: '张家界',
    cover: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=60',
    gallery: [
      'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=60',
      'https://images.unsplash.com/photo-1558981001-5864d8fd81f9?auto=format&fit=crop&w=1200&q=60'
    ],
    categories: ['跟团游', '特惠抢购'],
    destination: '湖南',
    duration: '5天4晚',
    promo: '立减200',
    description: '玻璃栈道、苗寨篝火晚会，全程品质酒店。',
    itinerary: [
      'D1 抵达张家界-接站入住',
      'D2 天游峰-袁家界-黄石寨',
      'D3 天门山国家森林公园',
      'D4 凤凰古城自由活动',
      'D5 返程送站'
    ],
    priceCalendar: [
      { date: '2026-03-01', adult: 2199, child: 1699, roomDiff: 500 },
      { date: '2026-03-05', adult: 2399, child: 1799, roomDiff: 580 },
      { date: '2026-03-10', adult: 2599, child: 1899, roomDiff: 680 }
    ],
    feeInclude: ['全程4晚酒店', '景点首道门票', '当地旅游车', '旅游意外险'],
    feeExclude: ['往返大交通', '个人消费', '单房差'],
    bookingNotice: ['提前3天预订', '满10人成团', '出发前24小时内不可退'],
    flashSale: true
  },
  {
    id: 'line-002',
    title: '川西小环线 6日私家团',
    tag: '私家团',
    city: '成都',
    cover: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=60',
    gallery: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=60'
    ],
    categories: ['私家团', '定制游'],
    destination: '四川',
    duration: '6天5晚',
    promo: '2人立减500',
    description: '四姑娘山、墨石公园、鱼子西日落，专车司导。',
    itinerary: ['D1 成都集合', 'D2-5 川西深度游', 'D6 成都解散'],
    priceCalendar: [
      { date: '2026-03-02', adult: 4599, child: 3599, roomDiff: 900 },
      { date: '2026-03-09', adult: 4899, child: 3899, roomDiff: 1000 }
    ],
    feeInclude: ['专属用车', '5晚精选酒店', '司导服务'],
    feeExclude: ['景区观光车', '餐食AA', '个人消费'],
    bookingNotice: ['提前7天预订', '2人成行', '支持改期1次'],
    flashSale: false
  },
  {
    id: 'line-003',
    title: '珠海长隆亲子周边游 3日',
    tag: '周边游',
    city: '珠海',
    cover: 'https://images.unsplash.com/photo-1567443024551-f3e3cc2be870?auto=format&fit=crop&w=1200&q=60',
    gallery: [
      'https://images.unsplash.com/photo-1567443024551-f3e3cc2be870?auto=format&fit=crop&w=1200&q=60'
    ],
    categories: ['周边游', '特惠抢购'],
    destination: '广东',
    duration: '3天2晚',
    promo: '儿童免门票',
    description: '海洋王国+亲子酒店套餐，适合周末短途。',
    itinerary: ['D1 入住酒店', 'D2 海洋王国畅玩', 'D3 自由活动返程'],
    priceCalendar: [
      { date: '2026-02-28', adult: 1399, child: 899, roomDiff: 320 },
      { date: '2026-03-07', adult: 1499, child: 999, roomDiff: 360 }
    ],
    feeInclude: ['酒店2晚', '景区门票', '早餐'],
    feeExclude: ['往返交通', '午晚餐', '个人消费'],
    bookingNotice: ['提前2天预订', '节假日价格浮动'],
    flashSale: true
  }
];

const categories = ['跟团游', '私家团', '周边游', '定制游'];

const banners = [
  { id: 'b1', image: tours[0].cover, title: '春季赏花线路热卖中' },
  { id: 'b2', image: tours[1].cover, title: '私家团专享服务升级' },
  { id: 'b3', image: tours[2].cover, title: '周边亲子游限时折扣' }
];

module.exports = {
  tours,
  categories,
  banners
};
