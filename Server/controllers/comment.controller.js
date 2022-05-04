const { faRetweet } = require("@fortawesome/free-solid-svg-icons");
const { message, user, comment } = require("../models");
const db = require("../models");
const User = require("../models/user.model");
const Vote = require("../models/vote.model");
const Topic = db.topic;
const Comment = db.comment;
var mongoose = require("mongoose");
// const Votes = db.votes;
exports.addComment = (req, res) => {
  const comment = new Comment({
    body: req.body.body,
    author: req.body.author,
  });
  comment.save((err, comment) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    Topic.findOne(
      {
        _id: { $in: req.body.topicId },
      },
      (err, topic) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        topic.comments.push(comment);
        topic.save();
        res.status(200).send({
          message: "Comment added!",
        });
      }
    );
  });
  message.find({ _id: req.body.messageId }, (err, message) => {});
};
exports.deleteComment = (req, res) => {
  comment.deleteOne({ _id: req.params.id }, (err, comment) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    //Delete all votes related to that comment
    res.status(200).send({ message: "comment deleted!" });
  });
};
exports.editComment = (req, res) => {
  const update = {
    body: req.body.body,
  };
  comment.findByIdAndUpdate({ _id: req.params.id }, update, (err, comment) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    } else {
      console.log("comment: ", comment);
    }
    res.status(200).send({ message: "Comment updated successfully" });
  });
};
exports.allComments = (req, res) => {
  Comment.find({}, (err, comments) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send({ comments });
  })
    .populate("votes")
    .sort([["createdAt", "ascending"]]);
};
exports.likeComment = (req, res) => {
  console.log(
    "-----------------------[Liking Comment]-----------------------------"
  );
  console.log(
    `UserId:\t\t${mongoose.Types.ObjectId(
      req.body.currentUserId
    )} \nCommentId: \t${mongoose.Types.ObjectId(req.body.comment._id)}\n_`
  );
  //Check to see if the comment already has a vote from the current user
  Vote.findOne(
    {
      $and: [
        { comment: mongoose.Types.ObjectId(req.body.comment._id) },
        { user: mongoose.Types.ObjectId(req.body.currentUserId) },
      ],
    },
    (err, existingVote) => {
      console.log("[Vote.findOne]: ", existingVote);
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (existingVote) {
        console.log("Existing vote found: ", existingVote);
        console.log(
          `CommentId: ${existingVote.comment}, UserId: ${existingVote.user}`
        );
        console.log(
          `CommentId: ${req.body.comment._id}, UserId: ${req.body.currentUserId}`
        );

        //Delete that one
        Vote.findOneAndDelete(
          {
            _id: existingVote._id,
          },
          (err, vote) => {
            console.log("[Vote.findOneAndDelete]: ", vote);
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            Comment.findOne(
              {
                author: vote.user,
                _id: req.body.comment._id,
              },
              (err, comment) => {
                console.log("[Comment.findOne]: ", comment);
                if (err) {
                  res.status(500).send({ message: err });
                  return;
                }
                let indexOfVote = comment.votes.indexOf(vote._id.toString());
                console.log("[comment.votes.indexOf()]: ", indexOfVote);
                if (indexOfVote > -1) comment.votes.splice(indexOfVote, 1);
                comment.save();

                User.findOne(
                  {
                    _id: vote.user,
                  },
                  (err, user) => {
                    console.log("[User.findOne]: ", user);
                    if (err) {
                      res.status(500).send({ message: err });
                      return;
                    }
                    let indexOfVote = user.votes.indexOf(vote._id);
                    console.log("[user.votes.indexOf():]", indexOfVote);
                    if (indexOfVote > -1) user.votes.splice(indexOfVote, 1);
                    user.update();
                  }
                );
              }
            );
          }
        );
      }
      //Create a new Vote Object
      const vote = new Vote({
        comment: req.body.comment._id,
        user: req.body.currentUserId,
        value: 1,
      });
      vote.save((err, vote) => {
        console.log("[new Vote created]: ", vote);
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        User.findOne(
          {
            _id: vote.user,
          },
          (err, user) => {
            // console.log("[User.findOne (no existing vote)]: ", user);
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            user.votes.push(vote);
            user.save();
            console.log("Added vote to user: ", user._id);
            console.log("User with comment: ", user);
          }
        );
        Comment.findOne(
          {
            _id: req.body.comment._id,
          },
          (err, comment) => {
            // console.log("[Comment.findOne (no existing vote)]: ", comment);
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            comment.votes.push(vote);
            comment.save();
            console.log("Added vote to comment: ", comment);
          }
        );
        console.log("Done");
        res.status(200).send({ vote: vote });
      });
    }
  );
};

exports.dislikeComment = (req, res) => {
  // console.log(`UserId:${req.body.currentUserId} \n CommentId: ${req.body.comment._id}`);
  //Check to see if the comment already has a vote from the current user
  Vote.findOne(
    {
      User: req.body.currentUserId,
      Comment: req.body.comment._id,
    },
    (err, existingVote) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (existingVote) {
        //Remove the vote from the User
        User.findOne(
          {
            _id: { $in: req.body.currentUserId },
          },
          (err, user) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            if (user) {
              //Make modificaitons to the User
              let indexOfVote = user.votes.indexOf(existingVote._id);
              if (indexOfVote > -1) user.votes.splice(indexOfVote, 1);
              user.save();
            }
          }
        );
        //Remove the vote from the Comment
        Comment.findOne(
          {
            _id: { $in: req.body.comment._id },
          },
          (err, comment) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            let indexOfVote = comment.votes.indexOf(existingVote._id);
            if (indexOfVote > -1) comment.votes.splice(indexOfVote, 1);
            comment.save();
          }
        );
        //Delete the Vote entirely
        Vote.findOneAndDelete(
          {
            _id: existingVote._id,
          },
          (err, result) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            console.log("Deleted vote successfuly: ", result);
          }
        );
      }
      // //Create a new Vote Object
      const vote = new Vote({
        comment: req.body.comment._id,
        user: req.body.currentUserId,
        value: -1,
      });
      vote.save((err, vote) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
      });
      //Add vote to User
      User.findOne(
        {
          _id: { $in: req.body.currentUserId },
        },
        (err, user) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          //Make modificaitons to the User
          let indexOfVote = user.votes.indexOf(existingVote._id);
          if (indexOfVote === -1) user.votes.push(vote);
          user.save();
        }
      );
      //Remove the vote from the Comment
      Comment.findOne(
        {
          _id: { $in: req.body.comment._id },
        },
        (err, comment) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          let indexOfVote = comment.votes.indexOf(existingVote._id);
          if (indexOfVote === -1) comment.votes.push(vote);
          comment.save();
        }
      );
      res.status(200).send({ vote: vote });
    }
  );
};
exports.allVotes = (req, res) => {
  Vote.find({}, (err, votes) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send({ votes });
  })
    // .populate("comment")
    .sort([["createdAt", "ascending"]]);
};
