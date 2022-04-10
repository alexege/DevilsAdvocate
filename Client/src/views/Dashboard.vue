<template>
  <div class="container">
    <header class="jumbotron">
      <h3>
        <pre>{{content}}</pre>
      </h3>
    </header>
  </div>
</template>

<script>
import UserService from '../services/user.service';

export default {
  name: 'Dashboard',
  data() {
    return {
      content: ''
    };
  },
  mounted() {
    UserService.getPublicContent().then(
      response => {
        this.content = response.data;
      },
      error => {
        this.content =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
      }
    );

  }
};
</script>

<style scoped>
  .jumbotron {
    background-color: white;
  }
</style>