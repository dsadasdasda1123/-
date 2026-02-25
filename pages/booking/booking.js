const { tours } = require('../../data/tours');
const { saveBooking, getBookings } = require('../../utils/storage');

Page({
  data: {
    tour: null,
    date: '',
    travelers: 1,
    contactName: '',
    contactPhone: '',
    notes: ''
  },

  onLoad(options) {
    const tour = tours.find((item) => item.id === options.id);
    if (!tour) {
      wx.showToast({
        title: '未找到对应线路',
        icon: 'none'
      });
      setTimeout(() => wx.navigateBack(), 800);
      return;
    }

    this.setData({
      tour,
      date: tour.startDate
    });
  },

  onDateChange(e) {
    this.setData({ date: e.detail.value });
  },

  onTravelersChange(e) {
    const travelers = Number(e.detail.value);
    this.setData({ travelers });
  },

  onNameInput(e) {
    this.setData({ contactName: e.detail.value.trim() });
  },

  onPhoneInput(e) {
    this.setData({ contactPhone: e.detail.value.trim() });
  },

  onNotesInput(e) {
    this.setData({ notes: e.detail.value.trim() });
  },

  submitBooking() {
    const { tour, date, travelers, contactName, contactPhone, notes } = this.data;

    if (!contactName) {
      wx.showToast({ title: '请填写联系人姓名', icon: 'none' });
      return;
    }

    if (!/^1\d{10}$/.test(contactPhone)) {
      wx.showToast({ title: '请输入正确手机号', icon: 'none' });
      return;
    }

    if (travelers < 1 || travelers > tour.seatsLeft) {
      wx.showToast({ title: `人数范围 1-${tour.seatsLeft}`, icon: 'none' });
      return;
    }

    const orderNo = `ORD${Date.now()}`;
    const amount = travelers * tour.price;

    saveBooking({
      orderNo,
      tourId: tour.id,
      tourTitle: tour.title,
      date,
      travelers,
      contactName,
      contactPhone,
      notes,
      amount,
      createdAt: new Date().toISOString()
    });

    const totalOrders = getBookings().length;
    wx.showModal({
      title: '预定成功',
      content: `订单号：${orderNo}\n总价：¥${amount}\n累计订单：${totalOrders}`,
      showCancel: false,
      success: () => {
        wx.redirectTo({
          url: '/pages/index/index'
        });
      }
    });
  }
});
