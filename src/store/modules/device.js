import Axios from "axios";

export default {
    state: {
        devices: []
    },
    getters: {
        // this.$store.getters["getData"]
        get: state => {
            return state.devices;
        }
    },
    mutations: {
        updateDevice: (state, value) => {
            state.devices = value;
        },
        clear: (state) => {
            state.devices = []
        }
    },
    actions: {
        // this.$store.dispatch["doXYZ"]
        retrieve(context) {
            var api = context.rootGetters["common/api"]
            var access_token = context.rootGetters["auth/access_token"];
            return new Promise(resolve => {
                Axios({
                    method: "get",
                    url: api + "/worker/devices",
                    headers: {
                        Authorization: access_token,
                        "Content-Type": "application/json"
                    }
                })
                    .then(response => {
                        context.commit("updateDevice", response.data);
                        resolve(response);
                    })
                    .catch(e => {
                        if (e.toString().includes("Network")) {
                            resolve({ status: 404 })
                        } else if (e.toString().includes("400")) {
                            resolve({
                                status: 401,
                                description: e.response.data
                            });
                        } else if (e.toString().includes("500")) {
                            resolve({
                                status: 500,
                                description: e.response.data
                            });
                        }
                    });
            });
        }
    }
};