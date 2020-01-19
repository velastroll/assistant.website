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
            sessionStorage.setItem("access_token", response.data.access_token)
            sessionStorage.setItem("refresh_token", response.data.refresh_token)
            resolve(response);
          })
          .catch(e => {
            resolve(e.response)
          });
      });
    },
    refreshTokens(context) {
      return new Promise(resolve => {
        Axios.post("auth/refreshtoken", {
          refresh_token: sessionStorage.getItem("refresh_token")
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