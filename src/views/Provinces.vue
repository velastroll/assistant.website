<template>
  <div class="body-home" style=" width: 100%; height: 100%; margin: 0 0 0 0; padding: 0 0 0 0;">
    <b-row class="justify-content-center">
      <b-col
        cols="12"
        style="min-width: 90%; max-width: 90%; margin-top: 10px; "
        md="auto"
        class="justify-content-center"
      >
        <b-row>
          <b-col>
            <b-input class="input-search" placeholder="Search by name, nif, town, or device..." />
          </b-col>
          <b-col md="auto">
            <b-button class="add-user-button" v-b-modal.modal-add-user>Add user</b-button>
          </b-col>
        </b-row>
        <!--  Header -->
        <b-row class="header-table">
          <b-col>ID</b-col>
          <b-col>Province</b-col>
          <b-col>Towns</b-col>
          <b-col>People</b-col>
          <b-col>Devices</b-col>
        </b-row>
        <!-- provinces -->
        <div :key="'p' + i" v-for="(p, i) in this.provinces">
          <div class="card-province" v-if="p.locations.length > 0">
            <b-row v-b-toggle="'collapse-' + p.code">
              <b-col>{{p.code}}</b-col>
              <b-col>{{p.name}}</b-col>
              <b-col>{{p.locations.length}}</b-col>
              <b-col>{{getUsers(p.locations).length}}</b-col>
              <b-col>{{getDevices(p.locations).length}}</b-col>
            </b-row>
            <!-- Town -->
            <b-collapse :id="'collapse-' + p.code" :accordion="'acc'">
              <div class="card-town" :key="'t'+j" v-for="(l, j) in p.locations">
                <b-row v-b-toggle="'collapse-' + l.postcode">
                  <b-col>{{l.postcode}}</b-col>
                  <b-col>{{l.name}}</b-col>
                  <b-col></b-col>
                  <b-col>{{l.people.length}}</b-col>
                  <b-col>{{getDevicesOfTown(l.people).length}}</b-col>
                </b-row>
                <!-- people -->
                <b-collapse :id="'collapse-' + l.postcode" :accordion="'acc-' + l.postcode">
                  <b-row style="font-weight: bolder;">
                    <b-col>DNI</b-col>
                    <b-col>Name</b-col>
                    <b-col>Device</b-col>
                    <b-col>From</b-col>
                  </b-row>
                  <div :key="'t'+k" v-for="(m, k) in l.people">
                    <div v-if="k.relation != null">
                      <b-row>
                        <b-col>{{m.nif}}</b-col>
                        <b-col>{{m.surname}}, {{m.name}}</b-col>
                        <b-col></b-col>
                        <b-col></b-col>
                      </b-row>
                    </div>
                    <div v-else>
                      <b-row>
                        <b-col>{{m.nif}}</b-col>
                        <b-col>{{m.surname}}, {{m.name}}</b-col>
                        <b-col>{{m.relation.device}}</b-col>
                        <b-col>{{m.relation.from}}</b-col>
                      </b-row>
                    </div>
                  </div>
                </b-collapse>
              </div>
            </b-collapse>
          </div>
        </div>
        <!-- Empty provinces -->
        <div :key="i" v-for="(p, i) in this.provinces">
          <div v-if="p.locations.length == 0">
            <b-row class="row-table">
              <b-col cols="1" style="text-align:right;">[{{p.code}}]</b-col>
              <b-col cols="2" style="text-align:left;">{{p.name}}</b-col>
              <b-col style="text-align: right;">
                <span>No registred data</span>
              </b-col>
            </b-row>
          </div>
        </div>
      </b-col>
    </b-row>

    <!-- modal: Add User >
    <AddUser /-->
  </div>
</template>

