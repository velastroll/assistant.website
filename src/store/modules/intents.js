import Axios from "axios";
import { isContext } from "vm";

export default {
    state: {
        intents: []
    },
    getters: {
        // this.$store.getters["getData"]
        getIntents: state => {
            return state.intents;
        },
        /**
         * Returns an object which keys are the different intents, and the value is the amount of times which were done.
         */
        intentNumber: state => {
            let map = {}
            state.intents.forEach(it => {
                let name = it.data.intentName
                if (map[name] == null || map[name] == undefined) map[name] = 1
                else map[name] += 1
            })
            return map
        },
        /**
         * Returns an object which keys are the hours of the day, and the value is the amount of intents which were done at these hours.
         */
        intentHour: state => {
            let hours = {}
            state.intents.forEach(it => {
                let h = it.datetime.substring(11, 13)
                if (hours[h] == null || hours[h] == undefined) hours[h] = 1
                else hours[h] += 1
            })
            return hours
        }
    },
    mutations: {
        update: (state, value) => {
            state.intents = value;
        },
        clear: (state) => {
            state.intents = []
        }
    },
    actions: {
        // this.$store.dispatch["doXYZ"]
        get(context, payload) {
            return new Promise(resolve => {
                Axios({
                    method: "post",
                    url: "worker/devices/" + payload.device + "/intents",
                    data: payload.interval,
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(response => {
                        context.commit("clear");
                        context.commit("update", response.data);
                        resolve({status : 200, data : response.data});
                    })
                    .catch(e => {
                        let mock = [{
                            datetime : "2020-01-17T10:00:00.000000Z",
                            data : {
                                intentName : "Contacto"
                            }
                        }, {
                            datetime : "2020-01-17T10:50:00.000000Z",
                            data : {
                                intentName : "Sintacto"
                            }
                        }, {
                            datetime : "2020-01-17T11:40:00.000000Z",
                            data : {
                                intentName : "Contacto"
                            }
                        }]

                        resolve({ status : 200, data : mock })
                    });
            });
        },
        new(context, payload) {
            return new Promise(resolve => {
                Axios({
                    method: "post",
                    url: "worker/task",
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