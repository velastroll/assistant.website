import Axios from "axios";

export default {
    state: {
        users: []
    },
    getters: {
        // this.$store.getters["getData"]
        get: state => {
            return state.users;
        }
    },
    mutations: {
        updateUsers: (state, value) => {
            state.users = value;
        },
        clear: (state) => {
            state.users = []
        },
        addUser: (state, value) => {
            state.users.unshift(value)
        }
    },
    actions: {
        // this.$store.dispatch["doXYZ"]
        retrieve(context) {
            return new Promise(resolve => {
                Axios({
                    method: "get",
                    url: "worker/people",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(response => {
                        context.commit("updateUsers", response.data);
                        resolve(response);
                    })
                    .catch(e => {
                        Promise.reject(e)
                    });
            });
        },

        add(context, payload){
            return new Promise(resolve => {
                Axios({
                    method: "post",
                    url: "worker/person",
                    data: payload,
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(response => {
                        resolve({status:200});
                    })
                    .catch(e => {
                        resolve({status:500});
                    });
            });
        },

        get(context, payload){
            return new Promise(resolve => {
                Axios({
                    method: "get",
                    url: "worker/person",
                    data: payload,
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(response => {
                        resolve({status:200});
                    })
                    .catch(e => {
                        resolve({status:500});
                    });
            });
        }
    }
};