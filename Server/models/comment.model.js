const mongoose = require("mongoose");

const Comment = mongoose.model(
    "Comment",
    new mongoose.Schema({
        body: String,
        topic: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Topic'
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        message: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        },
        votes: [
            {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Vote'
            },
        ],
        votesum: Number
    },
    { timestamps: true})
);

module.exports = Comment;