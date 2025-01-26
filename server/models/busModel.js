const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  route: { type: String, required: true },
  timing: { type: String, required: true },
  price: { type: Number, required: true },
  seatsAvailable: { type: Number, required: true },
});

module.exports = mongoose.model("Bus", busSchema);
