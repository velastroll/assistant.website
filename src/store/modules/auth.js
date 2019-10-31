import Axios from "axios";

export default {
  state: {
    accessToken: null,
    refreshToken: null
  },
  getters: {
    // this.$store.getters["getData"]
    access_token: state => {
      return state.accessToken;
    },
    refresh_token:  state => {
      return state.refreshToken;
    },
    tokens:  state => {
      return {
        access_token: state.accessToken,
        refresh_token: state.accessToken
      };
    }
  },
  mutations: {
    updateAccessToken: (state, value) => {
      state.accessToken = value;
    },
    updateRefreshToken: (state, value) => {
      state.refreshToken = value;
    },
    clearTokens: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
    }
  },
  actions: {
    // this.$store.dispatch["doXYZ"]
    login(context, credentials) {
      var api = context.rootGetters["common/api"]
      return new Promise(resolve => {
        Axios.post(api + "/worker/login", {
          user: credentials.username,
          password: credentials.password
        })
          .then(response => {
            console.log(response)
            resolve(response);
          })
          .catch(e => {
            if(!e.response){
              resolve({status: 404})
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
            if(!e.response){
              resolve({status: 404})
            } else if (e.toString().includes("401")) {
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