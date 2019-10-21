<template>
  <div id="app">
    <div class="header-title">
      <b-col v-if="isLoged()">
        <b-row>
          <b-col cols="1" style="text-align: right;"></b-col>
          <b-col cols="8">
            <div>
              <span :class="header_title_style()" style="cursor:pointer" @click="redirect('/')">
                Assistant
                <a style="color: white">Pregonero</a>
              </span>
            </div>
          </b-col>
          <!--b-col cols="2" style="text-align: right;">
            <span
              to="/somewhere"
              :class="header_title_style()"
              class="edit"
              title="Add new"
              @click="redirect('/somewhere')"
            >+</span>
          </b-col-->
        </b-row>
      </b-col>
    </div>
    <router-view />
  </div>
</template>
<script>
export default {
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  data: function() {
    return {
      window: {
        width: 0,
        height: 0
      }
    };
  },
  methods: {
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    },
    redirect(url) {
      this.$router.push(url);
    },
    isLoged() {
      var uri = window.location.pathname;
        // check local storage for the token
      if (!uri.includes("login")) {
        // if local storage has the token, return true
        if (localStorage.auth) return true;
        // if locar storage hasnt got the token, redirect
        this.redirect("/login");
      }
    },
    header_title_style() {
      if (this.window.width < 587) {
        return "header-title-little";
      } else return "header-title";
    }
  }
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
  min-height: 100vh;
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
