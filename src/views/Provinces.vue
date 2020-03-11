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
            <!-- b-input class="input-search" placeholder="Search by name, nif, town, or device..." /-->
          </div>
          <div class="container-add-town-button">
            <b-button class="add-town-button" v-b-modal.modal-add-location>Añadir localidad</b-button>
          </div>
        </b-row>
        <!--  Header -->
        <b-row class="header-table">
          <b-col class="smart-screen">ID</b-col>
          <b-col>Provincia</b-col>
          <b-col class="smart-screen">Localidad</b-col>
          <b-col>Personas</b-col>
          <b-col>Dispositivos
          </b-col>
        </b-row>
        <!-- provinces -->
        <div :key="'p' + i" v-for="(p, i) in this.provinces">
          <div class="card-province" v-if="p.locations.length > 0">
            <b-row v-b-toggle="'collapse-' + p.code">
              <b-col class="smart-screen">{{p.code}}</b-col>
              <b-col>{{p.name}}</b-col>
              <b-col class="smart-screen">{{p.locations.length}}</b-col>
              <b-col>{{getUsers(p.locations).length}}</b-col>
              <b-col>{{getDevices(p.locations).length}}</b-col>
            </b-row>
            <!-- Town -->
            <b-collapse :id="'collapse-' + p.code" :accordion="'acc'">
              <hr />
              <div class="card-town" :key="'t'+j" v-for="(l, j) in p.locations" @click="redirect(`/settings?l=${l.postcode}`)">
                <b-row>
                  <b-col>{{l.postcode}}</b-col>
                  <b-col class="smart-screen">{{l.name}}</b-col>
                  <b-col class="smart-screen"></b-col>
                  <b-col>
                    <a style="font-size: 1rem;">{{l.people.length}}</a>
                    <i class="material-icons reduced-icon">wc</i>
                  </b-col>
                  <b-col>
                    {{getDevicesOfTown(l.people).length}}
                    <i
                      class="material-icons reduced-icon"
                    >settings_remote</i>
                  </b-col>
                </b-row>
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
                <span>No hay datos registrados</span>
              </b-col>
            </b-row>
          </div>
        </div>
      </b-col>
    </b-row>

    <!-- modal -->
    <AddTown :locations="[]" />
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters, mapActions, mapMutations } from "vuex";
import AddTown from "@/components/AddTown";
export default {
  name: "Provinces",
  components: {
    AddTown
  },

  data: function() {
    return {
      provinces: [],
      selected: null,
      options: [
        { value: null, text: "Please select an option", disabled: true },
        { value: "a", text: "This is First option" },
        { value: "b", text: "Selected Option" },
        { value: "c", text: "This is an option with object value" }
      ],
      users: [],
      devices: [],
      town: null
    };
  },
  mounted() {
    if (sessionStorage.getItem("access_token") != null) {
      this.updateProvinces();
    } else {
      this.$parent.redirect("/login");
    }
  },
  methods: {
    updateProvinces: function() {
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
    },
    getProvinceOf(postcode) {
      for (var p in this.provinces) {
        if (this.provinces[p].code == parseInt(postcode / 1000))
          return this.provinces[p].name;
      }
      return "undefined";
    },
    pcInUse(postcode) {
      for (var p in this.provinces) {
        for (var l in this.provinces[p].locations) {
          if (this.provinces[p].locations[l].postcode == postcode) return true;
        }
      }
      return false;
    },
    redirect(url){
      this.$parent.redirect(url)
    }
  },
  computed: {
    found: function() {
      return window.found;
    }
  }
};
</script>

<style scoped>
.smart-screen {
  display: inline;
}

div.container-add-town-button {
  width: 150px;
}

.add-town-button {
  padding: 0px 15px 0px 15px;
  height: 30px;
  margin-top: 5px;
  margin-bottom: 10px;
  border-radius: 10px;
  background-color: #2c3e5000;
  color: #2c3e50;
}

.add-town-button:hover {
  background-color: #2c3e50;
  color: #f2f2f2;
}

div.container-input-search {
  width: calc(100% - 150px);
}

.input-search {
  margin-top: 5px;
  margin-bottom: 10px;
  height: 30px;
  border-radius: 10px;
}
@media only screen and (max-width: 650px) {
  .smart-screen {
    display: none;
  }

  div.container-add-town-button {
    width: 100%;
  }

  div.container-input-search {
    width: 100%;
  }
}

.reduced-icon {
  padding-top: 0.2rem;
  padding-bottom: 0rem;
  font-size: 0.75rem;
}

hr {
  padding: 0 0 0 0;
  margin: 0 0 0 0;
}

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
  border-bottom: 1px solid rgba(44, 62, 80, 0.5);
  font-weight: normal;
  color: #2c3e50;
  background-color: #ffffff80;
  border-radius: 10px;
  cursor: pointer;
}

.card-town:hover {
  background-color: #2c3e5023;
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
