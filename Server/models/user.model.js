const mongoose = require("mongoose");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: String,
        email: String,
        password: String,
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Role'
            }
        ],
        img: {
            data: Buffer, 
            contentType: String 
        },
        votes: [
            {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Vote'
            },
        ],
    },
    { timestamps: true})
);

module.exports = User;