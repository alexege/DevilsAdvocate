import TopicService from "../services/topic.service";

export const topic = {
    namespaced: true,
    state: () => ({
        topic: {}
    }),

    actions: {
        addTopic({ commit }, message) {
            return TopicService.addTopic(message)
            .then(message => {
                commit('addTopicSuccess', message);
                return Promise.resolve(message);
            })
        }
    },

    mutations: {
        addTopicSuccess(state, topic) {
            state.topic = topic;
        },
        addTopicFailure(state, topic) {
            state.topic = topic;
        }
    }
}