import CommentService from "../services/comment.service";

export const comment = {
    namespaced: true,
    state: () => ({
        comment: {}
    }),

    actions: {
        addComment({ commit }, comment) {
            return CommentService.addComment(comment)
            .then(comment => {
                commit('addCommentSuccess', comment);
                return Promise.resolve(comment);
            },
            error => {
                commit('addCommentFailure', comment);
                return Promise.reject(error);
            })
        },

        editComment({ commit }, comment) {
            return CommentService.editComment(comment)
            .then(comment => {
                commit('editCommentSuccess', comment);
                return Promise.resolve(comment);
            },
            error => {
                commit('editCommentFailure', comment);
                return Promise.reject(error);
            });
        },

        deleteComment({ commit }, comment) {
            return CommentService.deleteComment(comment)
            .then(comment => {
                commit('deleteCommentSuccess', comment);
                return Promise.resolve(comment);
            },
            error => {
                commit('deleteCommentFailure', comment);
                return Promise.reject(error);
            });
        },

        allComments({ commit }, comment) {
            return CommentService.allComments()
            .then(topics => {
                commit('allCommentsSuccess', comment);
                return Promise.resolve(topics);
            },
            error => {
                commit('allCommentsFailure', comment);
                return Promise.reject(error);
            });
        }
    },

    mutations: {
        addCommentSuccess(
            // state, topic
            ) {
            // console.log("state: ", state);
            // console.log("topic: ", topic);
        },
        addCommentFailure(
            // state, topic
            ) {
            // console.log("state: ", state);
            // console.log("topic: ", topic);
        },
        editCommentSuccess(
            // state, topic
            ) {
            // console.log("state: ", state);
            // console.log("topic: ", topic);
        },
        editCommentFailure(
            // state, topic
            ) {
            // console.log("state: ", state);
            // console.log("topic: ", topic);
        },
        deleteCommentSuccess(
            // state, topic
            ) {
            // console.log("state: ", state);
            // console.log("topic: ", topic);
        },
        deleteCommentFailure(
            // state, topic
            ) {
            // console.log("state: ", state);
            // console.log("topic: ", topic);
        },
        allCommentsSuccess(
            // state, topic
            ) {
            // console.log("state: ", state);
            // console.log("topic: ", topic);
        },
        allCommentsFailure(
            // state, topic
            ) {
            // console.log("state: ", state);
            // console.log("topic: ", topic);
        },
    }
}

