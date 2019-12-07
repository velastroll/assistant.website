<template>
  <b-row style="margin: 0 0 0 0; height: 100%;">
    <b-col style="padding: 0 0 0 0;">
      <GlobalMap :msg="devices"/>
    </b-col>
  </b-row>
</template>

<script>
/* eslint-disable */
// @ is an alias to /src
import { mapGetters, mapMutations } from "vuex";
import GlobalMap from "@/components/maps/GlobalMap";
export default {
  name: "Maps",
  components: {
    GlobalMap
  },
  data: function() {
    return {
      devices: [], // updated vehicle
      timer: ""
    };
  },
  mounted() {
      this.updateDevices()
  },
  methods: {
    updateDevices: function() {
      this.$store.dispatch("device/retrieve").then(r => {
        if (r.status == 200) {
          this.devices = this.$store.getters["device/get"];
        } else {
          this.$parent.redirect('/')
        }
      });
    },
    parseDate(seconds) {
      var d = new Date(seconds);
      var month = d.getMonth() + 1;
      if (month.length < 10) month = "0" + month;
      var day = d.getDate();
      if (day < 10) day = "0" + day;
      var hours = d.getHours();
      if (hours < 10) hours = "0" + hours;
      var minutes = d.getMinutes();
      if (minutes < 10) minutes = "0" + minutes;
      var seconds = d.getSeconds();
      if (seconds < 10) seconds = "0" + seconds;
      return `${d.getFullYear()}/${month}/${day} - ${hours}:${minutes}:${seconds}`;
    },
    markAsRead: function(alert) {
      // the identifier of the alert is it own timestamp.
      this.$store.dispatch("vehicle/read", alert).then(res => {
        if (res.status == 200) {
          this.alerts = this.$store.getters["vehicle/alerts"];
        } else if (r.status == 500) {
          this.$parent.makeToast("danger", `Error ${r.status}`, r.description);
        } else {
          this.$parent.makeToast("danger", `Oups ${r.status}`, r.description);
          // delete tokens
        }
      }); // end dispatch.then()
    },
    makeToast: function(type, title, content) {
      this.$parent.makeToast(type, title, content);
    }
  }
};
</script>