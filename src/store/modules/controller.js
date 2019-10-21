import Axios from "axios";

/* eslint-disable no-alert, no-console */
let api = "http://localhost:8082";
export default {
  // data access variables
  state: {},

  //  this.$store.getters.ACCESS_TOKEN
  getters: {},

  // mutations are sync, so call to wait before it
  mutations: {},

  // this.$store.dispatch("SET_NAME", your_name)
  actions: {
    API_LOGIN(context, payload) {
      return new Promise(resolve => {
        Axios({
          method: "post",
          url: api + "/auth/login",
          headers: {
            "Content-Type": "application/json"
          },
          data: payload 
        })
          .then(res => {
            resolve(res);
          })
          .catch(e => {
            if (e) {
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
