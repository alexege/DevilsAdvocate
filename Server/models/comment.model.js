const mongoose = require("mongoose");

const Comment = mongoose.model(
    "Comment",
    new mongoose.Schema({
        body: String,
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        message: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }
    },
    { timestamps: true})
);

module.exports = Comment;