const db = require("../models");
const User = require("../models/user.model");
// const Topic = db.topic;
const Topic = db.topic;

exports.allTopics = (req, res) => {
  Topic.find({}, (err, topics) => {
    if (err) {
        res.status(500).send({ message: "err" });
        return;
    }
    res.status(200).send({ topics: topics })
  }).sort([['updatedAt', 'descending']])
};

exports.addTopic = (req, res) => {
    const topic = new Topic({
        name: req.body.name,
        author: req.body.author
    });

    topic.save((err, topic) => {
        if(err) {
            res.status(500).send({ message: err });
            return;
        }

        if(req.body.author) {
            console.log("Topic author was found:", req.body.author);

            User.findOne({
                _id: { $in: req.body.author }
            },
            (err, author) => {
                if(err) {
                    res.status(500).send({ message: err });
                    return;
                }
                console.log("author:", author);

                topic.authorName = author;

                topic.save(err => {
                    if(err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                })

                res.status(200).send({
                    id: topic._id,
                    name: topic.name,
                    // author: author.username
                })
            })
        }
    })
}