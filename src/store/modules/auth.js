import Axios from "axios";

export default {
  state: {
  },
  getters: {
    // this.$store.getters["getData"]
  },
  mutations: {
  },
  actions: {
    // this.$store.dispatch["doXYZ"]
    login(context, credentials) {
      return new Promise(resolve => {
        Axios.post("worker/login", {
          user: credentials.username,
          password: credentials.password
        })
          .then(response => {
            localStorage.access_token = response.data.access_token
            localStorage.refresh_token = response.data.refresh_token
            resolve(response);
          })
          .catch(e => {
            Promise.reject(e)
          });
      });
    },
    refreshTokens(context) {
      var api = context.rootGetters["common/api"]
      return new Promise(resolve => {
        Axios.post(api + "/auth/refreshtoken", {
          // form
          refresh_token: context.getters["refresh_token"]
        })
          .then(response => {
            resolve(response);
          })
          .catch(e => {
           Promise.reject(e)
          });
      });
    }
  }
};