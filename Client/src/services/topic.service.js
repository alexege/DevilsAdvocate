import axios from 'axios';

const API_URL = 'http://localhost:8080/api/topic/';

class TopicService {
  getAllTopics() {
    return axios.get(API_URL + 'all')
    .then(res => {
      return res;
    })
    .catch(err => {
      return err;
    })
  }

  addTopic(topic) {
    const user = JSON.parse(localStorage.getItem('user'));

    return axios.post(API_URL + 'addTopic', {
      name: topic.name,
      author: user.id
    })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    })
  }

  // addTopic(topic) {
  //   const user = JSON.parse(localStorage.getItem('user'));

  //   return axios.post(API_URL + 'addTopic', {
  //       name: topic.name,
  //       author: user.id
  //   })
  //   .then(res => {
  //     console.log("[service] res:", res);
  //       return res.data;
  //   })
  //   .then(err => {
  //       return err;
  //   })
  // }

  deleteTopic(id) {
    return axios.delete(API_URL + `delete/${id}`, { data: id })
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        })
  }
}

export default new TopicService();