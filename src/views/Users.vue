<template>
    <div 
    class="body-home"
    style=" width: 100%; height: 100%; margin: 0 0 0 0; padding: 0 0 0 0;">
      <b-row class="justify-content-center">
        <b-col 
          cols="12"
          style="min-width: 90%; max-width: 90%; margin-top: 10px; "
          md="auto" 
          class="justify-content-center">
          <b-row>
            <b-input 
              class="input-search"
              placeholder="Search by name, nif, town, or device..."/>
          </b-row>
          <b-row class="header-table">
            <b-col> NOMBRE </b-col>
            <b-col v-if="bigScreen()"> NIF </b-col>
            <b-col> CIUDAD </b-col>
            <b-col> DISPOSITIVO </b-col>
          </b-row>
          <b-row class="row-table" :key="i" v-for="(u, i) in this.users">
            <b-col> {{u.name}} </b-col>
            <b-col v-if="bigScreen()"> {{u.nif}} </b-col>
            <b-col> {{u.town}} </b-col>
            <b-col> {{u.device}} </b-col>
          </b-row>
        </b-col>
      </b-row>
    </div>
</template>
<script>
// @ is an alias to /src
// import Struct from '@/components/Struct.vue'
import {mapGetters, mapActions, mapMutations} from "vuex";


export default {
  name: 'Users',
  components: {
  },
  data: function(){
    return {
      users: this.$store.getters["users/get"]
    }
  },
  mounted() {
    if (this.$store.getters["auth/access_token"] != null) {
      this.updateUsers();
    } else this.$parent.redirect("/login")
  },
  methods: {
    updateUsers: function() {
      if (this.$store.getters["auth/access_token"] != null) {
        this.$store.dispatch("users/retrieve").then(r => {
          if (r.status == 200) {
            this.users = this.$store.getters["users/get"];
          } else if (r.status == 401) {
            // trying to refresh token
            this.$store.dispatch("auth/refreshTokens").then(r => {
              if (r.status == 200) {
                this.$store.commit("auth/updateAccessToken", r.data.access_token);
                this.$store.commit("auth/updateRefreshToken", r.data.refresh_token);
              } else if (r.status == 401) {
                this.$parent.makeToast("danger",`Error ${r.status}`, "You should login again");
                // delete tokens
                this.$store.commit("auth/clearTokens");
                this.$store.commit("users/clear");
                this.$parent.redirect("/login");
              } else if (r.status == 500) {
                this.$parent.makeToast("danger",`Error ${r.status}`,r.description);
                // delete tokens
                this.$store.commit("auth/clearTokens");
                this.$store.commit("users/clear");
                this.$parent.redirect("/login");
              } else {
                this.$parent.makeToast("danger",`Oups ${r.status}`,"Server is down.");
                // delete tokens
                this.$store.commit("auth/clearTokens");
                this.$store.commit("users/clear");
                this.$parent.redirect("/login");
              }
            });
          } else if (r.status == 404){
            console.log("Server is down")
          }
        });
      }
    },
    bigScreen: function() {
      if(window.innerWidth < 500) return false
      else return true
    }
  },
  computed: {
    ...mapGetters(["users/get"]),
    ...mapActions(["users/retrieve"]),
    ...mapMutations(["auth/updateAccessToken", "auth/updateRefreshToken", "auth/clearTokens", "users/clear"])
  }
}
</script>

<style scoped>
.input-search{
  margin-top: 5px;
  margin-bottom: 10px;
  height: 30px;
  border-radius: 10px;
}

.row-table{
  border-bottom: 1px solid #303c4727;
}

.header-table{
  font-weight: bolder;
  background-color: #2c3e50;
  color: #f2f2f2;
  border-radius: 10px;
}

 .body-home{
  background-color: #f2f2f2;
}
</style>
