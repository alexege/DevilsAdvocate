<template>
  <div class="container">
    <confirm-dialog ref="confirmDialog"></confirm-dialog>

    <edit-modal
      v-show="isModalVisible"
      @close="closeModal"
      :topicToEdit="topicToEdit"
      @update-topic="updateTopic"
    />

    <header class="jumbotron">
      <div v-for="topic in allTopics" :key="topic._id" class="topic">
        <h5>{{ topic.name }}</h5>
        <div>
          {{ topic.description }}
        </div>
        <a href="" @click.prevent="editTopic(topic)">Edit </a>
        <a href="" @click.prevent="deleteTopic(topic._id)">Delete</a>
        <br />
        <!-- Add Comment -->
        <div class="commentInput">
          <input type="text" v-model="comment.body" placeholder="Comment" />
          <input type="submit" value="Add" @click="addComment(topic._id)" />
        </div>

        <div v-for="comment in allComments" :key="comment._id">
          <div v-if="topic.comments.includes(comment._id)">
          {{ comment.body }}
          </div>
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
import ConfirmDialog from "../components/confirmDialog";
import EditModal from "../components/editModal";

export default {
  name: "Dashboard",
  components: { ConfirmDialog, EditModal },
  data() {
    return {
      allTopics: null,
      allComments: null,

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
  },
};
</script>

<style scoped>
.jumbotron {
  background-color: white;
  min-height: 100vh;
  height: 100%;
}

.topic {
  border: 1px solid black;
  padding: 10px;
}

.commentInput input {
  width: 90%;
}

.commentInput input[type="submit"] {
  width: 10%;
}
</style>
