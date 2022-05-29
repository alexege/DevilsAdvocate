<template>
  <div class="container">
    <confirm-dialog ref="confirmDialog"></confirm-dialog>

    <edit-modal v-show="isModalVisible" @close="closeModal" :topicToEdit="topicToEdit" @update-topic="updateTopic" />

    <header class="jumbotron">

      <!-- <pre style="color: white">{{ allTopics }}</pre> -->

      <div v-for="(topic, index) in allTopics" :key="topic._id" class="topic">
        
        <div class="topic-container">
          <h5 class="title">{{ topic.name }}</h5>
          <div class="topic-body">{{ topic.description }}</div>
          <div class="topic-options">
              <a href="" @click.prevent="editTopic(topic)"><font-awesome-icon icon="edit" class="action-icon" /></a>
              <a href="" @click.prevent="deleteTopic(topic._id)"><font-awesome-icon icon="trash" class="action-icon" /></a>
          </div>
        </div>

        <!-- Top Comment -->
        <div class="topComments">
          <Comment :this-comment="highestVoteSumComment(topic.comments)" class="comment comment-agree"></Comment>
          <Comment :this-comment="lowestVoteSumComment(topic.comments)" class="comment comment-disagree"></Comment>
          <Comment :this-comment="altVoteSumComment(topic.comments)" class="comment comment-alt"></Comment>        
        </div>

        <!-- Add Comment -->
        <div class="commentInput">
          <input type="text" v-model="allTopics[index].commentBody" placeholder="Comment" @keyup.enter="addComment(topic)"/>
          <input type="submit" value="Add" @click="addComment(topic)" />
        </div>

        <!-- All Topic Comments -->
        <div v-for="comment in topic.comments" :key="comment._id">
          <Comment :this-comment="comment" @all-comments="getAllComments" class="comment" style="position: relative;"></Comment>
        </div>

        <!-- Author and other info -->
        <div class="aboutBar"> {{ index }} | 
          <div v-for="user in allUsers" :key="user._id">
            <div v-if="user._id == topic.author">
              {{ user.username }}
            </div>
          </div>
           | {{ new Date(topic.createdAt).toLocaleDateString() }} | {{ new Date(topic.updatedAt).toLocaleTimeString() }}
        </div>

      </div>

      <!-- Add Topic -->
      <div>
        <input type="text" v-model="topic.name" placeholder="Topic" />
        <input
          type="text"
          v-model="topic.description"
          placeholder="Description"
        />
        <input type="submit" value="Submit" @click="addTopic" />
      </div>

    </header>
  </div>
</template>

<script>
import Comment from "../components/comment";
import CommentService from '../services/comment.service';
import ConfirmDialog from "../components/confirmDialog";
import EditModal from "../components/editModal";
import UserService from '../services/user.service';

