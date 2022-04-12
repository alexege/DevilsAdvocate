const db = require("../models");
const User = require("../models/user.model");
// const Topic = db.topic;
const Topic = db.topic;

exports.allTopics = (req, res) => {
    Topic.find({}, (err, topics) => {
        console.log("testing:" + topics);
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.status(200).send({ topics })
    }).sort([['createdAt', 'descending']])
};

exports.addTopic = (req, res) => {
    // console.log("req.body:", req.body);

    const topic = new Topic({
        name: req.body.name,
        author: req.body.author
    });

    topic.save((err, topic) => {
        if(err) {
            res.status(500).send({ message: err });
            return;
        }

        if(req.body.author){
            // console.log("User body author was found", req.body.author);

            User.findOne({
                _id: { $in: req.body.author }
            },
            (err, author) => {
                if(err) {
                    res.status(500).send({ message: err });
                    return;
                }
                // console.log("author: ", author);
    
                topic.authorName = author;

                topic.save(err => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                })

                res.status(200).send({
                    name: topic.name,
                    author: author.username
                })
            })
        }
    })
}

exports.deleteTopic = (req, res) => {
    Topic.deleteOne({ _id: req.params.id }, (err, topic) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        console.log("Message: ", topic);

        res.status(200).send({ message: "Topic deleted!" });
    })
}