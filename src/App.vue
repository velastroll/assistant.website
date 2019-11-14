<template>
  <div id="app">
    <b-row style="height: 100vh; width: 100vw; margin: 0 0 0 0; padding: 0 0 0 0;">
      <b-col
        v-if="isAuth()"
        :cols="getCols('nav')"
        style="padding: 0px;"
      >
        <Nav style="padding: 0 0 0 0; margin: 0 0 0 0;"/>
      </b-col>
      <b-col 
        :cols="getCols('content')" 
        style="padding: 0px; min-height: 90vh;">
        <router-view/>
      </b-col>
    </b-row>
  </div>
</template>


<script>

import { mapGetters } from "vuex";

import Nav from "@/views/Nav";
export default {
  name: "App",
  components: {
    Nav
  },
  data: function() {
    return {
      window: {
        width: 0,
        height: 0
      }
    };
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    },
    /* eslint-disable */
    redirect(url) {
      try{
        this.$router.push(url).catch(err => {});
      }catch(e){}
    },
    /* eslint-enable */
    isAuth(){
      if  (sessionStorage.getItem("access_token") != null) return true;
      else return false
    },
    isLogged() {
      if(sessionStorage.getItem("access_token") != null) return true;
      else this.redirect("/login");
    },
    getCols(component) {
      var w = window.innerWidth;
      if (w > 650) {
        if (component == 'nav') return "1";
        if (component == 'content') return "";
      } else {
        if (component == 'nav') return "12";
        if (component == 'content') return "12";
      }
    },
    getHeight(c) {
      var w = window.innerWidth;
      if (w > 650) {
        if (c == 'nav') return "100vh";
        if (c == 'content') return "";
      } else {
        if (c == 'nav') return "10vh";
        if (c == 'content') return "";
      }
    },
    header_title_style() {
      if (this.window.width < 587) {
        return "header-title-little";
      } else return "header-title";
    },    
    makeToast(variant = null, title, content) {
      this.$bvToast.toast(content, {
        title: title,
        variant: variant,
        solid: true
      });
    }
  },
  computed: {
    ...mapGetters(["auth/access_token"])
  },
};
</script>

<style lang="scss">
.edit {
  color: lightblue;
  cursor: pointer;
}
.header-title {
  background-color: #2c3e50;
  color: #42b983;
  font-weight: bold;
  text-transform: none;
  font-size: 2rem;
  text-align: left;
  text-decoration: none;
}

.header-title-little {
  background-color: #2c3e50;
  color: #42b983;
  font-weight: bold;
  text-transform: none;
  font-size: 1.2rem;
  text-align: left;
  text-decoration: none;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #2c3e50;
  height: 100vh;
  width: 100vw;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
