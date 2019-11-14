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
                    url: "worker/towns",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(response => {
                        context.commit("updateProvinces", response.data);
                        resolve(response);
                    })
                    .catch(e => {
                        Promise.reject(e)
                    });
            });
        }
    }
};