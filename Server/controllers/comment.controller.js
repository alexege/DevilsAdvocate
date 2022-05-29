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
  console.log("req.body", req.body);
  const comment = new Comment({
    topic: req.body.topicId,
    body: req.body.body,
    author: req.body.author,
    votesum: 0
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

exports.likeComment = async (req, res) => {
  Vote.findOneAndDelete(
    {
      $and: [
        { comment: mongoose.Types.ObjectId(req.body.comment._id) },
        { user: mongoose.Types.ObjectId(req.body.currentUserId) },
      ],
    },
    (err, existingVote) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (existingVote) {
        User.findOne({ _id: req.body.currentUserId })
          .then((user) => {
            let voteIndex = user.votes.indexOf(existingVote._id);
            if (voteIndex > -1) user.votes.splice(voteIndex, 1);
            user.save();
            return;
          })
          .catch((err) => {
            console.log("error: ", err);
          });

        Comment.findOne({ _id: req.body.comment._id })
          .then((comment) => {
            let voteIndex = comment.votes.indexOf(existingVote._id);
            if (voteIndex > -1) comment.votes.splice(voteIndex, 1);
            if(existingVote.value == 1){
              comment.votesum -= 1;
            }
            comment.save();
            return;
          })
          .catch((err) => {
            console.log("error: ", err);
          });

        // res.status(200).send({ message: "Done" });
        res.status(200).send({ comment });
      } else {
        // Create a new Vote Object
        const newVote = new Vote({
          comment: req.body.comment._id,
          user: req.body.currentUserId,
          value: 1,
        });

        newVote.save((err, vote) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          User.findOne({ _id: req.body.currentUserId }).then((user) => {
            user.votes.push(newVote);
            user.save();
            return;
          });

          Comment.findOne({ _id: req.body.comment._id }).then((comment) => {
            comment.votes.push(newVote);
            comment.votesum += 1;
            console.log("votesum:", comment.votesum);
            comment.save();
            return;
          });
        });

        res.status(200).send({ vote: newVote });
      }
    }
  );
};

exports.dislikeComment = async (req, res) => {
  Vote.findOneAndDelete(
    {
      $and: [
        { comment: mongoose.Types.ObjectId(req.body.comment._id) },
        { user: mongoose.Types.ObjectId(req.body.currentUserId) },
      ],
    },
    (err, existingVote) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (existingVote) {
        User.findOne({ _id: req.body.currentUserId })
          .then((user) => {
            let voteIndex = user.votes.indexOf(existingVote._id);
            if (voteIndex > -1) user.votes.splice(voteIndex, 1);
            user.save();
            return;
          })
          .catch((err) => {
            console.log("error: ", err);
          });

        Comment.findOne({ _id: req.body.comment._id })
          .then((comment) => {
            let voteIndex = comment.votes.indexOf(existingVote._id);
            if (voteIndex > -1) comment.votes.splice(voteIndex, 1);
            if(existingVote.value == -1){
              comment.votesum += 1;
            }
            comment.save();
            return;
          })
          .catch((err) => {
            console.log("error: ", err);
          });

        res.status(200).send({ message: "Done" });
      } else {
        // Create a new Vote Object
        const newVote = new Vote({
          comment: req.body.comment._id,
          user: req.body.currentUserId,
          value: -1,
        });

        newVote.save((err, vote) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          User.findOne({ _id: req.body.currentUserId }).then((user) => {
            user.votes.push(newVote);
            user.save();
            return;
          });

          Comment.findOne({ _id: req.body.comment._id }).then((comment) => {
            comment.votes.push(newVote);
            comment.votesum -= 1;
            comment.save();
            return;
          });
        });

        res.status(200).send({ vote: newVote });
      }
    }
  );
};

exports.getTopAgree = (req, res) => {
  Comment.find({ topic: req.params.topicId }, (err, comment) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send({ comment: comment });
  })
  .populate("votes")
  .sort([["votesum", "descending"]]).limit(1);
};

exports.getTopDisagree = (req, res) => {
  Comment.find({}, (err, comment) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send({ comment: comment[0] });
  }).sort([["votesum", "ascending"]]).limit(1);
};

exports.getTopAlt = (req, res) => {
  Comment.find({}, (err, comment) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send({ comment: comment[0] });
  }).sort([["createdAt", "ascending"]]).limit(1);
};

