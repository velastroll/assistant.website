<template>
  <div class="body-home" style=" width: 100%; min-height: 100%; margin: 0 0 0 0; padding: 0 0 0 0;">
    <b-row class="justify-content-center">
      <b-col
        cols="12"
        style="min-width: 90%; max-width: 90%; margin-top: 10px; "
        md="auto"
        class="justify-content-center"
      >
        <!-- filters -->
        <b-row style="padding-right: 0px;">
          <!-- type -->
          <div class="container-type-date">
            <b-button-group>
              <b-button
                class="date-btn"
                @click="date_filter='D'"
                :pressed="date_filter == 'D'"
              >DIARIO</b-button>
              <b-button
                class="date-btn"
                @click="date_filter='M'"
                :pressed="date_filter == 'M'"
              >MENSUAL</b-button>
              <b-button
                class="date-btn"
                @click="date_filter='A'"
                :pressed="date_filter == 'A'"
              >ANUAL</b-button>
            </b-button-group>
          </div>
          <!-- input -->
          <div class="container-input-date float-right">
            <!-- button -->
            <div>
              <div class="update-btn">
                <b-button class="date-btn" @click="filterByDate()">
                  <i class="material-icons" style="padding-top: 0.125rem;">sync</i>
                </b-button>
              </div>
            </div>
            <!-- anually filter -->
            <div v-if="date_filter != 'D'" class="input-date" style="width: 100px;">
              <b-form-input v-model="year_filter" type="number" placeholder="Año"></b-form-input>
            </div>
            <!-- monthly filter -->
            <div v-if="date_filter == 'M'" class="input-date" style="width: 100px">
              <b-form-input v-model="month_filter" type="number" placeholder="Mes"></b-form-input>
            </div>
            <!-- daily filter -->
            <div v-if="date_filter == 'D' " class="input-date">
              <b-form-input v-model="daily_filter" type="date"></b-form-input>
            </div>
          </div>
        </b-row>

        <!-- charts -->
        <div v-if="device" class="chart-grid justify-content-center">
          <!-- Titulo -->
          <b-row class="justify-content-center">
            <a class="icon-header-card">
              <i class="material-icons">pie_chart</i>
            </a>
            <a class="text-header-card">Consultas</a>
          </b-row>
          <hr />
          <!-- graficos -->
          <b-row style="width: 100%; justify-content: center;">
            <Intents device="XX:XX:XX:XX:XX:XX" :number="numberOfIntents" :hours="hoursOfIntents" :intents="intents" />
          </b-row>
        </div>

        <div v-if="user==null">
          <span style="color: red;">No tiene ningún usuario asociado</span>
        </div>
        <!-- =========== C A R D S ========== -->
        <div class="flex-container">
          <!-- DISPOSITIVO -->
          <div class="infocard col-lg-5 col-md-5 justify-content-center" v-if="user!=null">
            <!-- dispositivo -->
            <div style="padding-left: 0; padding-right: 0;">
              <div>
                <b-row class="justify-content-center" style="width: 100%; text-align:center;">
                  <a class="text-header-card">
                    <img
                      style="width: 2rem; height: 1.5rem; color: #2c3e50;"
                      src="/marker/device.svg"
                    />
                  </a>
                  <a style="text-align: left; font-weight: bold; padding-top: 0.5rem;">Dispositivo</a>
                </b-row>
              </div>
              <hr />
              <div>
                <div v-if="device != null">
                  <div>
                    <b-button class="dvc assigned" @click="finishRelation(device.device)">
                      <span>{{device.device}}</span>
                    </b-button>
                  </div>
                  <div>
                    <span>Desde el {{parseDate(device.relation.from)}}</span>
                  </div>
                </div>
                <div v-else>
                  <div>
                    <b-button class="dvc unnassigned" v-b-modal.assign>
                      <span>sin asignar</span>
                    </b-button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- USUARIO -->
          <div class="infocard col-lg-5 col-md-5 justify-content-center" v-if="user!=null">
            <div style="padding-left: 0; padding-right: 0;">
              <b-row class="justify-content-center">
                <a class="icon-header-card">
                  <i class="material-icons">face</i>
                </a>
                <a class="text-header-card">Usuario</a>
              </b-row>
              <hr />
              <div>
                <div
                  v-if="user != null"
                  style="width: 100%: padding: 0 1rem 0 1rem; width:100%;"
                  class="text-center"
                >
                  <div>
                    <span>{{user.name}} {{user.surname}}, {{user.nif}}</span>
                  </div>
                  <div>
                    <span>[{{user.postcode}}]</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- AÑADIR TAREA -->
          <div class="infocard col-lg-5 col-md-5 justify-content-center" v-if="device!=null">
            <!-- dispositivo -->
            <div style="padding-left: 0; padding-right: 0;">
              <b-row class="justify-content-center">
                <a class="icon-header-card">
                  <i class="material-icons">flash_on</i>
                </a>
                <a class="text-header-card">Añadir tarea</a>
              </b-row>
            </div>
            <hr />
            <!-- contenido -->
            <div>
              <b-form-select
                v-model="taskSelected"
                :options="taskOptions"
                style="width: 90%; padding: 0 0 0 1rem; border-radius: 1rem; margin: 0.5rem;"
              ></b-form-select>
              <b-button
                class="dvc addevent"
                @click="sendTask()"
                :disabled="!taskSelected"
                style="margin-bottom: 0.5rem;"
              >{{addTaskBtnText()}}</b-button>
            </div>
          </div>

          <!-- TAREAS PENDIENTES -->
          <div class="infocard col-lg-5 col-md-5 justify-content-center" v-if="device!=null">
            <!-- dispositivo -->
            <div style="padding-left: 0; padding-right: 0;">
              <b-row class="justify-content-center" style="width: 100%; text-align:center">
                <a class="text-header-card">
                  <i class="material-icons">query_builder</i>
                </a>
                <a class="text-header-card">Tareas pendientes</a>
              </b-row>
            </div>
            <hr />
            <!-- contenido -->
            <div class="text-center justify-content-center" style=" padding: 0; margin: 0;">
              <b-col v-if="device!=null" style=" padding: 0; margin: 0; width: 100%;">
                <div v-if="device.pending.length == 0">
                  <span>No hay tareas pendientes</span>
                </div>
                <b-row v-else class="justify-content-center">
                  <table style="padding: 0; margin: 0;" class="justify-content-center">
                    <tr
                      :key="i"
                      v-for="(t, i) in device.pending"
                      class="tablerow"
                      style="padding: 0; margin: 0;"
                    >
                      <td
                        class="text-left"
                        style="padding: 0; margin: 0; color: #2c3e50;"
                      >[{{t.event}}]</td>
                      <td
                        class="text-center"
                        style="padding: 0 1rem 0 1rem; margin: 0; font-style: italic;"
                      >{{t.by}}</td>
                      <td class="text-right">{{parseDate(t.at)}}</td>
                    </tr>
                  </table>
                </b-row>
              </b-col>
            </div>
            <a
              v-if="device!=null"
              @click="redirect(`/settings?d=${device.device}`)"
              class="to-settings"
            >Configurar parámetros del dispositivo</a>
            <a
              v-else-if="user!=null"
              @click="redirect(`/settings?l=${user.postcode}`)"
              class="to-settings"
            >Configurar parámetros de la localidad</a>
          </div>
          <!-- ULTIMAS TAREAS REALIZADAS -->
          <div class="infocard col-lg-5 col-md-5 justify-content-center" v-if="device!=null">
            <div style="padding-left: 0; padding-right: 0;">
              <b-row class="justify-content-center">
                <a class="icon-header-card">
                  <i class="material-icons">done_all</i>
                </a>
                <a class="text-header-card">Últimas tareas realizadas</a>
              </b-row>
            </div>
            <hr />
            <b-row v-if="device.last_events.length == 0">No se han realizado acciones</b-row>
            <b-row
              :key="i"
              v-for="(t, i) in device.last_events"
              class="tablerow"
              style="margin: 0; padding: 0; justify-content: center;"
            >
              <span style="margin-right: 0.5rem">[{{t.name}}]</span>
              <span>el {{parseDate(t.timestamp)}}</span>
            </b-row>
          </div>

          <!-- ULTIMOS ESTADOS -->
          <div class="infocard col-lg-5 col-md-5 justify-content-center" v-if="device!=null">
            <!-- dispositivo -->
            <div style="padding-left: 0; padding-right: 0;">
              <b-row class="justify-content-center">
                <a class="icon-header-card">
                  <i class="material-icons">outlined_flag</i>
                </a>
                <a class="text-header-card">Últimos estados</a>
              </b-row>
            </div>
            <hr />
            <b-row v-if="device.last_status.length == 0">No se han realizado acciones</b-row>
            <b-row
              :key="i"
              v-for="(t, i) in device.last_status"
              class="tablerow"
              style="margin: 0; padding: 0; justify-content: center;"
            >
              <span style="margin-right: 0.5rem">[{{t.type}}]</span>
              <span>el {{parseDate(t.timestamp)}}</span>
            </b-row>
          </div>
        </div>
      </b-col>
    </b-row>

    <!-- modal -->
    <b-modal id="assign" title="Escoge un dispositivo">
      <div style="font-style: italic;">Mostrando dispositivos disponibles:</div>
      <div :key="i" v-for="(d, i) in this.unrelated" style="width: 100%; text-align: center;">
        <span class="bolder-link" @click="dev2assign = d.device">[{{d.device}}]</span>
        hizo ping hace {{timeTo(d.last_status[0].timestamp)}} segundos
      </div>
      <template v-slot:modal-footer>
        <div class="w-100">
          <p class="float-left">
            Seleccionado:
            <a style="color: #4b93db">{{dev2assign}}</a>
          </p>
          <b-button
            :disabled="dev2assign == 'Ninguno'"
            variant="primary"
            size="sm"
            class="float-right"
            @click="show=false; addRelation(dev2assign)"
          >Asignar</b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters, mapActions, mapMutations } from "vuex";
