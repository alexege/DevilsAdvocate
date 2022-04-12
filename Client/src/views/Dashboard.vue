<template>
  <div class="container">
    <confirm-dialog ref="confirmDialog"></confirm-dialog>
    <header class="jumbotron">
      <div v-for="topic in allTopics" :key="topic._id" class="topic">
        {{ topic.name }}
        <a href="#" @click="deleteTopic(topic._id)">Delete</a>
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

export default {
  name: "Dashboard",
  components: { ConfirmDialog },
  data() {
    return {
      allTopics: null,
      topic: {
        name: null,
      },
    };
  },

  methods: {
    // addTopic() {
    //   return this.$store
    //     .dispatch("topic/addTopic", this.topic)
    //     .then(res => {
    //       console.log("response: ", res);
    //       this.getAllTopics();
    //       this.topic.name = "";
    //       // this.getAllTopics();
    //     })
    //     .catch((err) => {
    //       console.log("errror: ", err);
    //       return err;
    //     });
    // },

    addTopic() {
      return this.$store.dispatch("topic/addTopic", this.topic).then(() => {
        this.topic.name = "";
        this.getAllTopics();
      });
    },

    getAllTopics() {
      console.log("Getting all topics");
      return this.$store.dispatch("topic/allTopic").then((res) => {
        console.log("response: ", res);
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
