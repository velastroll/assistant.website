import Axios from "axios";

export default {
    state: {
        provinces: []
    },
    getters: {
        // this.$store.getters["getData"]
        get: state => {
            return state.provinces;
        }
    },
    mutations: {
        updateProvinces: (state, value) => {
            state.provinces = value;
        },
        clear: (state) => {
            state.users = []
        },
        addProvince: (state, value) => {
            state.provinces.unshift(value)
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
                    url: api + "/worker/towns",
                    headers: {
                        Authorization: access_token,
                        "Content-Type": "application/json"
                    }
                })
                    .then(response => {
                        context.commit("updateProvinces", response.data);
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