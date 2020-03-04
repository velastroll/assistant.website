import Axios from "axios";

export default {
    state: {
        events: []
    },
    getters: {
        // this.$store.getters["getData"]
        getEvents: state => {
            return state.events;
        }
    },
    mutations: {
        updateEvents: (state, value) => {
            state.events = value;
        },
        clear: (state) => {
            state.events = []
        }
    },
    actions: {
        // this.$store.dispatch["doXYZ"]
        getEvents(context) {
            return new Promise(resolve => {
                Axios({
                    method: "get",
                    url: "worker/events",
                })
                    .then(response => {
                        context.commit("updateEvents", response.data);
                        resolve(response);
                    })
                    .catch(e => {
                        Promise.reject(e)
                    });
            });
        },
        new(context, payload) {
            return new Promise(resolve => {
                Axios({
                    method: "post",
                    url: "worker/tasks",
                    data: payload
                })
                    .then(response => {
                        resolve(response);
                    })
                    .catch(e => {
                        resolve(
                            {status : 500, data: e}
                        )
                    });
            });
        }
    }
};