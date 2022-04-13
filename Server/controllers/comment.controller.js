const { message, user, comment } = require("../models");
const db = require("../models");
const Topic = db.topic;
const Comment = db.comment;

exports.addComment = (req, res) => {
    
    const comment = new Comment({
        body: req.body.body,
        author: req.body.author
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