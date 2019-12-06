<template>
  <div id="app" style="height: 100vh; width: 100vw;">
    <b-row style="margin: 0 0 0 0; padding: 0 0 0 0;">
      <!-- nav bar -->
      <div v-if="isAuth()" style="padding: 0 0 0 0;" class="nav-bar">
        <Nav style="padding: 0 0 0 0; margin: 0 0 0 0;" />
      </div>
      <!-- Reouter view -->
      <div class="content-view">
        <router-view />
      </div>
    </b-row>
  </div>
</template>

<script>
/* eslint-disable */
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
      },
      provinces: []
    };
  },
  methods: {
    updateUsers: function() {
      this.$store.dispatch("users/retrieve").then(r => {
        if (r.status == 200) {
          this.users = this.$store.getters["users/get"];
        } else if (r.status == 500) {
          this.makeToast("danger", `Error ${r.status}`, r.description);
          // delete tokens
          this.$store.commit("auth/clearTokens");
          this.$store.commit("users/clear");
          this.redirect("/login");
        } else if (r.status == 404) {
          console.log("Server is down");
        } else {
          this.makeToast(
            "danger",
            `Oups ${r.status}`,
            "Server is down."
          );
          // delete tokens
          this.$store.commit("auth/clearTokens");
          this.$store.commit("users/clear");
          this.redirect("/login");
        }
      });
    },
    updateProvinces() {
      this.$store.dispatch("provinces/retrieve").then(r => {
        if (r.status == 200) {
          this.provinces = this.$store.getters["provinces/get"];
        } else {
          this.makeToast("danger", `Oups ${r.status}`, r.description);
          // delete tokens
          this.$store.commit("auth/clearTokens");
          this.$store.commit("provinces/clear");
          this.redirect("/login");
        }
      });
    },
    redirect(url) {
      try {
        this.$router.push(url).catch(err => {});
      } catch (e) {}
    },
    isAuth() {
      if (sessionStorage.getItem("access_token") != null) return true;
      else return false;
    },
    isLogged() {
      if (sessionStorage.getItem("access_token") != null) return true;
      else this.redirect("/login");
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
  }
};
</script>

<style lang="scss">
.nav-bar {
  width: 100vw;
  height: 3rem;
  font-size: 1rem;
}
.content-view{
  width: 100vw;
  height: calc(100vh - 3rem);
}

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
