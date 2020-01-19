<template>
  <div class="body-home" style=" width: 100%; height: 100%; margin: 0 0 0 0; padding: 0 0 0 0;">
    <div style="text-align: left;">
      <span class="filter-row" v-b-modal.filter-intents>
        FILTRAR DISPOSITIVOS
        <i class="material-icons" style="font-size: 0.8rem;">filter_list</i>
      </span>
    </div>
    <b-row class="justify-content-center">
      <b-col
        cols="6"
        style="min-width: 270px; max-width: 140px; margin-top: 10px; "
        md="auto"
        :key="k"
        v-for="(p, k) in this.devices2show"
        class="justify-content-center"
      >
        <Slot :msg="p" />
      </b-col>
    </b-row>

    <b-modal id="filter-intents" hide-footer hide-header size="sm">
      <b-row class="justify-content-center" style="margin-bottom: 1rem; font-weight: bolder;">
        FILTRAR DISPOSITIVOS
      </b-row>
      <hr>
      <b-row class="justify-content-center">
        <b-col cols="1" style="margin-bottom: 1rem;">
          <i class="material-icons icon-style">how_to_reg</i>
        </b-col>
        <b-col cols="9" style="vertical-align: middle;">
          <b-form-select v-model="filter_users" :options="options_users" size="sm" style="margin-top: 0px;"></b-form-select>
        </b-col>
      </b-row>
      <b-row class="justify-content-center">
        <b-col cols="1" style="margin-bottom: 1rem;">
          <i class="material-icons icon-style">filter_1</i>
        </b-col>
        <b-col cols="9">
          <b-form-select v-model="filter_task" :options="options_task" size="sm"></b-form-select>
        </b-col>
      </b-row>
      <b-row class="justify-content-center">
        <b-col cols="1" style="margin-bottom: 1rem;">
          <i class="material-icons icon-style">swap_vert</i>
        </b-col>
        <b-col cols="9">
          <b-form-select v-model="filter_asc" :options="asc_desc" size="sm"></b-form-select>
        </b-col>
      </b-row>
      <hr>
      <b-row class="justify-content-center">
        <b-button @click="showDevices()">
          Aplicar cambios
        </b-button>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
// @ is an alias to /src
// import Struct from '@/components/Struct.vue'
import { mapGetters, mapActions, mapMutations } from "vuex";

import Slot from "@/components/home/Slot";

export default {
  name: "home",
  components: {
    Slot
  },
  data: function() {
    return {
      timer: "",
      devices: this.$store.getters["devices/get"],
      devices2show: Object,
      asc_desc: [{value:'asc', text: 'Ascendente'}, {value:'desc', text: 'Descendente'}],
      options_task : [{value:'event', text: 'Ordenar por eventos'}, {value:'intent', text: 'Ordenar por interacciones'}],
      options_users : [{value:'all', text: 'Mostrar todos'}, {value:'assigned', text: 'Solo asignados'}, {value:'not-assigned', text: 'Solo sin asignar'}],
      filter_users : "all", // all, assigned, not-assigned
      filter_task : "event", // event, intent
      filter_asc : "asc" // asc, desc
    };
  },
  mounted() {
    if (sessionStorage.getItem("access_token") != null) {
      this.updateEvents();
      this.updateDevices();
      this.timer = setInterval(() => {
        this.updateDevices();
      }, 15000);
    } else this.$parent.redirect("/login");
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    updateEvents: function() {
      this.$store.dispatch("tasks/getEvents");
    },
    updateDevices: function() {
      this.$store.dispatch("device/retrieve").then(r => {
        if (r.status == 200) {
          this.devices = this.$store.getters["device/get"];
          this.showDevices()
        } else this.$parent.redirect("/login");
      });
    },
    showDevices: function(){
      console.log("TODO: Showing devices")
      console.log(this.filter_users)
      console.log(this.filter_task)
      console.log(this.filter_asc)
      // change values of this.device2show
      this.devices2show = []
      this.devices.forEach(d => {
        if (this.filter_users == "all") {
          this.devices2show.push(d)
        } else if (this.filter_users == "assigned" && d.relation != null) {
          this.devices2show.push(d)
        } else if (this.filter_users == "not-assigned" && d.relation == null) {
          this.devices2show.push(d)
        }
      });
      this.$bvModal.hide("filter-intents")
    }
  },
  computed: {
    ...mapGetters(["device/get"]),
    ...mapActions(["device/retrieve"]),
    ...mapMutations([
      "auth/updateAccessToken",
      "auth/updateRefreshToken",
      "auth/clearTokens",
      "device/clear"
    ])
  }
};
</script>

<style scoped>
.body-home {
  background-color: #f2f2f2;
}
.icon-style{
  font-size: 1rem; 
  vertical-align: middle;
}

.filter-row {
  text-align: left;
  margin-left: 1rem;
  margin-right: 1rem;
  color: steelblue;
  font-size: 1rem;
  text-transform: uppercase;
  font-style: italic;
  font-weight: normal;
}

.filter-row:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>
