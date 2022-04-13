const db = require("../models");
const User = require("../models/user.model");
const Topic = db.topic;
const Comment = db.topic;

exports.allTopics = (req, res) => {
  Topic.find({}, (err, topics) => {
    console.log("testing:" + topics);
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send({ topics });
  }).sort([["createdAt", "descending"]]);
};

exports.addTopic = (req, res) => {
  const topic = new Topic({
    name: req.body.name,
    description: req.body.description,
    author: req.body.author,
  });

  topic.save((err, topic) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.author) {
      User.findOne(
        {
          _id: { $in: req.body.author },
        },
        (err, author) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          topic.authorName = author;

          topic.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
          });

          res.status(200).send({
            name: topic.name,
            description: topic.description,
            author: author.username,
          });
        }
      );
    }
  });
};

exports.editTopic = (req, res) => {
  const update = {
    name: req.body.name,
    description: req.body.description
  };

  Topic.findByIdAndUpdate({ _id: req.params.id }, update, (err, topic) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    } else {
      console.log("topic: ", topic);
    }
    res.status(200).send({ message: "Topic updated successfully" });
  });
};

exports.deleteTopic = (req, res) => {
  Topic.deleteOne({ _id: req.params.id }, (err, topic) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    console.log("Message: ", topic);

    res.status(200).send({ message: "Topic deleted!" });
  });
};