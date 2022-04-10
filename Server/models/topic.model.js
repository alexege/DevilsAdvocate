const mongoose = require("mongoose");

const Topic = mongoose.model(
    "Topic",
    new mongoose.Schema({
        name: String,
        body: String,
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }],
    },
    { timestamps: true })
);

module.exports = Topic;