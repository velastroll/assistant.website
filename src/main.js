import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'
import store from './store/index.js'
import router from './router'
import VueAppend from 'vue-append'
import Axios from 'axios'

Vue.use(VueAppend)
Vue.config.productionTip = false
Vue.use(BootstrapVue)

const base = "http://virtual.lab.infor.uva.es:65143/"
Axios.defaults.baseURL = base;

Axios.interceptors.request.use(
  config => {
      const token = sessionStorage["access_token"];
      if (token) {
          config.headers['Authorization'] = token;
      }
      // config.headers['Content-Type'] = 'application/json';
      return config;
  },
  error => {
      Promise.reject(error)
  });



//Add a response interceptor

Axios.interceptors.response.use((response) => {
  return response
}, function (error) {
  const originalRequest = error.config;
  
  /**
   * Server is down
   */
  if (error.response == null) {
    sessionStorage.removeItem("access_token")
    sessionStorage.removeItem("refresh_token")
    router.push('/login');
    return Promise.reject(error);
  }


  /**
   * Cannot log in
   */
  if (originalRequest.url.includes("/login") && error.response.status === 401) {
    return Promise.reject(error);
  }

  /**
   * Cannot refresh token
   */
  if (error.response.status === 401 && originalRequest.url == (base + "auth/refreshtoken")) {
    sessionStorage.removeItem("access_token")
    sessionStorage.removeItem("refresh_token")
    router.push('/login');
    return Promise.reject(error);
  }

  /**
   * Expired token, tries to refresh it.
   */
  if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = sessionStorage.getItem("refresh_token");
      return Axios.post('/auth/refreshtoken',
          {
              "refresh_token": refreshToken
          })
          .then(res => {
              if (res.status === 201) {
                  sessionStorage.setItem("access_token", res.data.access_token);
                  sessionStorage.setItem("refresh_token", res.data.refresh_token);
                  Axios.defaults.headers.common['Authorization'] = sessionStorage.getItem("access_token");
                  return Axios(originalRequest);
              }
          })
  }
  return Promise.reject(error);
});


new Vue({
  router,
  store,
  render: h => h(App),

}).$mount('#app')
