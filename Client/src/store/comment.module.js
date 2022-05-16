import CommentService from "../services/comment.service";

export const comment = {
    namespaced: true,
    state: () => ({
        allTopics: [],
        allComments: [],
        allVotes: []
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

        allComments({ commit }, allComment) {
            return CommentService.allComments()
            .then(comments => {
                commit('allCommentsSuccess', allComment);
                return Promise.resolve(comments);
            },
            error => {
                commit('allCommentsFailure', allComment);
                return Promise.reject(error);
            });
        },

        likeComment({ commit }, comment) {
            return CommentService.likeComment(comment)
            .then(comments => {
                commit('likeCommentSuccess', comment);
                return Promise.resolve(comments);
            },
            error => {
                commit('likeCommentFailure', comment);
                return Promise.reject(error);
            })
        },

        dislikeComment({ commit }, comment) {
            return CommentService.dislikeComment(comment)
            .then(comments => {
                commit('dislikeCommentSuccess', comment);
                return Promise.resolve(comments);
            },
            error => {
                commit('dislikeCommentFailure', comment);
                return Promise.reject(error);
            })
        },
        
        getTopAgree({ commit }, topicId) {
            return CommentService.getTopAgree(topicId)
            .then(comment => {
                commit('getTopAgreeSuccess', topicId);
                return Promise.resolve(comment);
            },
            error => {
                commit('getTopAgreeFailure', topicId);
                return Promise.reject(error);
            })
        },
        
        getTopDisagree({ commit }, comment) {
            return CommentService.getTopDisagree(comment)
            .then(comments => {
                commit('getTopDisagreeSuccess', comment);
                return Promise.resolve(comments);
            },
            error => {
                commit('getTopDisagreeFailure', comment);
                return Promise.reject(error);
            })
        },
        
        getTopAlt({ commit }, comment) {
            return CommentService.getTopAlt(comment)
            .then(comments => {
                commit('getTopAltSuccess', comment);
                return Promise.resolve(comments);
            },
            error => {
                commit('getTopAltFailure', comment);
                return Promise.reject(error);
            })
        },
        
        // getTopAgree({ commit }, comment) {
        //     return CommentService.dislikeComment(comment)
        //     .then(comments => {
        //         commit('getTopAgreeSuccess', comment);
        //         return Promise.resolve(comments);
        //     },
        //     error => {
        //         commit('getTopAgreeFailure', comment);
        //         return Promise.reject(error);
        //     })
        // },
    },

    mutations: {
        addCommentSuccess(
            // state, comment
            ) {
            // state.allComments.push(comment);
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
        allCommentsSuccess(state, comments) {
            state.allComments = comments;
        },
        allCommentsFailure(
            // state, topic
            ) {
            // console.log("state: ", state);
            // console.log("topic: ", topic);
        },
        likeCommentSuccess() {

        },
        likeCommentFailure() {

        },
        dislikeCommentSuccess() {

        },
        dislikeCommentFailure() {

        },
        getTopAgreeSuccess() {
            
        },
        getTopAgreeFailure() {

        },
        getTopDisagreeSuccess() {
            
        },
        getTopDisagreeFailure() {

        },
        getTopAltSuccess() {
            
        },
        getTopAltFailure() {

        }
    }
}

