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
            return new Promise(resolve => {
                Axios({
                    method: "get",
                    url: "worker/devices",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(response => {
                        context.commit("updateDevice", response.data);
                        resolve(response);
                    })
                    .catch(e => {
                        Promise.reject(e)
                    });
            });
        }
    }
};