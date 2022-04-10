<template>
  <div class="container">
    <header class="jumbotron">

      <div v-for="topic in allTopics" :key="topic._id">
        [{{ topic.name }}]
      </div>

      <h3>
        <pre>{{allTopics}}</pre>
      </h3>

      <!-- Add Topic -->
      <div>
        <input type="text" v-model="topic.name" placeholder="Topic">
        <input type="submit" value="Submit" @click="addTopic">
      </div>

    </header>
  </div>
</template>

<script>
// import UserService from '../services/user.service';
import TopicService from '../services/topic.service';

export default {
  name: 'Dashboard',
  data() {
    return {
      allTopics: '',
      topic: {
        name: null
      }
    };
  },

  methods:{
    addTopic() {
      return this.$store.dispatch('topic/addTopic', this.topic)
      .then(() => {
        this.topic.name = '';
        TopicService.getAllTopics();
      })
    }
  },

  mounted() {
    TopicService.getAllTopics().then(
      response => {
        this.allTopics = response.data;
      },
      error => {
        this.allTopics =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
      }
    );

    // UserService.getPublicContent().then(
    //   response => {
    //     this.content = response.data;
    //   },
    //   error => {
    //     this.content =
    //       (error.response && error.response.data && error.response.data.message) ||
    //       error.message ||
    //       error.toString();
    //   }
    // );

  }
};
</script>

<style scoped>
  .jumbotron {
    background-color: white;
    min-height: 100vh;
    height: 100%;
  }
</style>