// exports.dislikeComment = (req, res) => {
//   // console.log("------[Disliking Comment]------");
//   // console.log(
//   //   `UserId:\t\t${mongoose.Types.ObjectId(
//   //     req.body.currentUserId
//   //   )} \nCommentId: \t${mongoose.Types.ObjectId(req.body.comment._id)}\n_`
//   // );
//   //Check to see if the comment already has a vote from the current user
//   Vote.findOne(
//     {
//       $and: [
//         { comment: mongoose.Types.ObjectId(req.body.comment._id)   },
//         { user:    mongoose.Types.ObjectId(req.body.currentUserId) },
//       ],
//     },
//     (err, existingVote) => {
//       // console.log("[Vote.findOne]: ", existingVote);
//       if (err) {
//         res.status(500).send({ message: err });
//         return;
//       }
//       if (existingVote) {
//         // console.log("Existing vote found: ", existingVote);
//         // console.log(
//         //   `CommentId: ${existingVote.comment}, UserId: ${existingVote.user}`
//         // );
//         // console.log(
//         //   `CommentId: ${req.body.comment._id}, UserId: ${req.body.currentUserId}`
//         // );

//         //Delete that one
//         Vote.findOneAndDelete(
//           {
//             _id: existingVote._id,
//           },
//           (err, vote) => {
//             console.log("[Vote.findOneAndDelete]: ", vote);
//             if (err) {
//               res.status(500).send({ message: err });
//               return;
//             }
//             Comment.findOne(
//               {
//                 author: vote.user,
//                 _id: req.body.comment._id,
//               },
//               (err, comment) => {
//                 // console.log("[Comment.findOne]: ", comment);
//                 if (err) {
//                   res.status(500).send({ message: err });
//                   return;
//                 }
//                 let indexOfVote = comment.votes.indexOf(vote._id.toString());
//                 // console.log("[comment.votes.indexOf()]: ", indexOfVote);
//                 if (indexOfVote > -1) comment.votes.splice(indexOfVote, 1);
//                 comment.save();

//                 // User.findOne(
//                 //   {
//                 //     _id: vote.user,
//                 //   },
//                 //   (err, user) => {
//                 //     console.log("[User.findOne]: ", user);
//                 //     if (err) {
//                 //       res.status(500).send({ message: err });
//                 //       return;
//                 //     }
//                 //     let indexOfVote = user.votes.indexOf(vote._id);
//                 //     console.log("[user.votes.indexOf():]", indexOfVote);
//                 //     if (indexOfVote > -1) user.votes.splice(indexOfVote, 1);
//                 //     user.save();
//                 //   }
//                 // );
//               }
//             );
//           }
//         );
//       }
//       //Create a new Vote Object
//       const vote = new Vote({
//         comment: req.body.comment._id,
//         user: req.body.currentUserId,
//         value: -1,
//       });

//       // if(existingVote){
//       //   if(existingVote.value == 0){
//       //     vote.value = -1;
//       //   } else {
//       //     vote.value = 0;
//       //   }
//       // }

//       vote.save((err, vote) => {
//         // console.log("[new Vote created]: ", vote);
//         if (err) {
//           res.status(500).send({ message: err });
//           return;
//         }
//         User.findOne(
//           {
//             _id: vote.user,
//           },
//           (err, user) => {
//             // console.log("[User.findOne (no existing vote)]: ", user);
//             if (err) {
//               res.status(500).send({ message: err });
//               return;
//             }
//             user.votes.push(vote);
//             user.save();
//             // console.log("Added vote to user: ", user._id);
//             // console.log("User with comment: ", user);
//           }
//         );
//         Comment.findOne(
//           {
//             _id: req.body.comment._id,
//           },
//           (err, comment) => {
//             // console.log("[Comment.findOne (no existing vote)]: ", comment);
//             if (err) {
//               res.status(500).send({ message: err });
//               return;
//             }
//             comment.votes.push(vote);
//             comment.save();
//             // console.log("Added vote to comment: ", comment);
//           }
//         );
//         // console.log("Done");
//         res.status(200).send({ vote: vote });
//       });
//     }
//   );
// };
exports.allVotes = (req, res) => {
  console.log("Getting all votes");
  Vote.find({}, (err, votes) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send({ votes });
  })
    .populate("comment")
    .sort([["createdAt", "ascending"]]);
};
