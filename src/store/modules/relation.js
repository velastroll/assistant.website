import Axios from "axios";

export default {
    actions: {
        // this.$store.dispatch["doXYZ"]
        new(context, payload) {
            return new Promise(resolve => {
                Axios({
                    method: "post",
                    url: "worker/relation",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: {
                        nif: payload.nif,
                        device: payload.device
                    }
                })
                    .then(response => {
                        resolve(response);
                    })
                    .catch(e => {
                        resolve({status: 500, data: e})
                    });
            });
        },
        delete(context, payload) {
            return new Promise(resolve => {
                Axios({
                    method: "delete",
                    url: "worker/relation/" + payload.device,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: {
                        nif: payload.nif,
                        device: payload.device
                    }
                })
                    .then(response => {
                        resolve(response);
                    })
                    .catch(e => {
                        resolve({status: 500, data: e})
                    });
            });
        }
    }
};