export default {
  name: "Dashboard",
  components: { ConfirmDialog, EditModal, Comment},
  data() {
    return {
      allTopics: null,
      allComments: null,
      allUsers: null,
      allVotes: null,

      currentUser: null,

      //Topic to add
      topic: {
        name: null,
        description: null,
      },
      //Topic to edit
      topicToEdit: {
        name: null,
        description: null,
      },
      //Comment to add
      comment: {
        body: null
      },
      //Comment to edit
      commentToEdit: {
        body: null
      },
      isModalVisible: false,
      isEditingComment: false,

      topCommentAgree: null,
      topCommentDisagree: null,
      topCommentAlt: null
    };
  },

  methods: {
    test() {
      console.log("testing");
    },

    addTopic() {
      return this.$store.dispatch("topic/addTopic", this.topic).then(() => {
        this.topic.name = "";
        this.topic.description = "";
        this.getAllTopics();
      });
    },

    editTopic(topic) {
      this.isModalVisible = !this.isModalVisible;
      this.topicToEdit._id = topic._id;
      this.topicToEdit.name = topic.name;
      this.topicToEdit.description = topic.description;
    },

    updateTopic(id) {
      return this.$store.dispatch(`topic/editTopic`, id).then(() => {
        this.isModalVisible = false;
        this.getAllTopics();
      });
    },

    getAllTopics() {
      return this.$store.dispatch("topic/allTopics").then((res) => {
        this.allTopics = res.data.topics;
      });
    },

    deleteTopic(topic) {
      this.$refs.confirmDialog
        .show({
          title: "Delete Topic",
          message:
            "Are you sure you want to delete this topic? It cannot be undone.",
          okButton: "Delete",
        })
        .then((res, err) => {
          if (err) {
            res.status(500).send({ message: err });
          }
          if (res) {
            return this.$store.dispatch(`topic/deleteTopic`, topic).then(() => {
              this.getAllTopics();
            });
          }
        });
    },

    addComment(topic) {
      console.log("Adding comment");
      const comment = {
        topicId: topic._id,
        // body: this.comment.body
        body: topic.commentBody
      }

      return this.$store.dispatch("comment/addComment", comment).then(() => {
        this.comment.body = "";
        this.getAllComments();
        this.getAllTopics();
      });
    },

    editComment(comment) {
      this.isEditingComment = !this.isEditingComment;
      this.commentToEdit._id = comment._id;
      this.commentToEdit.body = comment.body;
    },

    updateComment(commentId) {
      this.isEditingComment = !this.isEditingComment;
      return this.$store.dispatch(`comment/editComment`, commentId).then(() => {
        this.getAllComments();
      });
    },

    cancel() {
      this.isEditingComment = false;
    },

    deleteComment(comment) {

        this.$refs.confirmDialog.show({
        title: 'Delete Comment',
        message: 'Are you sure you want to delete this comment? It cannot be undone.',
        okButton: 'Delete',
        }).then((res, err) => {
          if (err) {
            res.status(500).send({ message: err });
          }
          if (res) {
              return this.$store.dispatch(`comment/deleteComment`, comment).then(() => {
                this.getAllComments();
              });
          }
        })
    },

    getAllComments() {
      // this.allComments = this.$store.state.comment.allComments;
      return this.$store.dispatch('comment/allComments').then(res => {
        this.allComments = res.data.comments;
        // this.$store.dispatch('allComments', res.data.comments);
        // this.$store.dispatch('comment/allComments', res.data.comments);

        // this.allComments = this.$store.state.comment.allComments;
        this.getAllTopics();
      });
    },

    getAllUsers() {
      console.log("Getting all users");
      UserService.getAllUsers().then(res => {
        this.allUsers = res.data.users;
      })
    },

    getAllVotes() {
      CommentService.allVotes().then(res => {
        this.allVotes = res.data.votes;
      })
    },

    voteTotal(comment) {
      let totalVotes = 0;
      comment.votes.forEach(element => {
        totalVotes += element.value;
      });
      return totalVotes;
    },

    /* ========================Votes================================ */
    likeComment(comment) {
      
      const currentUser = JSON.parse(localStorage.getItem('user'));
      this.currentUser = currentUser;

      if(currentUser) {
        return this.$store.dispatch('comment/likeComment', {
        "comment": comment,
        "currentUserId": currentUser.id
      }).then(() => {
        this.getAllVotes();
        this.getAllComments();
        this.getAllUsers();
        // this.topAgree();
        // this.topDisagree();
        // this.topAlt();
        })
      }
    },

    dislikeComment(comment) {
      const currentUser = JSON.parse(localStorage.getItem('user'));

      if(currentUser) {
        return this.$store.dispatch('comment/dislikeComment', {
          "comment": comment,
          "currentUserId": currentUser.id
        }).then(() => {
          this.getAllComments();
          this.getAllVotes();
          this.getAllUsers();
          // this.topAgree();
          // this.topDisagree();
          // this.topAlt();
        })
      }
    },

    // topAgree(topicId) {
    //   return this.$store.dispatch("comment/getTopAgree", topicId)
    //   .then(res => {
    //     this.topCommentAgree = res.data.comment;
    //     // return res.data.comment;
    //   })
    //   .catch(e => {
    //     console.log("error:", e);
    //   });
    // },

  //   topDisagree(topicId) {
  //     return this.$store.dispatch(`comment/getTopDisagree/${topicId}`).then(res => {
  //       this.topCommentDisagree = res.data.comment;
  //     });
  //   },

  //   topAlt(topicId) {
  //     return this.$store.dispatch(`comment/getTopAlt/${topicId}`).then(res => {
  //       this.topCommentAlt = res.data.comment;
  //     });
  //   },
    highestVoteSumComment(comments) {
      return comments.slice().sort((a, b) => b.votesum - a.votesum)[0];
    },
   
   lowestVoteSumComment(comments) {
      return comments.slice().sort((a, b) => a.votesum - b.votesum)[0];
    },
   
   altVoteSumComment(comments) {
      return comments.slice().sort((a, b) => b.votesum - a.votesum)[0];
    },

    //Modal Logic
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
  },

  computed: {
    
  },

  mounted() {
    this.getAllTopics();
    this.getAllComments();
    this.getAllUsers();
    this.getAllVotes();
    // this.topAgree();
    // this.topDisagree();
    // this.topAlt();
  },

};
</script>

<style scoped>
.action-icon {
  margin: 0 4px;
  color: white;
  /* float: right; */
}

.action-icon:hover {
  color: cyan;
}

.jumbotron {
  /* background-color: rgb(4, 127, 199); */
  background-color: #0E0E10;
  min-height: 100vh;
  height: 100%;
}

.title {
  text-align: center;
}

.topic {
  border: 1px solid white;
  border-radius: 8px;
  padding: 10px;
  margin: 20px 0;
  transition: all .2s ease-in-out;
  color: white;
}

.topic-container {
  position: relative;
}

.topic:hover {
  box-shadow: 2px 2px 4px black;
  transform: scale(1.025);
}

.topic-body {
  padding: 10px;
  width: 75%;
  margin: 0 auto;
  position: relative;
}

.topic-options {
  display: inline-block;
  position: absolute;
  top: 0;
  right: 0;
}

.commentInput input {
  width: 90%;
}

.commentInput input[type="submit"] {
  width: 10%;
}

.comment-agree {
  color: #00aeff;
}

.comment-disagree {
  color: red;
}

.comment-alt {
  color: orangered;
}

.topComments {
  padding: 10px;
}

.aboutBar {
  padding: 5px;
}

.aboutBar div {
  display: inline-block;
}

</style>
