// import Topic from "../../../Server/models/topic.model";
import TopicService from "../services/topic.service";

export const topic = {
    namespaced: true,
    state: () => ({
        topic: {}
    }),

    actions: {
        addTopic({ commit }, topic) {
            return TopicService.addTopic(topic)
            .then(topic => {
                commit('addTopicSuccess', topic);
                return Promise.resolve(topic);
            },
            error => {
                commit('addTopicFailure', topic);
                return Promise.reject(error);
            })
        },

        editTopic({ commit }, topic) {
            return TopicService.editTopic(topic)
            .then(topic => {
                commit('editTopicSuccess', topic);
                return Promise.resolve(topic);
            },
            error => {
                commit('editTopicFailure', topic);
                return Promise.reject(error);
            });
        },

        deleteTopic({ commit }, topic) {
            return TopicService.deleteTopic(topic)
            .then(topic => {
                commit('deleteTopicSuccess', topic);
                return Promise.resolve(topic);
            },
            error => {
                commit('deleteTopicFailure', topic);
                return Promise.reject(error);
            });
        },

        allTopics({ commit }, topic) {
            return TopicService.getAllTopics()
            .then(topics => {
                commit('getAllTopicSuccess', topic);
                return Promise.resolve(topics);
            },
            error => {
                commit('getAllTopicFailure', topic);
                return Promise.reject(error);
            });
        },
    },

    mutations: {
        addTopicSuccess(
            // state, topic
            ) {
            // console.log("state: ", state);
            // console.log("topic: ", topic);
            // state.topic = topic;
        },
        addTopicFailure(
            // state, topic
            ) {
            // console.log("state: ", state);
            // console.log("topic: ", topic);
            // state.topic = topic;
        },
        editTopicSuccess(
            // state, topic
            ) {
            // console.log("state: ", state);
            // console.log("topic: ", topic);
            // state.topic = topic;
        },
        editTopicFailure(
            // state, topic
            ) {
            // console.log("state: ", state);
            // console.log("topic: ", topic);
            // state.topic = topic;
        },
        deleteTopicSuccess(
            // state, topic
            ) {
            // console.log("state: ", state);
            // console.log("topic: ", topic);
            // state.topic = topic;
        },
        deleteTopicFailure(
            // state, topic
            ) {
            // console.log("state: ", state);
            // console.log("topic: ", topic);
            // state.topic = topic;
        },
        getAllTopicSuccess(
            // state, topic
            ) {
            // console.log("state: ", state);
            // console.log("topic: ", topic);
            // state.topic = topic;
        },
        getAllTopicFailure(
            // state, topic
            ) {
            // console.log("state: ", state);
            // console.log("topic: ", topic);
            // state.topic = topic;
        },
    }
}