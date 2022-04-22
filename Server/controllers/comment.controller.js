const { message, user, comment } = require("../models");
const db = require("../models");
const User = require("../models/user.model");
const Vote = require("../models/vote.model");
const Topic = db.topic;
const Comment = db.comment;
// const Votes = db.votes;

exports.addComment = (req, res) => {
    
    const comment = new Comment({
        body: req.body.body,
        author: req.body.author,
    })

    comment.save((err, comment) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        Topic.findOne({
            _id: { $in: req.body.topicId }
        },
        (err, topic) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            topic.comments.push(comment);

            topic.save();

            res.status(200).send({
                message: "Comment added!"
            })
        })
    })

    message.find({ _id: req.body.messageId }, (err, message) => {
    })
}

exports.deleteComment = (req, res) => {
    comment.deleteOne({ _id: req.params.id }, (err, comment) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        //Delete all votes related to that comment

        res.status(200).send({ message: "comment deleted!" });
    })
}

exports.editComment = (req, res) => {

    const update = {
        body: req.body.body
    }

    comment.findByIdAndUpdate({ _id: req.params.id }, update ,(err, comment) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        } else {
            console.log("comment: ", comment);
        }

    res.status(200).send({ message: "Comment updated successfully" });
    })
}

exports.allComments = (req, res) => {
    Comment.find({}, (err, comments) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.status(200).send({ comments })
    }).sort([['createdAt', 'ascending']])
}

exports.likeComment = (req, res) => {

    const vote = new Vote({
        comment: req.body.comment.comment._id,
        user: req.body.comment.userId,
        value: 0
    })

    vote.save((err, vote) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
    })


    // This portion might not serve any purpose
    const user = User.findOne({
        _id: { $in: req.body.comment.userId }
    },
    (err, user) => {
        if(err) {
            res.status(500).send({ message: err });
            return;
        }
        if(user.votes.indexOf(user._id) == -1) {
            user.votes.push(user);
        } else {
            console.log("user already exists in array");
        }
        user.save();
    })

    const comment = Comment.findOne({
        _id: { $in: req.body.comment.comment._id }
    },
    (err, comment) => {
        if(err) {
            res.status(500).send({ message: err });
            return;
        }

        //Only add comment if it's not already in the array
        if(comment.votes.indexOf(comment._id) === -1){
            comment.votes.push(comment._id);
        } else {
            console.log("comment arleady exists in array");
        }
        comment.save();
    })

    res.status(200).send({ vote: vote });
}

exports.dislikeComment = (req, res) => {
    
    const vote = new Vote({
        comment: req.body.comment.comment._id,
        user: req.body.comment.userId,
        value: 0
    })

    vote.save((err, vote) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
    })

    // This portion might not serve any purpose
    const user = User.findOne({
        _id: { $in: req.body.comment.userId }
    },
    (err, user) => {
        if(err) {
            res.status(500).send({ message: err });
            return;
        }
        if(user.votes.indexOf(user._id) == -1) {
            user.votes.push(user);
        } else {
            console.log("user already exists in array");
        }
        user.save();
    })

    const comment = Comment.findOne({
        _id: { $in: req.body.comment.comment._id }
    },
    (err, comment) => {
        if(err) {
            res.status(500).send({ message: err });
            return;
        }

        if(comment.votes.includes(comment._id)) {
            comment.votes.splice(comment.votes.indexOf(comment._id), 1);
            console.log("Deleted comment from likes array");

            // Locate vote id and delete it from existence
            // vote.find({
            //     _id: { }
            // })
        }

        comment.save();
    })

    res.status(200).send({ vote: vote });
}

exports.allVotes = (req, res) => {
    Vote.find({}, (err, votes) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.status(200).send({ votes })
    }).sort([['createdAt', 'ascending']])
}