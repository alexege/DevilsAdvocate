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

        deleteTopic({ commit }, message) {
            return TopicService.deleteTopic(message)
            .then(message => {
                commit('deleteTopicSuccess', message);
                return Promise.resolve(message);
            },
            error => {
                commit('deleteTopicFailure', message);
                return Promise.reject(error);
            });
        },

        allTopic({ commit }, message) {
            return TopicService.getAllTopics()
            .then(topics => {
                commit('getAllTopicSuccess', message);
                return Promise.resolve(topics);
            },
            error => {
                commit('getAllTopicFailure', message);
                return Promise.reject(error);
            });
        }
    },

    mutations: {
        addTopicSuccess(state, topic) {
            console.log("state: ", state);
            console.log("topic: ", topic);
            // state.topic = topic;
        },
        addTopicFailure(state, topic) {
            console.log("state: ", state);
            console.log("topic: ", topic);
            // state.topic = topic;
        },
        editTopicSuccess(state, topic) {
            console.log("state: ", state);
            console.log("topic: ", topic);
            // state.topic = topic;
        },
        editTopicFailure(state, topic) {
            console.log("state: ", state);
            console.log("topic: ", topic);
            // state.topic = topic;
        },
        deleteTopicSuccess(state, topic) {
            console.log("state: ", state);
            console.log("topic: ", topic);
            // state.topic = topic;
        },
        deleteTopicFailure(state, topic) {
            console.log("state: ", state);
            console.log("topic: ", topic);
            // state.topic = topic;
        },
        getAllTopicSuccess(state, topic) {
            console.log("state: ", state);
            console.log("topic: ", topic);
            // state.topic = topic;
        },
        getAllTopicFailure(state, topic) {
            console.log("state: ", state);
            console.log("topic: ", topic);
            // state.topic = topic;
        },
    }
}