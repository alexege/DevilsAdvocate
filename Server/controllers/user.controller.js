const db = require("../models");
const User = db.user;

exports.allAccess = (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
        res.status(500).send({ message: err });
        return;
    }
    res.status(200).send({ users: users })
  }).sort([['updatedAt', 'descending']])
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.allUsers = (req, res) => {
  res.status(200).send("All Users");
}