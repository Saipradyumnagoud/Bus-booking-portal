const mongoose = require("mongoose");

const searchHistorySchema = new mongoose.Schema({
    passengerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Passenger",
        required: true,
        index: true
    },
    source: {
        type: String,
        required: true,
        trim: true
    },
    destination: {
        type: String,
        required: true,
        trim: true
    },
    searchDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

searchHistorySchema.index({
    passengerId: 1,
    createdAt: -1
});

module.exports = mongoose.model("SearchHistory", searchHistorySchema);