const mongoose = require("mongoose");

const Topic = mongoose.model(
    "Topic",
    new mongoose.Schema({
        name: String,
        description: String,
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        commentBody: String,
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }],
    },
    { timestamps: true })
);

module.exports = Topic;