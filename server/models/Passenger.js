const mongoose = require('mongoose');

const PassengerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const PassengerModel = mongoose.model('Passenger', PassengerSchema);

module.exports = PassengerModel;