<script>
// @ is an alias to /src
// import AddUser from "@/components/AddUser.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "Provinces",
  components: {
    //AddUser
  },

  data: function() {
    return {
      provinces: this.$store.getters["provinces/get"],
      selected: null,
      options: [
        { value: null, text: "Please select an option", disabled: true },
        { value: "a", text: "This is First option" },
        { value: "b", text: "Selected Option" },
        { value: "c", text: "This is an option with object value" }
      ],
      users: [],
      devices: []
    };
  },
  mounted() {
    if (this.$store.getters["auth/access_token"] != null) {
      this.updateProvinces();
    } else {
      console.log("TODO: show this on production.");
      // this.$parent.redirect("/login")
    }
  },
  methods: {
    updateProvinces: function() {
      if (this.$store.getters["auth/access_token"] != null) {
        this.$store.dispatch("provinces/retrieve").then(r => {
          if (r.status == 200) {
            this.provinces = this.$store.getters["provinces/get"];
          } else if (r.status == 401) {
            // trying to refresh token
            this.$store.dispatch("auth/refreshTokens").then(r => {
              if (r.status == 200) {
                this.$store.commit(
                  "auth/updateAccessToken",
                  r.data.access_token
                );
                this.$store.commit(
                  "auth/updateRefreshToken",
                  r.data.refresh_token
                );
              } else if (r.status == 401) {
                this.$parent.makeToast(
                  "danger",
                  `Error ${r.status}`,
                  "You should login again"
                );
                // delete tokens
                this.$store.commit("auth/clearTokens");
                this.$store.commit("provinces/clear");
                this.$parent.redirect("/login");
              }
            });
          } else if (r.status == 500) {
            this.$parent.makeToast(
              "danger",
              `Error ${r.status}`,
              r.description
            );
            // delete tokens
            this.$store.commit("auth/clearTokens");
            this.$store.commit("provinces/clear");
            this.$parent.redirect("/login");
          } else if (r.status == 404) {
            console.log("Server is down");
          } else {
            this.$parent.makeToast(
              "danger",
              `Oups ${r.status}`,
              "Server is down."
            );
            // delete tokens
            this.$store.commit("auth/clearTokens");
            this.$store.commit("provinces/clear");
            this.$parent.redirect("/login");
          }
        });
      }
    },
    makeToast(a, b, c) {
      this.$parent.makeToast(a, b, c);
    },
    bigScreen: function() {
      if (window.innerWidth < 500) return false;
      else return true;
    },
    getUsers(location) {
      var users = [];
      for (var l in location) {
        var pp = location[l].people;
        for (var p in pp) {
          users.push(pp[p]);
        }
      }
      return users;
    },
    getDevices(location) {
      var devices = [];
      for (var l in location) {
        var pp = location[l].people;
        for (var p in pp) {
          if (pp[p].relation != null) devices.push(pp[p]);
        }
      }
      return devices;
    },
    getDevicesOfTown(people) {
      var devices = [];
      for (var p in people) {
        if (people[p].relation != null) devices.push(people[p].relation);
      }
      return devices;
    }
  },
  computed: {
    ...mapGetters(["provinces/get"]),
    ...mapActions(["provinces/retrieve"]),
    ...mapMutations([
      "auth/updateAccessToken",
      "auth/updateRefreshToken",
      "auth/clearTokens",
      "provinces/clear"
    ])
  }
};
</script>

<style scoped>
.center {
  padding: auto;
}
.card-province {
  margin: 5px 0 0 0;
  padding: 0 0 0 0;
  border-top: 1px solid rgba(44, 62, 80, 0.5);
  border-left: 1px solid rgba(44, 62, 80, 0.5);
  border-right: 1px solid rgba(44, 62, 80, 0.5);
  border-bottom: 1px solid rgba(44, 62, 80, 0.5);
  font-weight: bold;
  color: #2c3e50;
  background-color: #ffffff;
  border-radius: 10px;
  cursor: pointer;
}

.card-town {
  margin: 0 0 0 0;
  padding: 0 0 0 0;
  border-top: 1px solid rgba(44, 62, 80, 0.5);
  border-bottom: 1px solid rgba(44, 62, 80, 0.5);
  border-left: 1px solid rgba(44, 62, 80, 0.5);
  border-right: 1px solid rgba(44, 62, 80, 0.5);
  font-weight: normal;
  color: #2c3e50;
  background-color: #ffffff80;
  border-radius: 10px;
  cursor: pointer;
}

.add-user-button {
  padding: 0px 15px 0px 15px;
  height: 30px;
  margin-top: 5px;
  margin-bottom: 10px;
  border-radius: 10px;
  background-color: #2c3e5000;
  color: #2c3e50;
}

.add-user-button:hover {
  background-color: #2c3e50;
  color: #f2f2f2;
}

.input-search {
  margin-top: 5px;
  margin-bottom: 10px;
  height: 30px;
  border-radius: 10px;
}

.row-table {
  border-bottom: 1px solid #303c4727;
}

.header-table {
  font-weight: bolder;
  background-color: #2c3e50;
  color: #f2f2f2;
  border-radius: 10px;
}

.body-home {
  background-color: #f2f2f2;
}
</style>
