<template>
  <div class="body-home" style=" width: 100%; height: 100%; margin: 0 0 0 0; padding: 0 0 0 0;">
    <b-row class="justify-content-center">
      <b-col
        cols="12"
        style="min-width: 90%; max-width: 90%; margin-top: 10px; "
        md="auto"
        class="justify-content-center"
      >
        <!-- options -->
        <b-row>
          <div class="container-input-search">
            <b-input class="input-search" placeholder="Search by name, nif, town, or device..." />
          </div>
          <div class="container-add-user-button">
            <b-button class="add-user-button" v-b-modal.modal-add-user>Añadir usuario</b-button>
          </div>
        </b-row>
        <!-- table -->
        <b-row class="header-table">
          <b-col>NOMBRE</b-col>
          <b-col class="smart-screen">NIF</b-col>
          <b-col>CIUDAD</b-col>
          <b-col>DISPOSITIVO</b-col>
        </b-row>
        <div :key="i" v-for="(u, i) in this.users">
          <b-row v-if="u != null" class="row-table" align-v="center" @click="redirect(`/stats?u=${u.nif}`)">
            <b-col>{{u.name}} {{u.surname}}</b-col>
            <b-col class="smart-screen">{{u.nif}}</b-col>
            <b-col v-if="existLocation(u.postcode) != null">{{existLocation(u.postcode).name}}</b-col>
            <b-col>{{getDevice(u.nif)}}</b-col>
          </b-row>
        </div>
      </b-col>
    </b-row>

    <!-- modal: Add User -->
    <AddUser />
  </div>
</template>

<script>
// @ is an alias to /src
import AddUser from "@/components/AddUser.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "Users",
  components: {
    AddUser
  },

  data: function() {
    return {
      users: this.$store.getters["users/get"],
      provinces: this.$store.getters["provinces/get"]
    };
  },
  mounted() {
    if (sessionStorage.getItem("access_token") != null) {
      this.updateProvinces();
      this.updateUsers();
    } else {
      this.$parent.redirect("/login");
    }
  },
  methods: {
    redirect(url){
      this.$parent.redirect(url)
    },
    updateUsers: function() {
      this.$store.dispatch("users/retrieve").then(r => {
        if (r.status == 200) {
          this.users = this.$store.getters["users/get"];
        } else {
          this.$parent.makeToast("danger", `Error ${r.status}`, r.description);
        }
      });
    },
    updateProvinces() {
      this.$store.dispatch("provinces/retrieve").then(r => {
        if (r.status == 200) {
          this.provinces = this.$store.getters["provinces/get"];
        } else {
          this.$parent.makeToast("danger", `Oups ${r.status}`, r.description);
        }
      });
    },
    makeToast(a, b, c) {
      this.$parent.makeToast(a, b, c);
    },
    existLocation(postcode) {
      for (var p in this.provinces) {
        for (var l in this.provinces[p].locations) {
          if (this.provinces[p].locations[l].postcode == postcode) {
            return this.provinces[p].locations[l];
          }
        }
      }
      return null;
    },
    getDevice(dni) {

      for (var p in this.provinces) {
        for (var l in this.provinces[p].locations) {
          for (var s in this.provinces[p].locations[l].people) {
            if (this.provinces[p].locations[l].people[s].nif == dni) {
              if (this.provinces[p].locations[l].people[s].relation != null) {
                return this.provinces[p].locations[l].people[s].relation.device;
              }
            }
          }
        }
      }
      return null;
    }
  },
  computed: {
    ...mapGetters(["users/get"]),
    ...mapActions(["users/retrieve"]),
    ...mapMutations([
      "auth/updateAccessToken",
      "auth/updateRefreshToken",
      "auth/clearTokens",
      "users/clear"
    ])
  }
};
</script>

<style scoped>
div.container-add-user-button {
  width: 150px;
}

div.container-input-search {
  width: calc(100% - 150px);
}

.smart-screen {
  display: inline;
}

@media only screen and (max-width: 650px) {
  .smart-screen {
    display: none;
  }

  div.container-add-user-button {
    width: 100%;
  }

  div.container-input-search {
    width: 100%;
  }
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
  cursor: pointer;
}
.row-table:hover {
  background-color: #2c3e5011;
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
