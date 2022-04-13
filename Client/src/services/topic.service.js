import axios from 'axios';
// import { topic } from '../../../Server/models';

const API_URL = 'http://localhost:8080/api/topic/';

class TopicService {
  getAllTopics() {
    return axios.get(API_URL + 'allTopics')
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
      description: topic.description,
      author: user.id
    })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    })
  }

  editTopic(topic) {
    return axios.post(API_URL + `editTopic/${topic._id}`, {
        name: topic.name,
        description: topic.description
    })
    .then(res => {
        return res;
    })
    .catch(err => {
        return err;
    })
}

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