const BOOKING_KEY = 'tour_bookings';

function getBookings() {
  return wx.getStorageSync(BOOKING_KEY) || [];
}

function saveBooking(order) {
  const existing = getBookings();
  existing.unshift(order);
  wx.setStorageSync(BOOKING_KEY, existing);
  return existing;
}

module.exports = {
  getBookings,
  saveBooking
};
