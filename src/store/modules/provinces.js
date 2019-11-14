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
                        resolve({status: 200, data: "Actualizado"});
                    })
                    .catch(e => {
                        resolve({status: 500, data: "Algo fue mal"});
                    });
            });
        },
        add(context, payload){
            return new Promise(resolve => {
                Axios({
                    method: "post",
                    url: "worker/towns",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data : payload
                })
                    .then(response => {
                        resolve({status:200, data: response.data});
                    })
                    .catch(e => {
                        resolve({status:409, data: 'This postcode is already in use.'});
                    });
            });
        }
    }
};