const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Passenger' },
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus' },
  seats: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
