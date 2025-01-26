const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  route: { type: String, required: true },
  price: { type: Number, required: true },
  timing: { type: String, required: true },
});

const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus;
