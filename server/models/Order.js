const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Passenger", required: true },
  busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
  seats: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  selectedSeats: { type: [Number], required: true }, // ✅ Added selected seats
  travelers: [
    {
      seatNumber: { type: Number, required: true },
      name: { type: String, required: true },
      age: { type: Number, required: true },
      gender: { type: String, required: true },
    },
  ],
  bookingDate: { type: Date, required: true }, // ✅ Added booking date
  orderStatus: { type: String, default: "Successful" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
