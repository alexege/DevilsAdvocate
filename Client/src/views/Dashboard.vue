<template>
  <div class="container">
    <confirm-dialog ref="confirmDialog"></confirm-dialog>

    <edit-modal
      v-show="isModalVisible"
      @close="closeModal"
      :topicToEdit="topicToEdit"
      @update-topic="updateTopic"
    />

    <!-- <pre>_______________ALL VOTES_____________________</pre>
    <pre style="color: white;">{{ allVotes }}</pre>
    <pre>_______________ALL USERS_____________________</pre>
    <pre style="color: white;">{{ allUsers }}</pre>
    <pre>_______________ALL COMMENTS_____________________</pre>
    <pre style="color:white" v-for="comment in allComments" :key="comment._id">{{comment.votes}}</pre>
    <pre>____________________________________</pre> -->


    <!-- <span style="color:cyan">============== all Votes ==============</span>
    <pre style="color: white;" v-for="vote in allVotes" :key="vote._id">Comment: {{ vote.comment }} User: {{ vote.user }}</pre>
    <span style="color:cyan">============== all Comments ==============</span>
    <pre style="color: white;" v-for="comment in allComments" :key="comment._id">Votes: {{ comment.votes }}</pre>
    <span style="color:cyan">============== all Users ==============</span>
    <pre style="color: white;" v-for="user in allUsers" :key="user._id">id: {{ user._id }} votes: {{ user.votes }}</pre> -->

    <header class="jumbotron">
      <div v-for="(topic, index) in allTopics" :key="topic._id" class="topic">
        <div>
          <h5 class="title">{{ topic.name }}</h5>
          <div class="topic-body">
            {{ topic.description }}
            <a href="" @click.prevent="editTopic(topic)"><font-awesome-icon icon="edit" class="action-icon" /></a>
            <a href="" @click.prevent="deleteTopic(topic._id)"><font-awesome-icon icon="trash" class="action-icon" /></a>
          </div>
        </div>

      <div class="topComments" v-if="topCommentAgree && topCommentDisagree && topCommentAlt">
        <div style="color: #00aeff">{{ topCommentAgree.votesum }} {{topCommentAgree.body}}</div>
        <div style="color: red">{{ topCommentDisagree.votesum }} {{ topCommentDisagree.body }}</div>
        <div style="color: orangered">{{ topCommentAlt.votesum }} {{ topCommentAlt.body }}</div>
      </div>

        <!-- Add Comment -->
        <div class="commentInput">
          <input type="text" v-model="comment.body" placeholder="Comment" />
          <input type="submit" value="Add" @click="addComment(topic._id)" />
        </div>

        <div v-for="comment in topic.comments" :key="comment._id">
          <!-- <pre>{{ comment }}</pre> -->
          <Comment :this-comment="comment"></Comment>
        </div>

        <!-- Comment -->
        <!-- <div v-for="comment in allComments" :key="comment._id" class="comment">
          <div v-if="topic.comments.includes(comment._id)">
            [ <font-awesome-icon icon="arrow-up" class="arrow-up" @click="likeComment(comment)"/>
            <span style="padding: 5px">{{ voteTotal(comment) }}</span>
            <font-awesome-icon icon="arrow-down" class="arrow-down" @click="dislikeComment(comment)"/> ]
          
          <div v-if="comment._id == commentToEdit._id && isEditingComment" class="comment-edit">
            <input type="text" v-model="comment.body" class="comment-edit-input" :size="comment.body.length">
            <button @click.prevent="updateComment(comment)" >Save</button>
            <button @click.prevent="cancel" >Cancel</button>
          </div>

          <div v-else class="comment-edit" >
           
           <span class="comment-body" >{{ comment.body }}</span>
           <div style="display: inline-block; position: absolute; right: 0;">
            <a href="" @click.prevent="updateComment(comment)" class="edit-btn" v-if="isEditingComment"><font-awesome-icon icon="check" /></a>
            <a href="" @click.prevent="editComment(comment)"><font-awesome-icon icon="edit" class="action-icon" /></a>
            <a href="" @click.prevent="deleteComment(comment._id)"><font-awesome-icon icon="trash" class="action-icon"/></a>
           </div>
          </div>
          </div>
        </div> -->

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
import Comment from '../components/comment'
import ConfirmDialog from "../components/confirmDialog";
import EditModal from "../components/editModal";
import UserService from '../services/user.service';
import CommentService from '../services/comment.service';

export default {
  name: "Dashboard",
  components: { ConfirmDialog, EditModal, Comment},
  data() {
    return {
      allTopics: null,
      allComments: null,    //Array of comment objects
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
      console.log("id:", id);
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

    addComment(topicId) {
      const comment = {
        topicId: topicId,
        body: this.comment.body
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
      return this.$store.dispatch('comment/allComments').then(res => {
        this.allComments = res.data.comments;
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
        this.topAgree();
        this.topDisagree();
        this.topAlt();
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
          this.topAgree();
          this.topDisagree();
          this.topAlt();
        })
      }
    },

     topAgree() {
      return this.$store.dispatch('comment/getTopAgree').then(res => {
        this.topCommentAgree = res.data.comment;
      });
    },

    topDisagree() {
      return this.$store.dispatch('comment/getTopDisagree').then(res => {
        this.topCommentDisagree = res.data.comment;
      });
    },

    topAlt() {
      return this.$store.dispatch('comment/getTopAlt').then(res => {
        this.topCommentAlt = res.data.comment;
      });
    },

    //Modal Logic
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
  },

  mounted() {
    this.getAllTopics();
    this.getAllComments();
    this.getAllUsers();
    this.getAllVotes();
    this.topAgree();
    this.topDisagree();
    this.topAlt();
  },

};
</script>

<style scoped>
.action-icon {
  margin: 0 4px;
  color: black;
  /* float: right; */
}

.action-icon:hover {
  color: cyan;
}

.jumbotron {
  background-color: rgb(4, 127, 199);
  min-height: 100vh;
  height: 100%;
}

.title {
  text-align: center;
}

.topic {
  border: 1px solid black;
  padding: 10px;
  margin: 20px 0;
  transition: all .2s ease-in-out;
}

.topic:hover {
  box-shadow: 2px 2px 4px black;
  transform: scale(1.025);
}

.topic-body {
  display: inline-block;
  padding: 10px;
}

.commentInput input {
  width: 90%;
}

.commentInput input[type="submit"] {
  width: 10%;
}

.topComments {
  border-top: 1px solid black;
  padding: 10px;
}

.aboutBar {
  padding: 5px;
}

.aboutBar div {
  display: inline-block;
}

</style>
