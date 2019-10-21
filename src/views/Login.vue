<template>
  <div class="body-login">
    <b-card class="body-login">
      <b-col>
        <b-row class="justify-content-center">
          <!-- login form -->
          <b-card class="login-form">
            <!-- Title -->
            <span class="login-title">🧠</span>
            <hr />
            <div class="login-input-title">USER</div>
            <b-input v-model="usr"></b-input>
            <div class="login-input-title">PASSWORD</div>
            <b-input v-model="psswd" :type="'password'"></b-input>
            <b-button variant="success" class="login-button" @click="login()">log in</b-button>
          </b-card>
        </b-row>
      </b-col>
    </b-card>
  </div>
</template>

<script>
/* eslint-disable no-alert, no-console */

export default {
  name: "Login",
  props: {},
  created() {},
  data: function() {
    return {
      usr: "",
      psswd: ""
    };
  },
  methods: {
    makeToast(variant = null, title, content) {
      this.$bvToast.toast(content, {
        title: title,
        variant: variant,
        solid: true
      });
    },
    login: function() {
      if (this.usr.length < 3) {
        this.makeToast("primary", "Oups!", `Please, insert a valid user.`);
      } else if (this.psswd.length < 3) {
        this.makeToast("primary", "Oups!", `Please, insert a valid password.`);
      } else {
        this.$store
          .dispatch("API_LOGIN", { username: this.usr, password: this.psswd })
          .then(r => {
            if (r.status == 200) {
              // save the token in local storage
              localStorage.auth = "Basic " + r.data
              this.$router.push("/");
            } else {
              this.makeToast(
                "danger",
                "Oups!",
                `[${r.status}] ${r.description}`
              );
            }
          });
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.body-login {
  background-color: #2c3e50;
  border-color: #2c3e50;
  color: darkslategrey;
}
.login-form {
  color: darkslategrey;
  margin-top: 20vh;
}
.login-title {
  color: darkslategrey;
  font-weight: bold;
  font-size: 2em;
  text-transform: uppercase;
}

.login-input-title {
  margin-top: 15px;
  text-align: center;
  text-transform: uppercase;
  font-weight: bold;
  color: darkslategrey;
}

.login-button {
  min-width: 100%;
  margin-top: 20px;
  text-transform: uppercase;
  color: white;
  background-color: #2c3e50;
  border-color: #2c3e50;
}

.login-button:focus {
  background-color: rgb(18, 110, 83);
}
</style>
