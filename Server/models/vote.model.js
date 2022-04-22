const mongoose = require("mongoose");

const Vote = mongoose.model(
    "Vote",
    new mongoose.Schema({
        comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment'},
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        value: Number
    },
    { timestamps: true })
);

module.exports = Vote;