import Intents from "@/components/stats/Intents";

export default {
  name: "Stats",
  components: {
    Intents
  },

  data: function() {
    return {
      date_filter: "A",
      daily_filter: "",
      month_filter: "null",
      year_filter: "",
      user: null,
      users: [],
      dev2assign: "Ninguno",
      device: null,
      devices: [],
      unrelated: [],
      events: [],
      taskSelected: null,
      taskOptions: [{ value: null, text: "Nada" }],
      numberOfIntents: Object,
      hoursOfIntents: Object,
      intents: []
    };
  },
  mounted() {
    if (sessionStorage.getItem("access_token") != null) {
      // download data
      let date = new Date();
      var month = date.getMonth();
      if (month++ < 10) month = "0" + month;
      this.month_filter = month;
      this.year_filter = date.getFullYear();
      this.daily_filter =
        this.year_filter + "-" + this.month_filter + "-" + date.getDate();
      this.updateAll();
    } else {
      this.$parent.redirect("/login");
    }
    this.filterDevice();
  },
  methods: {
    addRelation(deviceid) {
      this.$store
        .dispatch("relation/new", { nif: this.nif, device: deviceid })
        .then(r => {
          if (r.status == 200) {
            this.updateAll();
            this.makeToast("success", "Success", r.data);
            this.$bvModal.hide("assign");
          } else {
            this.makeToast("danger", "Error", r.data);
          }
        });
    },
    finishRelation(deviceid) {
      this.$store.dispatch("relation/delete", { device: deviceid }).then(r => {
        if (r.status == 200) {
          this.updateAll();
          this.makeToast("success", "Success", r.data);
          this.device = null;
        } else {
          this.makeToast("danger", "Error", r.data);
        }
      });
    },
    timeTo(timestamp) {
      var date = new Date(timestamp);
      var a = date.getTime();
      var now = new Date();
      var n = now.getTime();
      return parseInt((n - a) / 1000.0);
    },
    getNifAndDevice(device) {
      let dev = device.replace("%3", ":");
      this.devices.forEach(d => {
        if (d.device == dev) {
          this.device = d;
          this.filterByDate();
          if (d.relation != null) {
            this.nif = d.relation.user.nif;
          }
        }
      });
    },
    /* Create a new task for a specific device. */
    sendTask() {
      if (this.taskSelected == null) {
        this.makeToast(
          "danger",
          "Oups",
          `La tarea ${this.taskSelected} no es válida.`
        );
      } else {
        this.$store
          .dispatch("tasks/new", {
            event: this.taskSelected,
            device: this.device.device
          })
          .then(r => {
            if (r.status == 200) {
              this.taskSelected = null;
              this.makeToast(
                "success",
                "Añadida",
                "Nueva tarea añadida al dispositivo."
              );
            } else {
              this.makeToast("danger", `Error [${r.status}]`, `${r.data}`);
            }
            this.updateDevices();
          });
      }
    },
    updateAll() {
      this.updateUsers();
    },
    /** Retrieve event types */
    updateEvents: function() {
      this.$store.dispatch("tasks/getEvents").then(r => {
        if (r.status == 200) {
          this.events = this.$store.getters["tasks/getEvents"];
          this.taskOptions = [{ value: null, text: "Nada" }];
          for (var i in this.events) {
            this.taskOptions.push({
              value: this.events[i].name,
              text: this.events[i].name
            });
          }
          this.selectInfo();
        }
      });
    },
    selectInfo() {
      let deviceQ = this.$route.query["d"];
      this.nif = this.$route.query["u"];
      if (deviceQ != null) {
        // retrieve this.nif and this.device
        this.getNifAndDevice(deviceQ);
      } else if (this.nif != null) {
        this.filterDevice();
      }

      // retrieve user
      this.users.forEach(u => {
        if (u.nif == this.nif) {
          this.user = u;
        }
      });

      // retrieve data
      if (this.nif == null && deviceQ == null) this.$parent.redirect("/users");
    },
    /** Retrieve users */
    updateUsers() {
      this.$store.dispatch("users/retrieve").then(r => {
        if (r.status == 200) {
          this.users = r.data;
          this.updateDevices();
        } else {
          this.$parent.makeToast("danger", `Oups ${r.status}`, r.description);
        }
      });
    },
    /** Retrieve devices */
    updateDevices() {
      this.$store.dispatch("device/retrieve").then(r => {
        if (r.status == 200) {
          this.devices = r.data;
          this.updateEvents();
          this.splitUnrelatedDevices();
        } else {
          this.$parent.makeToast("danger", `Oups ${r.status}`, r.description);
        }
      });
    },
    filterByDate() {
      if (this.device == null) return;
      var payload = {
        device: this.device.device
      };
      if (this.date_filter == "A") {
        // filter by year
        let from = parseInt(this.year_filter) + "-01-01T00:00:00.000Z";
        let to = parseInt(this.year_filter) + "-12-31T23:59:59.999Z";
        payload.interval = { from: from, to: to };
      } else if (this.date_filter == "M") {
        // filter by month
        var month = parseInt(this.month_filter);
        if (month < 10) month = "0" + month;
        let from =
          parseInt(this.year_filter) + "-" + month + "-01T00:00:00.000Z";
        let to = parseInt(this.year_filter) + "-" + month + "-31T23:59:59.999Z";
        payload.interval = { from: from, to: to };
      } else if (this.date_filter == "D") {
        // filter by month
        let from = this.daily_filter + "T00:00:00.000Z";
        let to = this.daily_filter + "T23:59:59.999Z";
        payload.interval = { from: from, to: to };
      } else {
        this.makeToast(
          "danger",
          "Oups",
          "No se ha podido filtrar por razones técnicas."
        );
        return;
      }
      this.$store.dispatch("intents/get", payload).then(res => {
        this.numberOfIntents = this.$store.getters["intents/intentNumber"];
        this.hoursOfIntents = this.$store.getters["intents/intentHour"];
        this.intents = this.$store.getters["intents/getIntents"];
      });
    },
    /* Sets into [this.device] the device which has an active relation with [this.nif] */
    filterDevice() {
      this.devices.forEach(it => {
        if (it.relation != null) {
          if (it.relation.user.nif == this.nif) {
            this.device = it;
            this.filterByDate();
          }
        }
      });
    },
    splitUnrelatedDevices() {
      this.unrelated = [];
      this.devices.forEach(d => {
        if (d.relation == null) this.unrelated.push(d);
      });
    },
    addTaskBtnText() {
      if (this.taskSelected) return "Añadir tarea";
      else return "Elige primero";
    },
    parseDate(date) {
      return (
        date.substring(8, 10) +
        "/" +
        date.substring(5, 7) +
        "/" +
        date.substring(0, 4) +
        " a las " +
        date.substring(11, 13) +
        ":" +
        date.substring(14, 16)
      );
    },
    makeToast(a, b, c) {
      this.$parent.makeToast(a, b, c);
    },
    retrieveStats() {
      this.$store.dispatch("tasks/get", {
        device: this.device,
        type: this.date_filter
      });
    },
    redirect(url) {
      this.$parent.redirect(url);
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
.flex-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
a.icon-header-card {
  text-align: left;
  font-weight: bold;
  padding-top: 0.5rem;
  text-transform: uppercase;
}

a.text-header-card {
  text-align: left;
  font-weight: bold;
  padding-top: 0.5rem;
  text-transform: uppercase;
}

hr {
  margin-top: 0rem;
  margin-bottom: 0.5rem;
}

a.to-settings {
  color: blue;
  cursor: pointer;
  text-decoration: underline;
}
a.to-settings:hover {
  color: rgb(207, 0, 162);
  cursor: pointer;
  text-decoration: underline;
}

.tablerow:hover {
  background: #2c3e5027;
  cursor: pointer;
}

span.bolder-link {
  font-weight: bold;
  cursor: pointer;
}
span.bolder-link:hover {
  color: #4b93db;
}

.event-content {
  width: 250px;
}

div.infocard {
  background: white;
  border: solid;
  border-width: 0px 1px 1px 0px;
  border-color: rgba(185, 185, 185, 0.096);
  border-radius: 1rem;
  min-width: 327px;
  margin: 0.5rem;
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 0.5rem;
}
.unnassigned {
  color: brown;
}

.unnassigned:hover {
  color: darkgreen;
}

.dvc {
  background: #f2f2f200;
  border: solid;
  text-transform: uppercase;
  border-radius: 1rem;
  border-width: 1px 1px 1px 1px;
  margin: 0 0 0 0px;
  padding-top: 0px;
  padding-bottom: 0px;
}

.dvc:hover span {
  display: none;
}

.assigned:hover:before {
  content: "desasignar dispositivo";
}
.unnassigned:hover:before {
  content: "elegir dispositivo";
}

.addevent {
  color: darkgreen;
}

.addevent:disabled {
  border-color: gray;
  color: gray;
}

.addevent:hover {
  color: white;
  border-color: darkgreen;
  background: darkgreen;
}

.assigned {
  color: #2c3e50;
}

.assigned:hover {
  color: brown;
}

.chart-grid {
  background: white;
  border-radius: 1rem;
  width: 100%;
  margin: 0rem 0rem 1rem 0rem;
}
.task-grid {
  min-width: 300px;
  justify-content: center;
  width: 90%;
}
.input-date {
  float: right;
  padding-right: 1rem;
}
div.container-type-date {
  width: 300px;
  float: left;
}

div.container-input-date {
  min-width: 275px;
  width: calc(100% - 300px);
  float: right;
}

@media only screen and (max-width: 780px) {
  .chart-grid {
    width: 100%;
  }

  .task-grid {
    width: 100%;
  }

  div.container-type-date {
    width: 100%;
    float: none;
    justify-content: center;
  }

  div.container-input-date {
    width: 100%;
    float: none;
  }

  div.input-date {
    width: 80%;
  }
}

.update-btn {
  float: right;
}

.date-btn {
  padding: 0px 15px 0px 15px;
  height: 30px;
  margin-top: 5px;
  margin-bottom: 10px;
  border-radius: 10px;
  background-color: #2c3e5000;
  color: #2c3e50;
}

.date-btn:hover {
  background-color: #2c3e50;
  color: #f2f2f2;
}

.date-btn:active {
  background-color: #2c3e50;
  color: #f2f2f2;
}

.body-home {
  background-color: #f2f2f2;
  margin: 0;
  padding: 0;
}
</style>
