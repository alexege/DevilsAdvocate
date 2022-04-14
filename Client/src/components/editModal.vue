<template>
  <div>
    <div class="background" @click.self="close">
      <div class="content">
        <h4>Edit Topic</h4>
        <label for="">Title:</label><br />
        <input type="text" v-model="topicToEdit.name" /> <br />
        <label for="">Description:</label><br />
        <textarea
          name="topicToEditBody"
          id=""
          cols="80"
          rows="10"
          v-model="topicToEdit.description"
        ></textarea
        ><br />
        <input
          type="button"
          value="Update"
          @click="updateTopic(topicToEdit)"
        />
        <button type="button" class="btn-close" @click.prevent="close">x</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'EditTopicModal',
  props: ['topicToEdit'],
  data() {
    return {};
  },
  methods: {
    close() {
      this.$emit('close');
    },

    updateTopic(topic) {
      this.$emit('update-topic', topic);
    }
  }
};
</script>
<style scoped>
.btn-close {
  position: absolute;
  top: 10px;
  right: 10px;
}

.background {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999;
}

.content {
  position: relative;
  min-width: 800px;
  min-height: 400px;
  border: 2px solid black;
  border-radius: 10px;
  padding: 1em;
  /* background-color: rgba(255, 255, 255, 0.75); */
  color: black;
  font-weight: 500;
  background-color: rgba(255, 255, 255, 0.8);
  text-align: center;
}
</style>
