<template>
    <div 
    class="body-home"
    style=" width: 100%; height: 100%; margin: 0 0 0 0; padding: 0 0 0 0;">
      <b-row class="justify-content-center">
        <b-col 
          cols="6"
          style="min-width: 270px; max-width: 140px; margin-top: 10px; "
          md="auto"
         :key="k" v-for="(p, k) in this.devices" class="justify-content-center">
          <Slot :msg="p"/>
        </b-col>
      </b-row>
    </div>
</template>
<script>
// @ is an alias to /src
// import Struct from '@/components/Struct.vue'
import {mapGetters, mapActions, mapMutations} from "vuex";

import Slot from "@/components/home/Slot"

export default {
  name: 'home',
  components: {
    Slot
  },
  data: function(){
    return {
      timer: '',
      devices: this.$store.getters["devices/get"]
    }
  },
  mounted() {
    if (this.$store.getters["auth/access_token"] != null) {
      this.updateDevices();
      this.timer = setInterval(() => {
        this.updateDevices();
      }, 15000);
    } else this.$parent.redirect("/login")
  },
  beforeDestroy(){
    clearInterval(this.timer)
  },
  methods: {
    updateDevices: function() {
      if (this.$store.getters["auth/access_token"] != null) {
        this.$store.dispatch("device/retrieve").then(r => {
          if (r.status == 200) {
            this.devices = this.$store.getters["device/get"];
          } else if (r.status == 401) {
            // trying to refresh token
            this.$store.dispatch("auth/refreshTokens").then(r => {
              if (r.status == 200) {
                console.log("Updating tokens...");
                this.$store.commit("auth/updateAccessToken", r.data.access_token);
                this.$store.commit("auth/updateRefreshToken", r.data.refresh_token);
              } else if (r.status == 401) {
                this.$parent.makeToast("danger",`Error ${r.status}`, "You should login again");
                // delete tokens
                this.$store.commit("auth/clearTokens");
                this.$store.commit("device/clear");
                this.$parent.redirect("/login");
              } else if (r.status == 500) {
                this.$parent.makeToast("danger",`Error ${r.status}`,r.description);
                // delete tokens
                this.$store.commit("auth/clearTokens");
                this.$store.commit("device/clear");
                this.$parent.redirect("/login");
              } else {
                this.$parent.makeToast("danger",`Oups ${r.status}`,"Server is down.");
                // delete tokens
                this.$store.commit("auth/clearTokens");
                this.$store.commit("device/clear");
                this.$parent.redirect("/login");
              }
            });
          } else if (r.status == 404){
            console.log("Server is down")
          }
        });
      }
    }
  },
  computed: {
    ...mapGetters(["device/get"]),
    ...mapActions(["device/retrieve"]),
    ...mapMutations(["auth/updateAccessToken", "auth/updateRefreshToken", "auth/clearTokens", "device/clear"])
  }
}
</script>

<style scoped>
 .body-home{
  background-color: #f2f2f2;
}
</style>
