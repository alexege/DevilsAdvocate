import api from './api';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/topic/';

class TopicService {
  getAllTopics() {
    return api.get('/topic/all');
  }

  addTopic(topic) {
    //   return api.post('/topic/addTopic');
    // const user = JSON.parse(localStorage.getItem('user'));

    return axios.post(API_URL + 'addTopic', {
        name: topic.name,
        // author: user.id
    })
    .then(res => {
        return res.data;
    })
    .then(err => {
        return err;
    })
  }
}

export default new TopicService();