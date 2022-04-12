<template>
  <div class="container">
    
    <confirm-dialog ref="confirmDialog"></confirm-dialog>

    <edit-modal v-show="isModalVisible" @close="closeModal" :topicToEdit="topicToEdit" @update-topic="updateTopic" />

    <header class="jumbotron">
      <div v-for="topic in allTopics" :key="topic._id" class="topic">
        {{ topic.name }}
        <a href="" @click.prevent="editTopic(topic)">Edit </a>
        <a href="" @click.prevent="deleteTopic(topic._id)">Delete</a>
      </div>

      <!-- Add Topic -->
      <div>
        <input type="text" v-model="topic.name" placeholder="Topic" />
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

      //Topic to add
      topic: {
        name: null,
      },

      //Topic to edit
      topicToEdit: {
        name: null
      },
      isModalVisible: false
    };
  },

  methods: {
    addTopic() {
      return this.$store.dispatch("topic/addTopic", this.topic).then(() => {
        this.topic.name = "";
        this.getAllTopics();
      });
    },

    editTopic(topic) {
      console.log("topic:", topic);
      this.isModalVisible = !this.isModalVisible;
      this.topicToEdit._id = topic._id;
      this.topicToEdit.name = topic.name;
    },

    updateTopic(id) {
      console.log("id:", id);
      return this.$store.dispatch(`topic/editTopic`, id)
      .then(() => {
        this.isModalVisible = false;
        this.getAllTopics();
      });
    },

    getAllTopics() {
      return this.$store.dispatch("topic/allTopic").then((res) => {
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

     //Modal Logic
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    }
  },

  mounted() {
    this.getAllTopics();
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
</style>
