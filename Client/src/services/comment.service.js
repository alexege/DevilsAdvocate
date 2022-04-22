import axios from "axios";

const API_URL = "http://localhost:8080/api/comment/";

class CommentService {
  allComments() {
    return axios
      .get(API_URL + "allComments")
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  addComment(data) {
    const user = JSON.parse(localStorage.getItem("user"));
    
    return axios
      .post(API_URL + "addComment", {
        topicId: data.topicId,
        body: data.body,
        author: user.id,
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err;
      });
  }

  editComment(comment) {
    return axios
      .post(API_URL + `editComment/${comment._id}`, {
        body: comment.body,
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  deleteComment(id) {
    return axios
      .delete(API_URL + `deleteComment/${id}`, { data: id })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
  
  likeComment(comment) {
    console.log("comment:", comment.comment._id);
    return axios.post(API_URL + `likeComment/${comment.comment._id}`, {
      comment: comment,
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  }
  
  dislikeComment(comment) {
    return axios.post(API_URL + `dislikeComment/${comment._id}`, {
      comment: comment,
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  }

  allVotes() {
    return axios
      .get(API_URL + "allVotes")
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
}

export default new CommentService();
