  
import Axios from "axios";
export default {
    state: {
    },
    getters: { // this.$store.getters["getData"]
    }, 
    mutations: {
    },
    actions: { // this.$store.dispatch["doXYZ"]
        get(context, payload){
            return new Promise(resolve => {
                Axios({
                    method: "get",
                    url: "worker/confs/" + payload.device,
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(response => {
                        resolve(response);
                    })
                    .catch(e => {
                        resolve({status: e.response.status, data: e.response.data})
                    });
            });
        },
        sendConfiguration(context, payload){
            return new Promise(resolve => {
                Axios({
                    method: "post",
                    url: "worker/confs/",
                    data: {
                        device : payload.receiver,
                        body : payload.body
                    }
                })
                    .then(response => {
                        resolve(response);
                    })
                    .catch(e => {
                        resolve({status: e.response.status, data: e.response.data})
                    });
            });
        }
    }
}